"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { EyebrowBadge } from "@/components/ui/Button";

const CIRCUMFERENCE = 314;

function Gauge({
  target,
  color,
  label,
  format,
}: {
  target: number;
  color: string;
  label: string;
  format: (v: number) => string;
}) {
  const circleRef = useRef<SVGCircleElement | null>(null);
  const valRef = useRef<HTMLDivElement | null>(null);
  const [started, setStarted] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setStarted(true);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let current = 0;
    let raf = 0;
    const step = () => {
      current += (target - current) * 0.06;
      if (Math.abs(target - current) < 0.3) current = target;
      if (circleRef.current) {
        circleRef.current.style.strokeDashoffset = String(
          CIRCUMFERENCE - (CIRCUMFERENCE * current) / 100
        );
      }
      if (valRef.current) valRef.current.textContent = format(current);
      if (current !== target) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [started, target, format]);

  return (
    <div ref={wrapRef} className="neu-card flex flex-col items-center gap-3 p-7">
      <svg viewBox="0 0 120 120" className="h-[120px] w-[120px]">
        <circle cx="60" cy="60" r="50" fill="none" stroke="var(--line)" strokeWidth="8" />
        <circle
          ref={circleRef}
          cx="60"
          cy="60"
          r="50"
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE}
          transform="rotate(-90 60 60)"
        />
      </svg>
      <div ref={valRef} className="font-mono text-2xl">
        0
      </div>
      <div className="font-mono text-[0.68rem] tracking-[0.2em] text-muted">{label}</div>
    </div>
  );
}

export default function Diagnostics() {
  return (
    <section id="diagnostics" className="mx-auto max-w-[1400px] px-6 py-24 md:px-16 md:py-32">
      <AnimatedSection>
        <EyebrowBadge>LIVE DIAGNOSTICS</EyebrowBadge>
        <h2 className="mb-4 max-w-[18ch] text-[clamp(2rem,4.2vw,3.4rem)] font-bold leading-[1.05]">
          Reactor telemetry, right now.
        </h2>
        <p className="mb-14 max-w-[52ch] text-base leading-relaxed text-muted">
          Three numbers the AI core is watching every second you&apos;re airborne.
        </p>
      </AnimatedSection>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <Gauge target={97} color="var(--cyan)" label="POWER OUTPUT" format={(v) => `${Math.round(v)}%`} />
        <Gauge target={82} color="var(--gold)" label="ALTITUDE" format={(v) => `${Math.round(v * 95)} ft`} />
        <Gauge
          target={68}
          color="var(--red)"
          label="THRUST SPEED"
          format={(v) => `Mach ${((v / 100) * 1.4).toFixed(1)}`}
        />
      </div>
    </section>
  );
}
