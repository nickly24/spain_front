import Link from "next/link";
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
    <footer className="border-t border-black/10 bg-[#e8f4e8]">
      <Container className="py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <Link href={homeHref} className="inline-block shrink-0">
              <Image
                src="/logo.svg"
                alt="MG Group"
                width={110}
                height={49}
                className="h-9 w-auto"
              />
            </Link>

            <p className="mt-4 max-w-md text-sm leading-6 text-slate-600">
              {ui.footer.description}
            </p>

            <div className="mt-5 text-sm text-slate-600">
              <div>
                {ui.footer.phone}:{" "}
                <a className="text-slate-900 hover:text-[#FF5A2B]" href="tel:+34865450175">
                  +34 865 450 175
                </a>
              </div>
              <div className="mt-1">
                {ui.footer.email}:{" "}
                <a className="text-slate-900 hover:text-[#FF5A2B]" href="mailto:info@mggroup.es">
                  info@mggroup.es
                </a>
              </div>
            </div>
          </div>

          <div className="md:col-span-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {ui.footer.navigation}
            </div>
            <ul className="mt-4 grid grid-cols-1 gap-2">
              {links.map((l) => (
                <li key={l.href}>
                  <Link className="text-sm text-slate-600 hover:text-slate-900" href={l.href}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {ui.footer.feedback}
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              {ui.footer.feedbackText}
            </p>
            <Link
              href={contactsHref}
              className="mt-4 inline-flex items-center justify-center rounded-full bg-[#ff6a3d] px-5 py-2 text-sm font-semibold text-white hover:bg-[#ff5a2b]"
            >
              {ui.footer.goToContacts}
            </Link>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-black/10 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <div>
            © {new Date().getFullYear()} MG Group (Marescol S.L). {ui.footer.rights}
          </div>
          <div className="flex gap-4">
            <Link className="hover:text-slate-900" href={privacyHref}>
              {ui.footer.privacy}
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}

