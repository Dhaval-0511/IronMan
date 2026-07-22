"use client";

import { useState } from "react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Button, EyebrowBadge } from "@/components/ui/Button";

export default function FinalCta() {
  const [charged, setCharged] = useState(false);

  return (
    <section id="access" className="relative px-6 py-24 text-center md:py-40">
      <AnimatedSection className="mx-auto flex max-w-[720px] flex-col items-center">
        <EyebrowBadge>
          <span className="justify-center">ACCESS REQUEST</span>
        </EyebrowBadge>
        <h2 className="mb-8 text-[clamp(2rem,4.5vw,3.6rem)] font-bold leading-[1.05]">
          Ready to bring your own reactor online?
        </h2>
        <Button onClick={() => setCharged(true)}>
          <span
            className={`h-2.5 w-2.5 rounded-full bg-cyan shadow-[0_0_10px_var(--cyan)] ${charged ? "animate-pulse" : ""}`}
          />
          {charged ? "Reactor Online" : "Initiate Suit-Up Sequence"}
        </Button>
      </AnimatedSection>
    </section>
  );
}
