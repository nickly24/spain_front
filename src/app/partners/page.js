import { PageHero } from "../../components/PageHero";
import { Container } from "../../components/Container";

export const metadata = {
  title: "Партнёрам",
};

export default function PartnersPage() {
  return (
    <div>
      <PageHero
        title="Партнёрам"
        subtitle="Страница для партнёров MG Group: условия сотрудничества, направления и контакты. Текст и структура уточняются."
        crumbs="Главная / Партнёрам"
        imageSrc="/photos/image copy 9.png"
      />

      <section className="bg-[#e8f4e8]">
        <Container className="py-12">
          <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
            <p className="text-sm leading-6 text-slate-600">
              В этом разделе можно разместить: описание моделей сотрудничества,
              регионы работы, формат передачи заявок, SLA и контактные данные менеджера.
            </p>
          </div>
        </Container>
      </section>
    </div>
  );
}

