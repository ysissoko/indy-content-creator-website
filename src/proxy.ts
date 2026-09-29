import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { defaultLocale, hasLocale, LOCALE_COOKIE, locales } from "@/i18n/config";

/**
 * Locale routing.
 *  - "/"  is rewritten (not redirected) to "/fr" internally, so the French
 *    URL stays clean and unprefixed while [lang]/page.tsx still gets a
 *    concrete `lang` param.
 *  - "/fr" itself 308-redirects back to "/" so there is one canonical URL.
 *  - "/en" passes straight through.
 *  - On a first visit to "/" (no locale cookie yet), the visitor's
 *    Accept-Language header is used to redirect to "/en" when English
 *    outranks French. A manual choice via the switcher sets the cookie and
 *    always wins afterwards.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/fr" || pathname.startsWith("/fr/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/^\/fr/, "") || "/";
    return NextResponse.redirect(url, 308);
  }

  if (pathname === "/" || pathname === "") {
    const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
    const preferred = cookieLocale && hasLocale(cookieLocale)
      ? cookieLocale
      : detectLocale(request.headers.get("accept-language"));

    if (preferred === "en") {
      return NextResponse.redirect(new URL("/en", request.url));
    }

    const url = request.nextUrl.clone();
    url.pathname = "/fr";
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

/**
 * Minimal Accept-Language negotiation — picks the highest-weighted supported
 * locale, defaulting to French. Avoids pulling in `negotiator` /
 * `@formatjs/intl-localematcher` for a two-locale site.
 */
function detectLocale(acceptLanguage: string | null): (typeof locales)[number] {
  if (!acceptLanguage) return defaultLocale;

  const weighted = acceptLanguage
    .split(",")
    .map((part) => {
      const [tag, qPart] = part.trim().split(";q=");
      const q = qPart ? parseFloat(qPart) : 1;
      return { lang: tag.trim().slice(0, 2).toLowerCase(), q: Number.isNaN(q) ? 1 : q };
    })
    .sort((a, b) => b.q - a.q);

  for (const { lang } of weighted) {
    if (hasLocale(lang)) return lang;
  }
  return defaultLocale;
}

export const config = {
  matcher: ["/((?!api|keystatic|_next|.*\\..*).*)"],
};
