"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

export function PropertyGallery({ images, alt }) {
  const safeImages = useMemo(
    () => (Array.isArray(images) && images.length ? images : ["/photos/poster.png"]),
    [images]
  );
  const [idx, setIdx] = useState(0);

  const canPrev = idx > 0;
  const canNext = idx < safeImages.length - 1;

  return (
    <div>
      <div className="relative overflow-hidden rounded-3xl border border-black/10 bg-white">
        <div className="relative aspect-16/10">
          <Image
            src={safeImages[idx]}
            alt={alt}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 800px, 100vw"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent" />
        </div>

        {/* Arrows */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-3">
          <button
            type="button"
            onClick={() => canPrev && setIdx((v) => v - 1)}
            disabled={!canPrev}
            className="pointer-events-auto inline-flex size-10 items-center justify-center rounded-full border border-white/30 bg-black/30 text-white shadow-sm backdrop-blur disabled:opacity-40"
            aria-label="Предыдущее фото"
          >
            <svg viewBox="0 0 20 20" className="size-5 fill-current" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M12.78 15.53a.75.75 0 0 1-1.06 0l-5-5a.75.75 0 0 1 0-1.06l5-5a.75.75 0 1 1 1.06 1.06L8.31 10l4.47 4.47a.75.75 0 0 1 0 1.06Z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          <button
            type="button"
            onClick={() => canNext && setIdx((v) => v + 1)}
            disabled={!canNext}
            className="pointer-events-auto inline-flex size-10 items-center justify-center rounded-full border border-white/30 bg-black/30 text-white shadow-sm backdrop-blur disabled:opacity-40"
            aria-label="Следующее фото"
          >
            <svg viewBox="0 0 20 20" className="size-5 fill-current" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M7.22 4.47a.75.75 0 0 1 1.06 0l5 5a.75.75 0 0 1 0 1.06l-5 5a.75.75 0 1 1-1.06-1.06L11.69 10 7.22 5.53a.75.75 0 0 1 0-1.06Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* Thumbnails */}
        <div className="border-t border-black/10 bg-white p-3">
          <div className="flex gap-2 overflow-auto">
            {safeImages.map((src, i) => (
              <button
                key={`${src}-${i}`}
                type="button"
                onClick={() => setIdx(i)}
                className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-2xl border ${
                  i === idx ? "border-[#ff6a3d]" : "border-black/10"
                }`}
                aria-label={`Открыть фото ${i + 1}`}
              >
                <Image src={src} alt="" fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

