create table if not exists public.link_redirect_clicks (
  id uuid primary key default gen_random_uuid(),
  year text not null,
  slug text not null,
  status text not null check (status in ('redirected', 'not_found')),
  target_url text,
  origin text,
  campaign text,
  variant text,
  label text,
  referrer text,
  user_agent text,
  country text,
  query jsonb not null default '{}'::jsonb,
  request_path text not null,
  clicked_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists link_redirect_clicks_clicked_at_idx
  on public.link_redirect_clicks (clicked_at desc);

create index if not exists link_redirect_clicks_campaign_idx
  on public.link_redirect_clicks (campaign, variant, clicked_at desc);

create index if not exists link_redirect_clicks_slug_idx
  on public.link_redirect_clicks (year, slug, clicked_at desc);

alter table public.link_redirect_clicks enable row level security;

create policy "Service role can manage link redirect clicks"
  on public.link_redirect_clicks
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');
