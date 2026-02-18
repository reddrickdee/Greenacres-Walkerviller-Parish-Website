-- ============================================================================
-- Supabase Schema: Greenacres Walkerville Catholic Parish CMS
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- ============================================================================

-- 1. Mass Schedule Entries
-- ────────────────────────────────────────────────────────────────────────────
create table if not exists mass_schedule_entries (
  id              text        primary key,
  church          text        not null,
  address         text        not null,
  day_of_week     int         not null check (day_of_week between 1 and 7),
  start_time      time        not null,
  type            text        not null,
  notes           text        null,
  duration_minutes int        not null default 60 check (duration_minutes > 0),
  is_active       boolean     not null default true,
  sort_order      int         not null default 0,
  updated_at      timestamptz not null default now()
);

comment on table mass_schedule_entries is
  'Weekly Mass schedule. dayOfWeek: 1=Mon … 7=Sun.';

-- 2. Newsletter Items
-- ────────────────────────────────────────────────────────────────────────────
create table if not exists newsletter_items (
  id                text        primary key,
  title             text        not null,
  url               text        not null,
  is_current        boolean     not null default false,
  published_on      date        not null,
  native_date       text        null,
  cover_image       text        null,
  priest_reflection text        null,
  updated_at        timestamptz not null default now()
);

comment on table newsletter_items is
  'Weekly bulletin / newsletter entries. PDF URL is always required.';

-- 3. Bulletin Sections (native bulletin content)
-- ────────────────────────────────────────────────────────────────────────────
create table if not exists bulletin_sections (
  id              bigint generated always as identity primary key,
  newsletter_id   text        not null references newsletter_items(id) on delete cascade,
  sort_order      int         not null default 0,
  title           text        not null,
  content         text        not null,
  image_path      text        null,
  image_focal_x   real        null,
  image_focal_y   real        null
);

comment on table bulletin_sections is
  'Sections within a native digital bulletin. Linked to newsletter_items.';

-- 4. Row Level Security
-- ────────────────────────────────────────────────────────────────────────────
alter table mass_schedule_entries enable row level security;
alter table newsletter_items      enable row level security;
alter table bulletin_sections     enable row level security;

-- Public read access (anon key)
create policy "anon_read_mass_schedule"
  on mass_schedule_entries for select
  to anon
  using (true);

create policy "anon_read_newsletter_items"
  on newsletter_items for select
  to anon
  using (true);

create policy "anon_read_bulletin_sections"
  on bulletin_sections for select
  to anon
  using (true);

-- Staff write access (authenticated role — managed via Supabase Auth)
create policy "auth_write_mass_schedule"
  on mass_schedule_entries for all
  to authenticated
  using (true)
  with check (true);

create policy "auth_write_newsletter_items"
  on newsletter_items for all
  to authenticated
  using (true)
  with check (true);

create policy "auth_write_bulletin_sections"
  on bulletin_sections for all
  to authenticated
  using (true)
  with check (true);

-- 5. Storage Buckets (run via Dashboard → Storage → New bucket)
-- ────────────────────────────────────────────────────────────────────────────
-- Create these manually in Supabase Dashboard:
--   • Bucket: "bulletins"       (public) — for PDF files
--   • Bucket: "bulletin-images" (public) — for native bulletin imagery
--
-- Or via SQL:
-- insert into storage.buckets (id, name, public) values ('bulletins', 'bulletins', true);
-- insert into storage.buckets (id, name, public) values ('bulletin-images', 'bulletin-images', true);
