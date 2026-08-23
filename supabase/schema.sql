-- Ariadne Supabase Schema — FitVision AI
-- Run in Supabase SQL Editor

-- Extensions
create extension if not exists "uuid-ossp";

-- Products catalog (garment references)
create table if not exists products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  brand text not null,
  category text not null check (category in ('upper_body','lower_body','dress','outerwear','traditional')),
  price integer not null, -- IDR
  image_url text not null,
  gallery text[] default '{}',
  -- size_chart: { "S": { chest: 90, waist: 76, length: 66 }, ... }
  size_chart jsonb not null default '{}',
  fabric text not null default 'cotton',
  stretch_level text not null default 'medium' check (stretch_level in ('low','medium','high')),
  created_at timestamp with time zone default now()
);

-- Try-on sessions (consumer)
create table if not exists try_on_sessions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete set null,
  product_id uuid references products(id) on delete cascade not null,
  selected_size text not null,
  source_image_base64 text, -- truncated or stored as text for demo; prefer storage bucket in prod
  result_image_url text,
  fit_analysis jsonb,
  created_at timestamp with time zone default now()
);

-- Analytics events (for merchant dashboard)
create table if not exists analytics_events (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid references products(id) on delete cascade not null,
  event_type text not null check (event_type in ('view','try_on','purchase','return')),
  size text not null,
  fit_risk text check (fit_risk in ('low','medium','high')),
  created_at timestamp with time zone default now()
);

-- RLS
alter table products enable row level security;
alter table try_on_sessions enable row level security;
alter table analytics_events enable row level security;

-- Public read for products; authenticated insert for sessions (anon allowed for hackathon demo)
create policy "public read products" on products for select using (true);
create policy "anon insert products" on products for insert with check (true);

create policy "public read sessions" on try_on_sessions for select using (true);
create policy "anon insert sessions" on try_on_sessions for insert with check (true);

create policy "public read analytics" on analytics_events for select using (true);
create policy "anon insert analytics" on analytics_events for insert with check (true);

-- Indexes
create index if not exists idx_products_category on products(category);
create index if not exists idx_analytics_product on analytics_events(product_id);
create index if not exists idx_analytics_type on analytics_events(event_type);
