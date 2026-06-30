"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import AnimateInView from "./AnimateInView";
import { cn } from "@/lib/utils";

const PAIRS = [
  {
    id: "fortnightly-perth",
    caption: "Fortnightly Home Cleaning",
    location: "Perth, WA",
    beforeLabel: "Kitchen — Before",
    afterLabel:  "Kitchen — After",
    beforeSrc:   "/kitchen-before.jpg",
    afterSrc:    "/kitchen-after.jpg",
  },
  {
    id: "eol-melbourne",
    caption: "End of Lease Clean",
    location: "Melbourne, VIC",
    beforeLabel: "Window Sill — Before",
    afterLabel:  "Window Sill — After",
    beforeSrc:   "/window-before.jpg",
    afterSrc:    "/window-after.jpg",
  },
  {
    id: "deep-perth",
    caption: "Deep Clean",
    location: "Perth, WA",
    beforeLabel: "Shower Drain — Before",
    afterLabel:  "Shower Drain — After",
    beforeSrc:   "/shower-before.jpg",
    afterSrc:    "/shower-after.jpg",
  },
  {
    id: "office-sydney",
    caption: "Office Clean",
    location: "Sydney, NSW",
    beforeLabel: "Office — Before",
    afterLabel:  "Office — After",
    beforeSrc:   "/office-before.jpg",
    afterSrc:    "/office-after.jpg",
  },
];

/* ── Single drag-reveal card ── */
function BeforeAfterSlider({
  pair,
}: {
  pair: (typeof PAIRS)[0];
}) {
  const [pos, setPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const update = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const { left, width } = el.getBoundingClientRect();
    setPos(Math.max(4, Math.min(96, ((clientX - left) / width) * 100)));
  }, []);

  // Document-level mouse events so drag works even when cursor leaves the card
  useEffect(() => {
    const onMove = (e: MouseEvent) => { if (dragging.current) update(e.clientX); };
    const onUp   = () => { dragging.current = false; };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup",   onUp);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup",   onUp);
    };
  }, [update]);

  // Non-passive touch listeners so preventDefault() stops page scroll while dragging
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onStart = (e: TouchEvent) => { dragging.current = true; update(e.touches[0].clientX); };
    const onMove  = (e: TouchEvent) => { if (dragging.current) { e.preventDefault(); update(e.touches[0].clientX); } };
    const onEnd   = () => { dragging.current = false; };
    el.addEventListener("touchstart", onStart, { passive: true });
    el.addEventListener("touchmove",  onMove,  { passive: false });
    el.addEventListener("touchend",   onEnd);
    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchmove",  onMove);
      el.removeEventListener("touchend",   onEnd);
    };
  }, [update]);

  const hasImages = pair.beforeSrc && pair.afterSrc;

  return (
    <div className="bg-white rounded-2xl shadow-card border border-navy-950/8 overflow-hidden">

      {/* ── Drag area ── */}
      <div
        ref={containerRef}
        className="relative aspect-[4/3] overflow-hidden cursor-col-resize select-none"
        onMouseDown={(e) => { dragging.current = true; update(e.clientX); }}
        role="img"
        aria-label={`Before and after comparison: ${pair.caption} — ${pair.location}`}
      >

        {/* ── BEFORE layer ── */}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-stone-100">
          {hasImages ? (
            <Image
              src={pair.beforeSrc}
              alt={pair.beforeLabel}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              draggable={false}
            />
          ) : (
            <div className="flex flex-col items-center gap-3 text-center px-6">
              <svg className="w-10 h-10 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 20.25h18M3.75 3h16.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H3.75a.75.75 0 01-.75-.75V3.75A.75.75 0 013.75 3z" />
              </svg>
              <p className="text-stone-400 font-medium text-sm leading-snug">{pair.beforeLabel}</p>
              <p className="text-stone-300 text-xs">Add real photo here</p>
            </div>
          )}
        </div>

        {/* ── AFTER layer (clipped left → right) ── */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center bg-teal-50"
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
          aria-hidden="true"
        >
          {hasImages ? (
            <Image
              src={pair.afterSrc}
              alt={pair.afterLabel}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              draggable={false}
            />
          ) : (
            <div className="flex flex-col items-center gap-3 text-center px-6">
              <svg className="w-10 h-10 text-teal-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-teal-600 font-medium text-sm leading-snug">{pair.afterLabel}</p>
              <p className="text-teal-400 text-xs">Add real photo here</p>
            </div>
          )}
        </div>

        {/* ── Divider line ── */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_12px_rgba(0,0,0,0.2)] z-20 pointer-events-none"
          style={{ left: `${pos}%` }}
          aria-hidden="true"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white shadow-lg flex items-center justify-center gap-0.5">
            <svg className="w-3 h-3 text-navy-950" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
            <svg className="w-3 h-3 text-navy-950" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        {/* ── BEFORE badge ── */}
        <span
          className="absolute top-3 left-3 z-10 pointer-events-none bg-navy-950/70 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg"
          aria-hidden="true"
        >
          Before
        </span>

        {/* ── AFTER badge ── */}
        <span
          className={cn(
            "absolute top-3 right-3 z-10 pointer-events-none bg-teal-500 text-navy-950 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg transition-opacity duration-200",
            pos > 20 ? "opacity-100" : "opacity-0"
          )}
          aria-hidden="true"
        >
          After
        </span>
      </div>

      {/* ── Caption ── */}
      <div className="px-5 py-4 flex items-center justify-between gap-4">
        <div>
          <p className="font-semibold text-navy-950 text-sm">{pair.caption}</p>
          <p className="text-navy-950/45 text-xs mt-0.5">{pair.location}</p>
        </div>
        <p className="text-navy-950/25 text-xs shrink-0 flex items-center gap-1" aria-hidden="true">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4M8 15l4 4 4-4" />
          </svg>
          Drag to compare
        </p>
      </div>
    </div>
  );
}

/* ── Section export ── */
export default function BeforeAfterGallery() {
  return (
    <section
      className="section-padding bg-navy-950/[0.03]"
      aria-labelledby="before-after-heading"
    >
      <div className="container-custom">
        <AnimateInView variant="slide-up" className="text-center mb-12">
          <p className="section-label">The Taspro Difference</p>
          <h2
            id="before-after-heading"
            className="section-heading"
          >
            See the transformation
          </h2>
          <p className="section-subheading max-w-xl mx-auto">
            Drag the slider on each photo to reveal the result. Every clean is backed by our 100% satisfaction guarantee.
          </p>
        </AnimateInView>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PAIRS.map((pair, i) => (
            <AnimateInView key={pair.id} variant="slide-up" delay={i * 0.08}>
              <BeforeAfterSlider pair={pair} />
            </AnimateInView>
          ))}
        </div>
      </div>
    </section>
  );
}
