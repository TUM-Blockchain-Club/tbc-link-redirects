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

function getReferrerDomain(referrer: string | null) {
  if (!referrer) {
    return null;
  }

  try {
    return new URL(referrer).hostname;
  } catch {
    return null;
  }
}

function getDeviceType(userAgent: string | null) {
  const ua = userAgent?.toLowerCase() ?? "";

  if (!ua) {
    return "unknown";
  }

  if (ua.includes("ipad") || ua.includes("tablet")) {
    return "tablet";
  }

  if (ua.includes("mobi") || ua.includes("iphone") || ua.includes("android")) {
    return "mobile";
  }

  return "desktop";
}

function getBrowserFamily(userAgent: string | null) {
  const ua = userAgent?.toLowerCase() ?? "";

  if (!ua) {
    return "unknown";
  }

  if (ua.includes("firefox")) {
    return "firefox";
  }

  if (ua.includes("edg/")) {
    return "edge";
  }

  if (ua.includes("chrome") || ua.includes("crios")) {
    return "chrome";
  }

  if (ua.includes("safari")) {
    return "safari";
  }

  return "other";
}

function getClickedAtHour() {
  const clickedAt = new Date();
  clickedAt.setUTCMinutes(0, 0, 0);
  return clickedAt.toISOString();
}

function getSafeTargetUrl(targetUrl: string | null) {
  if (!targetUrl) {
    return null;
  }

  try {
    const url = new URL(targetUrl);
    url.search = "";
    url.hash = "";
    return url.toString();
  } catch {
    return targetUrl;
  }
}

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
    target_url: getSafeTargetUrl(targetUrl ?? link?.targetUrl ?? null),
    origin: link?.origin ?? null,
    campaign: link?.campaign ?? null,
    variant: link?.variant ?? null,
    label: link?.label ?? null,
    referrer_domain: getReferrerDomain(request.headers.get("referer")),
    device_type: getDeviceType(request.headers.get("user-agent")),
    browser_family: getBrowserFamily(request.headers.get("user-agent")),
    country: request.headers.get("x-vercel-ip-country"),
    query,
    request_path: request.nextUrl.pathname,
    clicked_at_hour: getClickedAtHour(),
  });

  if (error) {
    throw error;
  }
}
