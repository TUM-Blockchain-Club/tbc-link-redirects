import type { NextRequest } from "next/server";
import type { RedirectLink } from "./links";
import { createServiceSupabaseClient } from "./supabase-server";

type ClickStatus = "redirected" | "not_found";

type TrackClickInput = {
  request: NextRequest;
  link: RedirectLink | null;
  year: string;
  slug: string;
  status: ClickStatus;
  targetUrl?: string;
};

const trackedQueryParams = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

export async function trackClick({
  request,
  link,
  year,
  slug,
  status,
  targetUrl,
}: TrackClickInput) {
  const supabase = createServiceSupabaseClient();
  const query: Record<string, string> = {};

  for (const key of trackedQueryParams) {
    const value = request.nextUrl.searchParams.get(key);
    if (value) {
      query[key] = value;
    }
  }

  const { error } = await supabase.from("link_redirect_clicks").insert({
    year,
    slug,
    status,
    target_url: targetUrl ?? link?.targetUrl ?? null,
    origin: link?.origin ?? null,
    campaign: link?.campaign ?? null,
    variant: link?.variant ?? null,
    label: link?.label ?? null,
    referrer: request.headers.get("referer"),
    user_agent: request.headers.get("user-agent"),
    country: request.headers.get("x-vercel-ip-country"),
    query,
    request_path: request.nextUrl.pathname,
    clicked_at: new Date().toISOString(),
  });

  if (error) {
    throw error;
  }
}
