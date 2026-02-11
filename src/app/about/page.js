import { PageHero } from "../../components/PageHero";
import { Container } from "../../components/Container";
import { CompanyNumbers } from "../../components/CompanyNumbers";
import { CompanyHistory } from "../../components/CompanyHistory";

export const metadata = {
  title: "О компании",
};

export default function AboutPage() {
  return (
    <div>
      <PageHero
        title="О компании MG Group"
        subtitle="MG Group (Marescol S.L) — команда, которая занимается продажей, арендой и проектами в сфере недвижимости в Испании. Наша цель — понятный процесс и качественный результат."
        crumbs="Главная / О компании"
        imageSrc="/photos/image copy 3.png"
      />

      <section className="bg-[#e8f4e8]">
        <Container className="py-12">
          <div className="space-y-10">
            {/* Кто мы — сверху (кратко) */}
            <section className="rounded-3xl border border-black/10 bg-white p-7 shadow-sm">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Кто мы
              </div>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
                MG Group — недвижимость и проекты в Испании
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
                Помогаем подобрать объекты под ваш запрос (город, спальни, стоимость),
                а также подключаем проектное направление, когда требуется ремонт или
                решение «под ключ». Ниже — визуальные блоки «в цифрах» и история в
                формате, который удобно показывать клиенту.
              </p>
            </section>

            {/* В цифрах — как в референсе с оранжевой карточкой-графиком */}
            <CompanyNumbers />

            {/* История компании — как в референсе с годами */}
            <CompanyHistory />
          </div>
        </Container>
      </section>
    </div>
  );
}

