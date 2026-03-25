import Image from "next/image";
import { Container } from "./Container";
import { getUi } from "../lib/ui";

const FALLBACK_FOOTER_LINKS = {
  ru: [
    { href: "/", label: "Главная" },
    { href: "/sale", label: "Продажа недвижимости" },
    { href: "/rent", label: "Аренда недвижимости" },
    { href: "/construction", label: "Строительство и проекты" },
    { href: "/about", label: "О компании" },
    { href: "/news", label: "Новости и статьи" },
    { href: "/contacts", label: "Контакты" },
  ],
  en: [
    { href: "/", label: "Home" },
    { href: "/sale", label: "For sale" },
    { href: "/rent", label: "For rent" },
    { href: "/construction", label: "Construction" },
    { href: "/about", label: "About" },
    { href: "/news", label: "News" },
    { href: "/contacts", label: "Contacts" },
  ],
  es: [
    { href: "/", label: "Inicio" },
    { href: "/sale", label: "Venta" },
    { href: "/rent", label: "Alquiler" },
    { href: "/construction", label: "Construcción" },
    { href: "/about", label: "Sobre nosotros" },
    { href: "/news", label: "Noticias" },
    { href: "/contacts", label: "Contactos" },
  ],
};

export function Footer({ lang = "ru", footerLinks = [] }) {
  const ui = getUi(lang);
  const fallback = FALLBACK_FOOTER_LINKS[lang] || FALLBACK_FOOTER_LINKS.ru;
  const links = footerLinks.length
    ? footerLinks
    : fallback.map((l) => ({ ...l, href: `/${lang}${l.href === "/" ? "" : l.href}` }));
  const homeHref = `/${lang}`;
  const contactsHref = `/${lang}/contacts`;
  const privacyHref = `/${lang}/privacy`;

  return (
    <footer className="border-t border-white/10 bg-mg-ink text-white/85">
      <Container className="py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <a href={homeHref} className="inline-block shrink-0 overflow-visible">
              <Image
                src="/mg-group-logo.svg"
                alt="MG Group"
                width={1920}
                height={1080}
                className="h-14 w-auto max-h-14 origin-left scale-110 object-contain object-left sm:h-16 sm:max-h-16"
              />
            </a>

            <p className="mt-4 max-w-md text-sm leading-6 text-white/70">
              {ui.footer.description}
            </p>

            <div className="mt-5 text-sm text-white/70">
              <div>
                {ui.footer.phone}:{" "}
                <a className="text-white hover:text-mg-gold" href="tel:+34865450175">
                  +34 865 450 175
                </a>
              </div>
              <div className="mt-1">
                {ui.footer.email}:{" "}
                <a className="text-white hover:text-mg-gold" href="mailto:info@mggroup.es">
                  info@mggroup.es
                </a>
              </div>
            </div>
          </div>

          <div className="md:col-span-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-mg-sage">
              {ui.footer.navigation}
            </div>
            <ul className="mt-4 grid grid-cols-1 gap-2">
              {links.map((l) => (
                <li key={l.href}>
                  <a className="text-sm text-white/75 hover:text-mg-gold" href={l.href}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-mg-sage">
              {ui.footer.feedback}
            </div>
            <p className="mt-4 text-sm leading-6 text-white/70">
              {ui.footer.feedbackText}
            </p>
            <a
              href={contactsHref}
              className="mt-4 inline-flex items-center justify-center rounded-full bg-mg-gold px-5 py-2 text-sm font-semibold text-mg-ink transition-colors hover:bg-mg-gold-hover"
            >
              {ui.footer.goToContacts}
            </a>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <div>
            © {new Date().getFullYear()} MG Group (Marescol S.L). {ui.footer.rights}
          </div>
          <div className="flex gap-4">
            <a className="hover:text-mg-gold" href={privacyHref}>
              {ui.footer.privacy}
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
