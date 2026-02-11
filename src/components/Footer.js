import Link from "next/link";
import Image from "next/image";
import { Container } from "./Container";

const FOOTER_LINKS = [
  { href: "/", label: "Главная" },
  { href: "/sale", label: "Продажа недвижимости" },
  { href: "/rent", label: "Аренда недвижимости" },
  { href: "/construction", label: "Строительство и проекты" },
  { href: "/about", label: "О компании" },
  { href: "/news", label: "Новости и статьи" },
  { href: "/contacts", label: "Контакты" },
];

export function Footer() {
  return (
    <footer className="border-t border-black/10 bg-[#e8f4e8]">
      <Container className="py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <Link href="/" className="inline-block shrink-0">
              <Image
                src="/logo.svg"
                alt="MG Group"
                width={110}
                height={49}
                className="h-9 w-auto"
              />
            </Link>

            <p className="mt-4 max-w-md text-sm leading-6 text-slate-600">
              Продажа, аренда и строительство недвижимости в Испании. Подбираем
              объекты под ваш запрос и сопровождаем на всех этапах.
            </p>

            <div className="mt-5 text-sm text-slate-600">
              <div>
                Телефон:{" "}
                <a className="text-slate-900 hover:text-[#FF5A2B]" href="tel:+34865450175">
                  +34 865 450 175
                </a>
              </div>
              <div className="mt-1">
                Email:{" "}
                <a className="text-slate-900 hover:text-[#FF5A2B]" href="mailto:info@mggroup.es">
                  info@mggroup.es
                </a>
              </div>
            </div>
          </div>

          <div className="md:col-span-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Навигация
            </div>
            <ul className="mt-4 grid grid-cols-1 gap-2">
              {FOOTER_LINKS.map((l) => (
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
              Обратная связь
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              Напишите нам в разделе «Контакты» — ответим и предложим варианты под
              ваш бюджет и локацию.
            </p>
            <Link
              href="/contacts"
              className="mt-4 inline-flex items-center justify-center rounded-full bg-[#ff6a3d] px-5 py-2 text-sm font-semibold text-white hover:bg-[#ff5a2b]"
            >
              Перейти к контактам
            </Link>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-black/10 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <div>© {new Date().getFullYear()} MG Group (Marescol S.L). Все права защищены.</div>
          <div className="flex gap-4">
            <Link className="hover:text-slate-900" href="/privacy">
              Политика конфиденциальности
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}

