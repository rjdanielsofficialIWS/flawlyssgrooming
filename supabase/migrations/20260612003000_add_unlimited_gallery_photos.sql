alter table public.gallery_images
add column if not exists additional_srcs jsonb not null default '[]'::jsonb;

update public.gallery_images
set additional_srcs = jsonb_build_array(second_src)
where second_src <> ''
  and additional_srcs = '[]'::jsonb;
