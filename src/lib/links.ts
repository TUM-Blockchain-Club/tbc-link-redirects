export type LinkYear = "26";

export type LinkOrigin = "flyer";

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

export const LINKS: RedirectLink[] = [
  {
    year: "26",
    slug: "fly-1",
    label: "Flyer 1",
    targetUrl: "https://www.tum-blockchain.com/",
    origin: "flyer",
    campaign: "flyer-2026",
    variant: "fly-1",
  },
  {
    year: "26",
    slug: "fly-2",
    label: "Flyer 2",
    targetUrl: "https://www.tum-blockchain.com/",
    origin: "flyer",
    campaign: "flyer-2026",
    variant: "fly-2",
  },
];

const linkMap = new Map(LINKS.map((link) => [`${link.year}/${link.slug}`, link]));

export function getRedirectLink(year: string, slug: string) {
  return linkMap.get(`${year}/${slug}`) ?? null;
}
