alter table public.gallery_images
add column if not exists pet_name text not null default '';
