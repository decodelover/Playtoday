create table public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  enquiry_type text not null,
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  status text not null default 'new',
  created_at timestamptz not null default now(),
  constraint contact_submissions_enquiry_type_check
    check (
      enquiry_type in (
        'general',
        'product',
        'data_and_performance',
        'responsible_play',
        'privacy'
      )
    ),
  constraint contact_submissions_name_length_check
    check (char_length(name) between 2 and 100),
  constraint contact_submissions_email_length_check
    check (char_length(email) between 3 and 254),
  constraint contact_submissions_subject_length_check
    check (char_length(subject) between 3 and 160),
  constraint contact_submissions_message_length_check
    check (char_length(message) between 20 and 4000),
  constraint contact_submissions_status_check
    check (status = 'new')
);

comment on table public.contact_submissions is
  'Contact enquiries submitted through the PlayToday public website.';
comment on column public.contact_submissions.status is
  'Server-controlled workflow status. Phase 2F accepts new submissions only.';

alter table public.contact_submissions enable row level security;
alter table public.contact_submissions force row level security;

revoke all on table public.contact_submissions from public, anon, authenticated;
grant insert on table public.contact_submissions to service_role;
