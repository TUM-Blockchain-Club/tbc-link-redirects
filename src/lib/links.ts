import linkDefinitions from "./link-definitions.json";
import { createServiceSupabaseClient } from "./supabase-server";

export type LinkYear = "26";

export type LinkOrigin = "flyer" | "roll-up";

export type RedirectLink = {
  year: LinkYear;
  slug: string;
  label: string;
  targetUrl: string;
  origin: LinkOrigin;
  campaign: string;
  variant: string;
  countryHint?: string;
};

export const LINKS = linkDefinitions as RedirectLink[];

const linkMap = new Map(LINKS.map((link) => [`${link.year}/${link.slug}`, link]));

export function getRedirectLink(year: string, slug: string) {
  return linkMap.get(`${year}/${slug}`) ?? null;
}

export async function getSoftRedirectLink(year: string, slug: string) {
  const supabase = createServiceSupabaseClient();
  const { data, error } = await supabase
    .from("link_redirect_definitions")
    .select("year, slug, label, target_url, origin, campaign, variant, active")
    .eq("year", year)
    .eq("slug", slug)
    .eq("active", true)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  return {
    year: data.year as LinkYear,
    slug: data.slug,
    label: data.label,
    targetUrl: data.target_url,
    origin: data.origin as LinkOrigin,
    campaign: data.campaign,
    variant: data.variant,
  } satisfies RedirectLink;
}
