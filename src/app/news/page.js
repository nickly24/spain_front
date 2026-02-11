import Link from "next/link";
import { PageHero } from "../../components/PageHero";
import { Container } from "../../components/Container";

export const metadata = {
  title: "Новости и статьи",
};

const DEMO_POSTS = [
  {
    slug: "kak-vybrat-nedvizhimost-u-morya",
    title: "Как выбрать недвижимость у моря: основные критерии",
    excerpt:
      "Покупка жилья на побережье — это не только красивые фото. Разбираем локацию, инфраструктуру и нюансы выбора.",
    date: "2026-02-11",
  },
  {
    slug: "arenda-na-dlitelny-srok",
    title: "Длительная аренда в Испании: что важно учесть",
    excerpt:
      "Сроки, депозит, документы и коммунальные платежи — короткий чек‑лист перед подписанием договора.",
    date: "2026-02-10",
  },
  {
    slug: "novostroyki-i-vtorichka",
    title: "Новостройки и вторичный рынок: что выбрать",
    excerpt:
      "Сравниваем плюсы и минусы, сроки, риски и сценарии — для жизни и инвестиций.",
    date: "2026-02-08",
  },
];

export default function NewsPage() {
  return (
    <div>
      <PageHero
        title="Новости и статьи"
        subtitle="Публикуем новости компании и полезные материалы о недвижимости в Испании: выбор локации, покупка, аренда, проекты."
        crumbs="Главная / Новости и статьи"
        imageSrc="/photos/image copy 5.png"
      />

      <section className="bg-[#e8f4e8]">
        <Container className="py-12">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {DEMO_POSTS.map((p) => (
              <Link
                key={p.slug}
                href={`/news/${p.slug}`}
                className="group rounded-3xl border border-black/10 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-xs text-slate-500">
                  {new Date(p.date).toLocaleDateString("ru-RU")}
                </div>
                <div className="mt-3 text-base font-semibold text-slate-900 group-hover:text-[#FF5A2B]">
                  {p.title}
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">{p.excerpt}</p>
                <div className="mt-4 text-sm font-semibold text-[#FF5A2B] group-hover:text-[#ff4b17]">
                  Читать →
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}

