import { PageHero } from "../../components/PageHero";
import { Container } from "../../components/Container";
import { PropertyCatalog } from "../../components/PropertyCatalog";
import { getPropertiesByType } from "../../lib/properties";

export const metadata = {
  title: "Аренда недвижимости",
};

export default function RentPage() {
  const properties = getPropertiesByType("rent");
  return (
    <div>
      <PageHero
        title="Аренда недвижимости в Испании"
        subtitle="Квартиры и дома в аренду. Фильтры по городу, количеству спален и стоимости помогут подобрать вариант под ваш бюджет."
        crumbs="Главная / Аренда"
        imageSrc="/photos/image copy 2.png"
      />

      <section className="bg-[#e8f4e8]">
        <Container className="py-12">
          <PropertyCatalog properties={properties} mode="rent" />
        </Container>
      </section>
    </div>
  );
}

