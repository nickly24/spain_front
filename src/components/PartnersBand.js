import { Container } from "./Container";
import { PartnersCarousel } from "./PartnersCarousel";
import { getUi } from "../lib/ui";

export function PartnersBand({ partners, lang = "ru" }) {
  if (!partners?.length) return null;
  const ui = getUi(lang);

  return (
    <section className="border-t border-black/10 bg-mg-mint">
      <Container className="py-10">
        <div className="mb-5 text-center">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {ui.partners.title}
          </div>
        </div>
        <PartnersCarousel partners={partners} />
      </Container>
    </section>
  );
}

