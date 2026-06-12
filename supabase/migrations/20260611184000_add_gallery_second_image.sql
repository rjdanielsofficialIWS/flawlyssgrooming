alter table public.gallery_images
add column if not exists second_src text not null default '';
