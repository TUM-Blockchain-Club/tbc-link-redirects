import { after, type NextRequest, NextResponse } from "next/server";
import {
  getAttributedTargetUrl,
  getRedirectLink,
  getSoftRedirectLink,
} from "@/lib/links";
import type { RedirectLink } from "@/lib/links";
import { trackClick } from "@/lib/tracking";

type RouteContext = {
  params: Promise<{
    year: string;
    slug: string;
  }>;
};

export const dynamic = "force-dynamic";

const MAIN_SITE_URL = "https://www.tum-blockchain.com/";

function trackRedirect(
  request: NextRequest,
  link: RedirectLink,
  year: string,
  slug: string,
  targetUrl: string,
) {
  after(async () => {
    try {
      await trackClick({
        request,
        link,
        year,
        slug,
        status: "redirected",
        targetUrl,
      });
    } catch (error) {
      console.error("Failed to track redirect click", error);
    }
  });
}

export async function GET(request: NextRequest, context: RouteContext) {
  const { year, slug } = await context.params;
  const link = getRedirectLink(year, slug);

  if (link) {
    const targetUrl = getAttributedTargetUrl(link);
    trackRedirect(request, link, year, slug, targetUrl);
    return NextResponse.redirect(targetUrl, 302);
  }

  try {
    const softLink = await getSoftRedirectLink(year, slug);

    if (softLink) {
      const targetUrl = getAttributedTargetUrl(softLink);
      trackRedirect(request, softLink, year, slug, targetUrl);
      return NextResponse.redirect(targetUrl, 302);
    }
  } catch (error) {
    console.error("Failed to resolve soft redirect link", error);
  }

  after(async () => {
    try {
      await trackClick({ request, link: null, year, slug, status: "not_found" });
    } catch (error) {
      console.error("Failed to track missing redirect link", error);
    }
  });

  return NextResponse.redirect(MAIN_SITE_URL, 302);
}
