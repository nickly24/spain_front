import Image from "next/image";
import Link from "next/link";

function formatMoneyEUR(value) {
  try {
    return new Intl.NumberFormat("ru-RU").format(value);
  } catch {
    return String(value);
  }
}

function pluralViews(n) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 14) return "просмотров";
  if (mod10 === 1) return "просмотр";
  if (mod10 >= 2 && mod10 <= 4) return "просмотра";
  return "просмотров";
}

function StarIcon({ filled, half, gradientId, className }) {
  const path = "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z";
  if (half) {
    return (
      <span className={`relative inline-block ${className}`} style={{ width: "1rem", height: "1rem" }}>
        <svg className="absolute inset-0 size-4 text-slate-200" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
          <path fillRule="evenodd" clipRule="evenodd" d={path} />
        </svg>
        <svg className="absolute inset-0 size-4 text-amber-400" viewBox="0 0 20 20" fill={`url(#${gradientId})`} aria-hidden>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <path fillRule="evenodd" clipRule="evenodd" d={path} />
        </svg>
      </span>
    );
  }
  return (
    <svg className={filled ? `${className} text-amber-400` : `${className} text-slate-200`} viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <path fillRule="evenodd" clipRule="evenodd" d={path} />
    </svg>
  );
}

export function PropertyCard({ property }) {
  const img = property.images?.[0] || "/photos/poster.png";
  const price =
    property.listingType === "sale"
      ? `€ ${formatMoneyEUR(property.priceEur)}`
      : `€ ${formatMoneyEUR(property.rentEurPerMonth)} / мес`;
  const views = property.views ?? 0;
  const rating = property.rating ?? 5;
  const fullStars = Math.floor(rating);
  const hasHalf = rating > fullStars && rating < 5 && (rating % 1) >= 0.25;

  return (
    <Link
      href={`/property/${property.slug}`}
      className="group overflow-hidden rounded-3xl border border-black/10 bg-white hover:shadow-md transition-shadow"
    >
      <div className="relative aspect-4/3">
        <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-[1.03]">
          <Image src={img} alt={property.title} fill className="object-cover" />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent" />
        </div>
        <div className="absolute left-4 bottom-4 right-4">
          <div className="text-sm font-semibold text-white">{property.title}</div>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/75">
            <span>{property.city}</span>
            <span className="text-white/35">•</span>
            <span>{property.bedrooms === 0 ? "Студия" : `${property.bedrooms} сп.`}</span>
            <span className="text-white/35">•</span>
            <span>{property.areaM2} м²</span>
          </div>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm font-semibold text-[#ff6a3d]">{price}</div>
          <span className="rounded-full border border-black/10 bg-black/3 px-3 py-1 text-xs text-slate-600">
            Подробнее
          </span>
        </div>

        {property.badges?.length ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {property.badges.slice(0, 3).map((b) => (
              <span
                key={b}
                className="rounded-full border border-black/10 bg-black/3 px-3 py-1 text-xs text-slate-600"
              >
                {b}
              </span>
            ))}
          </div>
        ) : null}

        <div className="mt-4 flex items-center justify-between gap-4 border-t border-black/5 pt-4">
          <div className="flex items-center gap-1.5 text-slate-500">
            <svg className="size-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-xs font-medium">
              {views >= 1000 ? `${(views / 1000).toFixed(1).replace(".", ",")} тыс` : views} {pluralViews(views)}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5" aria-label={`Рейтинг ${rating} из 5`}>
              {[1, 2, 3, 4, 5].map((i) => (
                <StarIcon
                  key={i}
                  filled={i <= fullStars && !(i === fullStars + 1 && hasHalf)}
                  half={i === fullStars + 1 && hasHalf}
                  gradientId={`star-half-${property.id}-${i}`}
                  className="size-4"
                />
              ))}
            </div>
            <span className="text-xs font-semibold text-slate-700">{Number(rating).toFixed(1)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

