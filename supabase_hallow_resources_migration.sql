-- Migration to create featured_resources table for Hallow integration

create table if not exists featured_resources (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text not null,
  image_url text not null,
  link_url text not null,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Setup Row Level Security (RLS)
alter table featured_resources enable row level security;

-- Create policy to allow public read access
create policy "Allow public read access on featured_resources."
  on featured_resources for select
  using (true);

-- Insert dummy data for Lent Pray40
-- using DO NOTHING on conflict (requires a unique constraint, but since there isn't one on title by default, we just leave it for now, 
-- or we can just inform the user they don't need to run it)
insert into featured_resources (title, description, image_url, link_url, is_active)
select 
  'Lent Pray40: The Return',
  'Join the 2026 Lenten challenge on Hallow. A journey back to God inspired by The Brothers Karamazov and the Parable of the Prodigal Son.',
  'https://assets.hallow.com/hallow-web-assets/images/challenges/pray40-2024/pray40-share-img.jpg',
  'https://hallow.com/collections/2845?is_shared=true',
  true
where not exists (
  select 1 from featured_resources where title = 'Lent Pray40: The Return'
);
