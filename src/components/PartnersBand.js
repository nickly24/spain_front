import { Container } from "./Container";
import { PartnersCarousel } from "./PartnersCarousel";

export function PartnersBand({ partners }) {
  if (!partners?.length) return null;

  return (
    <section className="border-t border-black/10 bg-[#e8f4e8]">
      <Container className="py-10">
        <div className="mb-5 text-center">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Наши партнёры
          </div>
        </div>
        <PartnersCarousel partners={partners} />
      </Container>
    </section>
  );
}

