import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "../../../components/PageHero";
import { Container } from "../../../components/Container";

const POSTS = [
  {
    slug: "kak-vybrat-nedvizhimost-u-morya",
    title: "Как выбрать недвижимость у моря: основные критерии",
    date: "2026-02-11",
    content: [
      "Выбор недвижимости на побережье начинается с цели: для жизни, отдыха или инвестиций. От этого зависит район, тип объекта и допустимый бюджет.",
      "Важные параметры: транспорт, инфраструктура (магазины, медицина, школы), расстояние до моря, шумность района и перспективы ликвидности.",
      "Если вы сомневаетесь, напишите MG Group — предложим несколько вариантов и объясним, чем они отличаются.",
    ],
  },
  {
    slug: "arenda-na-dlitelny-srok",
    title: "Длительная аренда в Испании: что важно учесть",
    date: "2026-02-10",
    content: [
      "Перед подписанием договора уточните срок, условия продления, размер депозита и какие расходы включены в стоимость (коммунальные, интернет, обслуживание комплекса).",
      "Сфотографируйте состояние жилья при въезде и зафиксируйте список техники и мебели. Это экономит время при выезде.",
      "Мы помогаем подобрать варианты под ваши критерии и организовать просмотр.",
    ],
  },
  {
    slug: "novostroyki-i-vtorichka",
    title: "Новостройки и вторичный рынок: что выбрать",
    date: "2026-02-08",
    content: [
      "Новостройки — это современная планировка и новое инженерное оснащение, но иногда нужно подождать сдачу.",
      "Вторичный рынок даёт возможность быстрее въехать и увидеть реальное окружение, но может потребоваться ремонт.",
      "Под ваш сценарий мы подскажем оптимальную стратегию и подберём объекты для сравнения.",
    ],
  },
];

export async function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export default async function NewsPostPage({ params }) {
  const resolvedParams = await Promise.resolve(params);
  const slug = resolvedParams?.slug;

  const post = slug ? POSTS.find((p) => p.slug === slug) : null;
  if (!post) return notFound();

  return (
    <div>
      <PageHero
        title={post.title}
        subtitle={`Публикация от ${new Date(post.date).toLocaleDateString("ru-RU")}`}
        crumbs="Главная / Новости и статьи"
        imageSrc="/photos/image copy 6.png"
      />

      <section className="bg-[#e8f4e8]">
        <Container className="py-12">
          <article className="max-w-3xl">
            <div className="space-y-4 text-sm leading-7 text-slate-700 sm:text-base">
              {post.content.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>
          </article>

          <div className="mt-10">
            <Link
              href="/news"
              className="inline-flex items-center justify-center rounded-full border border-black/10 bg-black/3 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-black/5"
            >
              ← Назад к списку
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}

