"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { LuChevronLeft, LuChevronRight, LuMaximize2, LuX } from "react-icons/lu";

const cldThumb = (url, w) => {
  if (!url || !url.includes("res.cloudinary.com") || !url.includes("/image/upload/")) {
    return url;
  }
  return url.replace("/image/upload/", `/image/upload/c_fill,w_${w},q_auto,f_auto/`);
};

export default function ProjectGallery({ cover, gallery = [], title = "" }) {
  const images = [cover, ...(Array.isArray(gallery) ? gallery : [])].filter(Boolean);
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  useEffect(() => {
    if (active >= images.length) setActive(0);
  }, [images.length, active]);

  useEffect(() => {
    function onKey(e) {
      if (lightbox) {
        if (e.key === "Escape") setLightbox(false);
        if (e.key === "ArrowRight") setActive((i) => (i + 1) % images.length);
        if (e.key === "ArrowLeft") setActive((i) => (i - 1 + images.length) % images.length);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, images.length]);

  useEffect(() => {
    if (!lightbox) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [lightbox]);

  if (images.length === 0) return null;

  const next = () => setActive((i) => (i + 1) % images.length);
  const prev = () => setActive((i) => (i - 1 + images.length) % images.length);

  const current = images[active];

  // Touch swipe state for the main image
  const [touchStartX, setTouchStartX] = useState(null);
  const onTouchStart = (e) => setTouchStartX(e.touches[0].clientX);
  const onTouchEnd = (e) => {
    if (touchStartX == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) (dx < 0 ? next : prev)();
    setTouchStartX(null);
  };

  return (
    <section className="relative px-4 py-12 sm:px-6 sm:py-16 md:py-20">
      <div className="mx-auto max-w-6xl">
        {/* Main image */}
        <figure
          className="group relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-[var(--st-line-2)] bg-[var(--st-paper)] shadow-[0_24px_48px_-24px_rgba(15,27,34,0.3)] sm:aspect-[16/10] sm:rounded-3xl md:aspect-[16/9] md:shadow-[0_40px_80px_-30px_rgba(15,27,34,0.35)]"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <Image
            key={current}
            src={cldThumb(current, 1600) || current}
            alt={title}
            fill
            priority
            sizes="(min-width: 1024px) 1100px, 100vw"
            className="object-cover transition-opacity duration-300"
          />

          {/* Top-left counter */}
          <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-2 rounded-full bg-[var(--st-ink)]/85 px-2.5 py-1 backdrop-blur sm:left-4 sm:top-4 sm:px-3">
            <span className="st-mono text-[10px] uppercase tracking-[0.22em] text-[var(--st-accent)]">
              {String(active + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
            </span>
          </div>

          {/* Expand button */}
          <button
            type="button"
            onClick={() => setLightbox(true)}
            aria-label="Expand image"
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-[var(--st-ink)]/85 text-[var(--st-paper)] backdrop-blur transition hover:bg-[var(--st-ink)] sm:right-4 sm:top-4"
          >
            <LuMaximize2 className="h-4 w-4" />
          </button>

          {/* Prev / Next — small on mobile, larger on desktop */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={prev}
                aria-label="Previous image"
                className="absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--st-ink)]/80 text-[var(--st-paper)] backdrop-blur transition hover:bg-[var(--st-ink)] sm:left-4 sm:h-11 sm:w-11"
              >
                <LuChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next image"
                className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--st-ink)]/80 text-[var(--st-paper)] backdrop-blur transition hover:bg-[var(--st-ink)] sm:right-4 sm:h-11 sm:w-11"
              >
                <LuChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
        </figure>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="mt-4 flex snap-x snap-mandatory gap-2.5 overflow-x-auto pb-2 [scrollbar-width:thin] sm:mt-5 sm:gap-3">
            {images.map((src, i) => {
              const isActive = i === active;
              return (
                <button
                  key={`${src}-${i}`}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={`View image ${i + 1}`}
                  className={
                    "relative h-16 w-24 shrink-0 snap-start overflow-hidden rounded-lg border transition sm:h-20 sm:w-28 sm:rounded-xl md:h-24 md:w-36 " +
                    (isActive
                      ? "border-[var(--st-ink)] shadow-[0_8px_24px_-10px_rgba(15,27,34,0.4)] ring-2 ring-[var(--st-accent)]"
                      : "border-[var(--st-line-2)] opacity-80 hover:opacity-100")
                  }
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cldThumb(src, 320) || src}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                  {isActive && (
                    <span className="pointer-events-none absolute inset-x-0 bottom-0 h-[3px] bg-[var(--st-accent)]" />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 px-2 py-2 sm:px-4 sm:py-6"
          onClick={() => setLightbox(false)}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setLightbox(false);
            }}
            aria-label="Close"
            className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20 sm:right-4 sm:top-4 sm:h-10 sm:w-10"
          >
            <LuX className="h-5 w-5" />
          </button>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                aria-label="Previous"
                className="absolute left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20 sm:left-4 sm:h-12 sm:w-12"
              >
                <LuChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                aria-label="Next"
                className="absolute right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20 sm:right-4 sm:h-12 sm:w-12"
              >
                <LuChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </>
          )}

          <div
            className="relative h-full max-h-[78vh] w-full max-w-6xl sm:max-h-[88vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={cldThumb(current, 2000) || current}
              alt={title}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>

          <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-white backdrop-blur sm:bottom-4 sm:text-xs">
            {String(active + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
          </span>
        </div>
      )}
    </section>
  );
}
