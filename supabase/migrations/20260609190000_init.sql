create table if not exists public.gallery_images (
  id text primary key,
  category_id text not null,
  name text not null,
  src text not null,
  is_default boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists gallery_images_category_id_idx on public.gallery_images (category_id);
create index if not exists gallery_images_sort_order_idx on public.gallery_images (category_id, sort_order, created_at);

alter table public.gallery_images enable row level security;

drop policy if exists "Public read gallery images" on public.gallery_images;
create policy "Public read gallery images"
  on public.gallery_images
  for select
  using (true);

drop policy if exists "Public write gallery images" on public.gallery_images;
create policy "Public write gallery images"
  on public.gallery_images
  for all
  using (true)
  with check (true);

create table if not exists public.homepage_media (
  slot_id text primary key,
  name text not null,
  src text not null,
  is_default boolean not null default false,
  updated_at timestamptz not null default now()
);

alter table public.homepage_media enable row level security;

drop policy if exists "Public read homepage media" on public.homepage_media;
create policy "Public read homepage media"
  on public.homepage_media
  for select
  using (true);

drop policy if exists "Public write homepage media" on public.homepage_media;
create policy "Public write homepage media"
  on public.homepage_media
  for all
  using (true)
  with check (true);

create table if not exists public.booking_requests (
  id text primary key,
  status text not null default 'new',
  created_at timestamptz not null default now(),
  name text,
  phone text,
  email text,
  pet_name text,
  animal text,
  other_animal text,
  service text,
  date text,
  time text,
  recent_care text,
  conditions text,
  notes text
);

create index if not exists booking_requests_created_at_idx on public.booking_requests (created_at desc);
create index if not exists booking_requests_status_idx on public.booking_requests (status);

alter table public.booking_requests enable row level security;

drop policy if exists "Public read booking requests" on public.booking_requests;
create policy "Public read booking requests"
  on public.booking_requests
  for select
  using (true);

drop policy if exists "Public write booking requests" on public.booking_requests;
create policy "Public write booking requests"
  on public.booking_requests
  for all
  using (true)
  with check (true);

insert into public.gallery_images (id, category_id, name, src, is_default, sort_order)
values
  ('full-haircut-default-0', 'full-haircut', 'Gallery image 1', '/before-groom.webp', true, 0),
  ('full-haircut-default-1', 'full-haircut', 'Gallery image 2', '/after-groom.webp', true, 1),
  ('full-haircut-default-2', 'full-haircut', 'Gallery image 3', 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=900&q=85', true, 2),
  ('bath-brush-default-0', 'bath-brush', 'Gallery image 1', 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=900&q=85', true, 0),
  ('bath-brush-default-1', 'bath-brush', 'Gallery image 2', 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=900&q=85', true, 1),
  ('bath-brush-default-2', 'bath-brush', 'Gallery image 3', 'https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&w=900&q=85', true, 2),
  ('bath-trim-default-0', 'bath-trim', 'Gallery image 1', 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=900&q=85', true, 0),
  ('bath-trim-default-1', 'bath-trim', 'Gallery image 2', 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?auto=format&fit=crop&w=900&q=85', true, 1),
  ('bath-trim-default-2', 'bath-trim', 'Gallery image 3', '/alyssa-working.jpeg', true, 2)
on conflict (id) do update
set
  category_id = excluded.category_id,
  name = excluded.name,
  src = excluded.src,
  is_default = excluded.is_default,
  sort_order = excluded.sort_order;

insert into public.homepage_media (slot_id, name, src, is_default)
values
  ('logo', 'Brand logo', '/logo.jpeg', true),
  ('hero-banner', 'Hero banner', '/hero-banner.jpeg', true),
  ('journal-video', 'Finished grooming video', '/grooming-placeholder.webm', true),
  ('transformation-before', 'Transformation before', '/before-groom.webp', true),
  ('transformation-after', 'Transformation after', '/after-groom.webp', true),
  ('studio-main', 'Alyssa grooming', '/alyssa-working.jpeg', true),
  ('studio-secondary', 'Alyssa portrait', '/groomer-and-dog.webp', true),
  ('service-bath-brush', 'Bath & Brush', 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1000&q=85', true),
  ('service-full-haircut', 'Bath & Full Haircut', '/after-groom.webp', true),
  ('service-bath-trim', 'Bath & Trim', 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?auto=format&fit=crop&w=1000&q=85', true),
  ('service-nail-trim', 'Nail Trim', '/groomer-and-dog.webp', true),
  ('service-nail-grind', 'Nail Grind', '/groomer-and-dog.webp', true),
  ('service-teeth', 'Teeth Brushing', '/alyssa-working.jpeg', true),
  ('service-ears', 'Ear Cleaning / Plucking', '/alyssa-working.jpeg', true),
  ('brand-pattern', 'Background pattern', '/flawlyss-pattern.png', true)
on conflict (slot_id) do update
set
  name = excluded.name,
  src = excluded.src,
  is_default = excluded.is_default,
  updated_at = now();
