begin;

select plan(40);

select has_table('public', 'profiles', 'profiles table exists');
select has_table('public', 'user_preferences', 'user preferences table exists');
select has_table('public', 'contact_submissions', 'contact submissions table exists');

select ok(
  (select relrowsecurity and relforcerowsecurity from pg_class where oid = 'public.profiles'::regclass),
  'profiles RLS is enabled and forced'
);
select ok(
  (select relrowsecurity and relforcerowsecurity from pg_class where oid = 'public.user_preferences'::regclass),
  'user preferences RLS is enabled and forced'
);
select ok(
  (select relrowsecurity and relforcerowsecurity from pg_class where oid = 'public.contact_submissions'::regclass),
  'contact submissions RLS is enabled and forced'
);

select ok(
  to_regprocedure(
    'public.complete_onboarding(text[],text[],text[],numeric,text,text,jsonb,boolean,text)'
  ) is not null,
  'atomic onboarding completion function exists'
);
select ok(
  to_regprocedure(
    'public.save_onboarding_progress(text,text[],text[],text[],numeric,text,text,jsonb,boolean,text)'
  ) is not null,
  'atomic onboarding progress function exists'
);
select ok(
  to_regprocedure('public.handle_new_user()') is null,
  'legacy public profile trigger function is removed'
);
select ok(
  to_regprocedure('public.handle_new_user_preferences()') is null,
  'legacy public preference trigger function is removed'
);
select is(
  (
    select count(*)::integer
    from pg_trigger
    where tgrelid = 'auth.users'::regclass
      and tgname = 'on_auth_user_created'
      and not tgisinternal
  ),
  1,
  'one canonical profile-creation trigger exists'
);

insert into auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at
)
values
  (
    '10000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'phase3a-a@example.invalid',
    '',
    now(),
    now(),
    now()
  ),
  (
    '20000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'phase3a-b@example.invalid',
    '',
    now(),
    now(),
    now()
  );

select is(
  (select count(*)::integer from public.user_preferences),
  0,
  'signup does not create unconfirmed preference or acknowledgement data'
);

set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"10000000-0000-0000-0000-000000000001","role":"authenticated"}',
  true
);

select results_eq(
  $$select id from public.profiles order by id$$,
  $$values ('10000000-0000-0000-0000-000000000001'::uuid)$$,
  'User A reads only their profile'
);
select is_empty(
  $$select id from public.profiles where id = '20000000-0000-0000-0000-000000000002'$$,
  'User A cannot read User B profile'
);
select lives_ok(
  $$update public.profiles set display_name = 'Member A' where id = '10000000-0000-0000-0000-000000000001'$$,
  'User A can update an allowed profile field'
);
select is_empty(
  $$
    with changed as (
      update public.profiles
      set display_name = 'Not allowed'
      where id = '20000000-0000-0000-0000-000000000002'
      returning id
    )
    select id from changed
  $$,
  'User A cannot update User B profile'
);
select throws_ok(
  $$update public.profiles set onboarding_completed_at = now() where id = '10000000-0000-0000-0000-000000000001'$$,
  '42501',
  null,
  'User A cannot forge onboarding completion'
);

select lives_ok(
  $$
    insert into public.user_preferences (
      user_id,
      preferred_sports,
      preferred_bookmakers,
      preferred_markets,
      target_odds,
      default_strategy,
      risk_preference,
      notification_channels,
      responsible_play_ack,
      timezone
    ) values (
      '10000000-0000-0000-0000-000000000001',
      array['football'],
      array['sportybet'],
      array['1x2'],
      3.00,
      'balanced',
      'moderate',
      '{"email":false,"in_app":true}'::jsonb,
      false,
      'Africa/Lagos'
    )
  $$,
  'User A can insert their preferences'
);
select is_empty(
  $$select user_id from public.user_preferences where user_id = '20000000-0000-0000-0000-000000000002'$$,
  'User A cannot read User B preferences'
);
select is_empty(
  $$
    with changed as (
      update public.user_preferences
      set target_odds = 5.00
      where user_id = '20000000-0000-0000-0000-000000000002'
      returning user_id
    )
    select user_id from changed
  $$,
  'User A cannot update User B preferences'
);
select throws_ok(
  $$insert into public.user_preferences (user_id) values ('20000000-0000-0000-0000-000000000002')$$,
  '42501',
  null,
  'User A cannot forge User B ownership'
);
select throws_ok(
  $$delete from public.user_preferences where user_id = '10000000-0000-0000-0000-000000000001'$$,
  '42501',
  null,
  'normal users cannot delete preference rows directly'
);
select throws_ok(
  $$
    select public.complete_onboarding(
      array['football'],
      array['sportybet'],
      array['1x2'],
      3.00,
      'balanced',
      'moderate',
      '{"email":false,"in_app":true}'::jsonb,
      false,
      'Africa/Lagos'
    )
  $$,
  '23514',
  null,
  'completion requires responsible-play acknowledgement'
);
select lives_ok(
  $$
    select public.complete_onboarding(
      array['football'],
      array['sportybet'],
      array['1x2'],
      3.00,
      'balanced',
      'moderate',
      '{"email":false,"in_app":true}'::jsonb,
      true,
      'Africa/Lagos'
    )
  $$,
  'User A can complete onboarding through the authenticated RPC'
);
select ok(
  (
    select onboarding_completed_at is not null and onboarding_step = 'completed'
    from public.profiles
    where id = '10000000-0000-0000-0000-000000000001'
  ),
  'completion state is internally consistent'
);
select lives_ok(
  $$
    select public.complete_onboarding(
      array['football'],
      array['sportybet'],
      array['1x2'],
      3.00,
      'balanced',
      'moderate',
      '{"email":false,"in_app":true}'::jsonb,
      true,
      'Africa/Lagos'
    )
  $$,
  'duplicate completion is idempotent'
);
select is(
  (
    select count(*)::integer
    from public.user_preferences
    where user_id = '10000000-0000-0000-0000-000000000001'
  ),
  1,
  'duplicate completion keeps one preference row'
);

select set_config(
  'request.jwt.claims',
  '{"sub":"20000000-0000-0000-0000-000000000002","role":"authenticated"}',
  true
);
select results_eq(
  $$select id from public.profiles order by id$$,
  $$values ('20000000-0000-0000-0000-000000000002'::uuid)$$,
  'User B reads only their profile'
);
select is_empty(
  $$select id from public.profiles where id = '10000000-0000-0000-0000-000000000001'$$,
  'User B cannot read User A profile'
);

set local role anon;
select set_config('request.jwt.claims', '{"role":"anon"}', true);
select throws_ok(
  $$select * from public.profiles$$,
  '42501',
  null,
  'anonymous users cannot read profiles'
);
select throws_ok(
  $$select * from public.user_preferences$$,
  '42501',
  null,
  'anonymous users cannot read preferences'
);
select throws_ok(
  $$
    select public.complete_onboarding(
      array['football'],
      array['sportybet'],
      array['1x2'],
      3.00,
      'balanced',
      'moderate',
      '{"email":false,"in_app":true}'::jsonb,
      true,
      'UTC'
    )
  $$,
  '42501',
  null,
  'anonymous users cannot execute onboarding completion'
);
select throws_ok(
  $$select * from public.contact_submissions$$,
  '42501',
  null,
  'anonymous users cannot read contact submissions'
);
select throws_ok(
  $$
    insert into public.contact_submissions (
      enquiry_type,
      name,
      email,
      subject,
      message
    ) values (
      'general',
      'Test User',
      'test@example.invalid',
      'Test subject',
      'This isolated row is rolled back after the test.'
    )
  $$,
  '42501',
  null,
  'anonymous users cannot write contact submissions'
);

reset role;
select ok(
  has_function_privilege(
    'authenticated',
    'public.complete_onboarding(text[],text[],text[],numeric,text,text,jsonb,boolean,text)',
    'execute'
  ),
  'authenticated users can execute the narrow completion RPC'
);
select ok(
  not has_function_privilege(
    'anon',
    'public.complete_onboarding(text[],text[],text[],numeric,text,text,jsonb,boolean,text)',
    'execute'
  ),
  'anonymous users have no completion RPC privilege'
);
select ok(
  not has_schema_privilege('authenticated', 'private', 'usage'),
  'authenticated users cannot access the private schema'
);
select ok(
  has_table_privilege('service_role', 'public.contact_submissions', 'insert'),
  'service role retains the approved contact insert privilege'
);
select ok(
  not has_table_privilege('service_role', 'public.contact_submissions', 'select'),
  'service role is not granted contact read access'
);
select is(
  (
    select count(*)::integer
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename in ('profiles', 'user_preferences', 'contact_submissions')
  ),
  0,
  'private Phase 2 tables are not published to Realtime'
);

select * from finish();
rollback;
