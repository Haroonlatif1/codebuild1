-- Run once in Supabase → SQL Editor. Safe to re-run.

-- 1) optional new product fields (admin panel → Products shows the inputs)
alter table products add column if not exists specs  text;
alter table products add column if not exists videos text;

-- 2) customer reviews (shown only after you set approved = true)
create table if not exists product_reviews (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid not null,
  name        text not null,
  rating      int  not null check (rating between 1 and 5),
  comment     text not null,
  verified    boolean default false,
  approved    boolean default false,
  created_at  timestamptz default now()
);
alter table product_reviews enable row level security;
drop policy if exists "read approved reviews" on product_reviews;
create policy "read approved reviews" on product_reviews for select using (approved = true);
drop policy if exists "anyone can submit review" on product_reviews;
create policy "anyone can submit review" on product_reviews for insert with check (approved = false);

-- 3) enrollments + orders (insert-only for the public site; read them in the dashboard)
create table if not exists enrollments (
  id uuid primary key default gen_random_uuid(),
  name text, age int, email text, phone text, city text, course text,
  payment_proof_url text, created_at timestamptz default now()
);
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  order_ref text, product_id uuid, product_name text, quantity int, total numeric,
  customer_name text, whatsapp text, email text, address text,
  payment_proof_url text, status text default 'pending_verification', created_at timestamptz default now()
);
alter table enrollments enable row level security;
alter table orders enable row level security;
drop policy if exists "public insert enrollments" on enrollments;
create policy "public insert enrollments" on enrollments for insert with check (true);
drop policy if exists "public insert orders" on orders;
create policy "public insert orders" on orders for insert with check (true);

-- 4) storage bucket for payment screenshots (JPEG only, 5 MB)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('payment-proofs', 'payment-proofs', true, 5242880, array['image/jpeg'])
on conflict (id) do nothing;
drop policy if exists "public upload proofs" on storage.objects;
create policy "public upload proofs" on storage.objects for insert to anon, authenticated
  with check (bucket_id = 'payment-proofs');

-- 5) admin panel access (logged-in admin can read / update / delete the new tables)
alter table enrollments add column if not exists status text default 'new';
do $$ declare t text; begin
  foreach t in array array['enrollments','orders','product_reviews'] loop
    execute format('drop policy if exists "admin all %1$s" on %1$I', t);
    execute format('create policy "admin all %1$s" on %1$I for all to authenticated using (true) with check (true)', t);
  end loop;
end $$;
-- NOTE: this lets any signed-in Supabase user manage these tables. If only you have an account, that is fine.

-- 6) v3: new product fields, site settings (demo video etc.), media bucket
alter table products add column if not exists tagline text;
alter table products add column if not exists requirements text;
alter table products add column if not exists faqs text;
alter table products add column if not exists seo_description text;
alter table products add column if not exists slug text;
alter table products add column if not exists delivery_type text;
alter table products add column if not exists show_why boolean;

create table if not exists site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now()
);
alter table site_settings enable row level security;
drop policy if exists "public read settings" on site_settings;
create policy "public read settings" on site_settings for select using (true);
drop policy if exists "admin write settings" on site_settings;
create policy "admin write settings" on site_settings for all to authenticated using (true) with check (true);

insert into storage.buckets (id, name, public, file_size_limit)
values ('site-media', 'site-media', true, 52428800)
on conflict (id) do nothing;
drop policy if exists "public read site-media" on storage.objects;
create policy "public read site-media" on storage.objects for select using (bucket_id = 'site-media');
drop policy if exists "admin write site-media" on storage.objects;
create policy "admin write site-media" on storage.objects for all to authenticated
  using (bucket_id = 'site-media') with check (bucket_id = 'site-media');

-- 7) Practice bank: extra questions/tasks added from Admin → Practice Bank
create table if not exists practice_items (
  id uuid primary key default gen_random_uuid(),
  language text not null check (language in ('python','cpp','javascript')),
  level text not null check (level in ('easy','medium','hard')),
  kind text not null check (kind in ('mcq','task')),
  question text, code text, options jsonb, answer int, explanation text,
  title text, statement text, starter text, expected text, hint text, solution text,
  is_published boolean default true,
  created_at timestamptz default now()
);
alter table practice_items enable row level security;
drop policy if exists "public read practice" on practice_items;
create policy "public read practice" on practice_items for select using (is_published = true);
drop policy if exists "admin all practice" on practice_items;
create policy "admin all practice" on practice_items for all to authenticated using (true) with check (true);
