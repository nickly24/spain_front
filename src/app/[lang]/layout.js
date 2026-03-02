import { notFound } from "next/navigation";
import { getLocaleFromParams, isValidLocale } from "../../lib/i18n";
import { getNavLinksByLocale } from "../../lib/nav";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { getSocialLinks } from "../../lib/social";
import { getVisiblePartners } from "../../lib/partners";
import { PartnersBand } from "../../components/PartnersBand";

export default async function LangLayout({ children, params }) {
  const resolved = typeof params?.then === "function" ? await params : params;
  const rawLang = resolved?.lang;
  if (rawLang && !isValidLocale(rawLang)) {
    notFound();
  }
  const lang = getLocaleFromParams(resolved);
  const [nav, socials, partners] = await Promise.all([
    getNavLinksByLocale(lang),
    getSocialLinks(),
    getVisiblePartners(),
  ]);
  return (
    <>
      <Header
        lang={lang}
        headerLinks={nav.header}
        topbarLinks={nav.topbar}
        socials={socials}
      />
      <main className="min-h-[calc(100svh-64px)]">{children}</main>
      <PartnersBand partners={partners} lang={lang} />
      <Footer lang={lang} footerLinks={nav.footer} />
    </>
  );
}
