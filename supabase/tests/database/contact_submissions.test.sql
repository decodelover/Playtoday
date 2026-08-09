begin;

select plan(10);

select has_table('public', 'contact_submissions', 'contact submissions table exists');
select has_column('public', 'contact_submissions', 'id', 'id column exists');
select has_column(
  'public',
  'contact_submissions',
  'enquiry_type',
  'enquiry type column exists'
);
select has_column('public', 'contact_submissions', 'name', 'name column exists');
select has_column('public', 'contact_submissions', 'email', 'email column exists');
select has_column('public', 'contact_submissions', 'subject', 'subject column exists');
select has_column('public', 'contact_submissions', 'message', 'message column exists');
select has_column('public', 'contact_submissions', 'status', 'status column exists');
select ok(
  (select relrowsecurity and relforcerowsecurity from pg_class where oid = 'public.contact_submissions'::regclass),
  'RLS is enabled and forced'
);
select ok(
  not has_table_privilege('anon', 'public.contact_submissions', 'select,insert,update,delete')
  and not has_table_privilege('authenticated', 'public.contact_submissions', 'select,insert,update,delete'),
  'public API roles have no contact submission privileges'
);

select * from finish();
rollback;
