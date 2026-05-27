import linkDefinitions from "./link-definitions.json";

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
