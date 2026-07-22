"use client";

import { AnimatedItem, AnimatedSection } from "@/components/ui/AnimatedSection";
import { EyebrowBadge } from "@/components/ui/Button";

const ENTRIES = [
  { id: "001", time: "04:12 UTC", note: "Perimeter sweep, low altitude — no anomalies detected.", status: "NOMINAL" as const },
  { id: "002", time: "09:47 UTC", note: "Repulsor recalibration after high-G maneuver test.", status: "NOMINAL" as const },
  { id: "003", time: "13:02 UTC", note: "Thermal spike on left boot emitter, plating compensated automatically.", status: "FLAGGED" as const },
  { id: "004", time: "18:30 UTC", note: "Long-range flight, reactor sustained 98% output for 40 minutes.", status: "NOMINAL" as const },
  { id: "005", time: "23:55 UTC", note: "Full system diagnostic queued for next power cycle.", status: "QUEUED" as const },
];

const STATUS_STYLES: Record<string, string> = {
  NOMINAL: "text-cyan border-cyan/35",
  FLAGGED: "text-gold border-gold/35",
  QUEUED: "text-cyan border-cyan/35",
};

export default function FlightLog() {
  return (
    <section id="log" className="mx-auto max-w-[1400px] px-6 py-24 md:px-16 md:py-32">
      <AnimatedSection>
        <EyebrowBadge>MISSION LOG</EyebrowBadge>
        <h2 className="mb-4 max-w-[18ch] text-[clamp(2rem,4.2vw,3.4rem)] font-bold leading-[1.05]">
          Last five flights, in order.
        </h2>
        <p className="mb-10 max-w-[52ch] text-base leading-relaxed text-muted">
          A real sequence, timestamped as it happened — not a features list dressed up as one.
        </p>
      </AnimatedSection>

      <div className="flex flex-col border-t border-line">
        {ENTRIES.map((entry, i) => (
          <AnimatedItem key={entry.id} delay={i * 0.04}>
            <div className="grid grid-cols-[50px_1fr] items-center gap-3 border-b border-line py-5 sm:grid-cols-[80px_140px_1fr_120px] sm:gap-5">
              <span className="font-mono text-xs text-muted">{entry.id}</span>
              <span className="font-mono text-xs text-muted sm:order-none order-3 col-span-2 sm:col-span-1">
                {entry.time}
              </span>
              <span className="col-span-2 text-sm sm:col-span-1 sm:text-base">{entry.note}</span>
              <span
                className={`justify-self-start rounded-full border px-3 py-1 font-mono text-[0.7rem] tracking-wider sm:justify-self-end ${STATUS_STYLES[entry.status]}`}
              >
                {entry.status}
              </span>
            </div>
          </AnimatedItem>
        ))}
      </div>
    </section>
  );
}
