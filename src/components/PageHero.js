import Image from "next/image";
import { Container } from "./Container";

export function PageHero({
  title,
  subtitle,
  crumbs,
  imageSrc = "/photos/poster.jpg",
}) {
  return (
    <section className="relative overflow-hidden border-b border-black/10">
      <div className="absolute inset-0">
        <Image
          src={imageSrc}
          alt=""
          fill
          className="object-cover opacity-90"
          priority={false}
        />
        {/* Тёмный оверлей: сильнее к низу, чтобы подзаголовок и текст хорошо читались */}
        <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/75 to-black/90" />
      </div>

      <Container className="relative py-12 sm:py-14">
        {crumbs ? <div className="text-xs text-white/70">{crumbs}</div> : null}
        <h1 className="mt-3 max-w-4xl text-3xl font-semibold tracking-tight text-white drop-shadow sm:text-4xl">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-3 max-w-3xl text-sm leading-6 text-white/85 drop-shadow sm:text-base">
            {subtitle}
          </p>
        ) : null}
      </Container>
    </section>
  );
}

