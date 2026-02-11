import { PageHero } from "../../components/PageHero";
import { Container } from "../../components/Container";

export const metadata = {
  title: "Политика конфиденциальности",
};

export default function PrivacyPage() {
  return (
    <div>
      <PageHero
        title="Политика конфиденциальности"
        subtitle="Текст будет заменён на финальную версию с учётом требований юриста и выбранного способа обработки заявок."
        crumbs="Главная / Политика конфиденциальности"
        imageSrc="/photos/image copy 8.png"
      />

      <section className="bg-[#e8f4e8]">
        <Container className="py-12">
          <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
            <p className="text-sm leading-6 text-slate-600">
              Здесь размещается информация о том, какие персональные данные собираются
              (например, имя, телефон, email), с какой целью, на каком основании,
              как долго хранятся и как можно запросить удаление данных.
            </p>
          </div>
        </Container>
      </section>
    </div>
  );
}

