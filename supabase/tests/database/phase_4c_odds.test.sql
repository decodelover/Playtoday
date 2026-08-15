begin;

select plan(25);

select has_table('public', 'bookmakers', 'bookmakers table exists');
select has_table('public', 'bookmaker_capabilities', 'bookmaker capabilities table exists');
select has_table('public', 'canonical_markets', 'canonical markets table exists');
select has_table('public', 'current_odds', 'current odds table exists');
select has_table('public', 'odds_snapshots', 'odds history table exists');
select has_table('public', 'odds_ingestion_runs', 'odds runs table exists');
select has_table('public', 'odds_provider_health', 'odds health table exists');
select has_view('public', 'v_current_odds', 'authenticated odds read view exists');

select ok(
  to_regprocedure('public.ingest_odds_observation(uuid,uuid,uuid,text,numeric,text,numeric,text,text,text,text,text,timestamptz,timestamptz)') is not null,
  'atomic observation function exists'
);
select ok(
  to_regprocedure('public.ingest_odds_batch(jsonb)') is not null,
  'bounded batch ingestion function exists'
);
select is((select count(*)::integer from public.canonical_markets), 7, 'seven canonical markets are seeded');
select is((select count(*)::integer from public.provider_market_mappings), 7, 'seven provider markets are mapped');
select is((select count(*)::integer from public.provider_bookmaker_mappings), 14, 'verified bookmaker mappings are seeded');
select is(
  (select count(*)::integer from public.bookmaker_capabilities where availability_status = 'not_supported' and bookmaker_id in (select id from public.bookmakers where canonical_key in ('sportybet','bet9ja','msport'))),
  3,
  'target bookmakers are truthfully marked unsupported by current source'
);

select ok(not has_table_privilege('anon', 'public.current_odds', 'select'), 'anonymous users cannot read odds');
select ok(has_table_privilege('authenticated', 'public.current_odds', 'select'), 'authenticated users can read current odds');
select ok(not has_table_privilege('authenticated', 'public.odds_snapshots', 'select'), 'authenticated users cannot read internal history');
select ok(not has_table_privilege('authenticated', 'public.provider_market_mappings', 'select'), 'authenticated users cannot read internal mappings');
select ok(not has_function_privilege('authenticated', 'public.ingest_odds_observation(uuid,uuid,uuid,text,numeric,text,numeric,text,text,text,text,text,timestamptz,timestamptz)', 'execute'), 'authenticated users cannot ingest an observation');
select ok(not has_function_privilege('authenticated', 'public.ingest_odds_batch(jsonb)', 'execute'), 'authenticated users cannot call batch ingestion');
select ok(has_function_privilege('service_role', 'public.ingest_odds_batch(jsonb)', 'execute'), 'service role can call batch ingestion');

select ok((select relrowsecurity from pg_class where oid = 'public.current_odds'::regclass), 'current odds RLS is enabled');
select ok((select relrowsecurity from pg_class where oid = 'public.odds_snapshots'::regclass), 'odds history RLS is enabled');
select ok((select relrowsecurity from pg_class where oid = 'public.odds_ingestion_runs'::regclass), 'odds runs RLS is enabled');
select is(
  (select count(*)::integer from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename in ('current_odds','odds_snapshots','odds_ingestion_runs')),
  0,
  'internal odds tables are not published directly to Realtime'
);

select * from finish();
rollback;
