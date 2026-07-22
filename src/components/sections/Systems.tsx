"use client";

import { AnimatedItem, AnimatedSection } from "@/components/ui/AnimatedSection";
import { EyebrowBadge } from "@/components/ui/Button";

const CARDS = [
  {
    idx: "01 / REPULSORS",
    title: "Repulsor Array",
    body: "Palm and boot-mounted emitters, independently throttled, tuned for hover through full-thrust flight.",
    span: "md:col-span-3",
  },
  {
    idx: "02 / FLIGHT",
    title: "Flight Stabilization",
    body: "Six-axis gyroscopic correction recalculates orientation faster than the pilot can perceive drift.",
    span: "md:col-span-3",
  },
  {
    idx: "03 / AI",
    title: "Onboard AI Core",
    body: "Runs targeting, diagnostics, and comms in parallel, freeing the pilot to just fly.",
    span: "md:col-span-2",
  },
  {
    idx: "04 / HUD",
    title: "Targeting HUD",
    body: "Threat prioritization overlaid directly on the visor, ranked by proximity and closing speed.",
    span: "md:col-span-2",
  },
  {
    idx: "05 / PLATING",
    title: "Nanite Plating",
    body: "Self-arranging armor segments redistribute mass to the point of highest projected impact.",
    span: "md:col-span-2",
  },
  {
    idx: "06 / POWER",
    title: "Micro Arc Reactor",
    body: "Palm-sized fusion core. Everything above — flight, plating, HUD, AI — draws from this single cell.",
    span: "md:col-span-6",
  },
];

export default function Systems() {
  return (
    <section id="systems" className="mx-auto max-w-[1400px] px-6 py-24 md:px-16 md:py-32">
      <AnimatedSection>
        <EyebrowBadge>CORE SYSTEMS</EyebrowBadge>
        <h2 className="mb-4 max-w-[18ch] text-[clamp(2rem,4.2vw,3.4rem)] font-bold leading-[1.05]">
          Six subsystems. One reactor.
        </h2>
        <p className="mb-14 max-w-[52ch] text-base leading-relaxed text-muted">
          Everything below draws from the same power cell you just charged. No system runs in
          isolation — that&apos;s the whole design philosophy.
        </p>
      </AnimatedSection>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-6">
        {CARDS.map((card, i) => (
          <AnimatedItem key={card.title} delay={i * 0.05} className={card.span}>
            <div className="neu-card group relative flex h-full min-h-[200px] flex-col justify-between gap-3.5 overflow-hidden p-7">
              <div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-400 group-hover:opacity-100"
                style={{
                  background:
                    "radial-gradient(circle at 30% 20%, rgba(95,225,255,0.12), transparent 60%)",
                }}
              />
              <span className="font-mono text-[0.7rem] tracking-[0.2em] text-muted">{card.idx}</span>
              <div>
                <h3 className="mb-2 text-xl font-semibold normal-case tracking-normal">
                  {card.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted">{card.body}</p>
              </div>
            </div>
          </AnimatedItem>
        ))}
      </div>
    </section>
  );
}
