import { PageHero } from "../../components/PageHero";
import { Container } from "../../components/Container";
import { PropertyCatalog } from "../../components/PropertyCatalog";
import { getPropertiesByType } from "../../lib/properties";

export const metadata = {
  title: "Продажа недвижимости",
};

export default function SalePage() {
  const properties = getPropertiesByType("sale");
  return (
    <div>
      <PageHero
        title="Продажа недвижимости в Испании"
        subtitle="Подборка объектов для покупки. Используйте фильтры по городу, количеству спален и стоимости, чтобы быстрее найти подходящий вариант."
        crumbs="Главная / Продажа"
        imageSrc="/photos/image.png"
      />

      <section className="bg-[#e8f4e8]">
        <Container className="py-12">
          <PropertyCatalog properties={properties} mode="sale" />
        </Container>
      </section>
    </div>
  );
}

