-- ============================================================================
-- event_registrations — public event RSVP capture for the parish website.
--
-- Apply via the Supabase SQL editor (Dashboard → SQL) or the Supabase CLI.
-- RLS model: anonymous visitors may INSERT a registration; only authenticated
-- (staff) users may read the rows (they contain personal information).
-- A SECURITY DEFINER aggregate function exposes ONLY the booked count so the
-- public form can show remaining capacity without leaking any PII.
-- ============================================================================

create table if not exists public.event_registrations (
    id                  uuid primary key default gen_random_uuid(),
    event_id            text not null,                 -- Sanity document _id
    name                text not null,
    email               text not null,
    phone               text,
    attendee_count      int  not null default 1 check (attendee_count between 1 and 20),
    dietary_notes       text,
    accessibility_notes text,
    status              text not null default 'confirmed'
                        check (status in ('confirmed', 'cancelled', 'waitlisted')),
    created_at          timestamptz not null default now()
);

create index if not exists event_registrations_event_id_idx
    on public.event_registrations (event_id);

alter table public.event_registrations enable row level security;

-- Anonymous visitors may submit a registration, but cannot read or modify rows.
drop policy if exists "anon can insert registrations" on public.event_registrations;
create policy "anon can insert registrations"
    on public.event_registrations
    for insert
    to anon, authenticated
    with check (true);

-- Only authenticated (staff) users may read registrations (they hold PII).
drop policy if exists "authenticated can read registrations" on public.event_registrations;
create policy "authenticated can read registrations"
    on public.event_registrations
    for select
    to authenticated
    using (true);

-- Safe capacity helper: returns the total booked attendees for an event.
-- SECURITY DEFINER so anon can read the aggregate count without table SELECT.
create or replace function public.event_registration_count(p_event_id text)
returns int
language sql
security definer
set search_path = public
as $$
    select coalesce(sum(attendee_count), 0)::int
    from public.event_registrations
    where event_id = p_event_id and status = 'confirmed';
$$;

grant execute on function public.event_registration_count(text) to anon, authenticated;
