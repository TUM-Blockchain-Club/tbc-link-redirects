create table if not exists public.link_redirect_definitions (
  id uuid primary key default gen_random_uuid(),
  year text not null,
  slug text not null,
  label text not null,
  target_url text not null,
  origin text not null,
  campaign text not null,
  variant text not null,
  active boolean not null default true,
  deployment_region text,
  deployment_location text,
  deployment_notes text,
  deployed_at date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (year, slug)
);

create index if not exists link_redirect_definitions_campaign_idx
  on public.link_redirect_definitions (campaign, variant);

create index if not exists link_redirect_definitions_origin_idx
  on public.link_redirect_definitions (origin);

alter table public.link_redirect_definitions enable row level security;

create policy "Service role can manage link redirect definitions"
  on public.link_redirect_definitions
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');
