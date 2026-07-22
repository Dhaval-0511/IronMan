"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";

const FRAME_COUNT = 97;
const FRAME_PATH = (i: number) => `/tunnel-frames/frame_${String(i).padStart(4, "0")}.jpg`;

const SUITS = [
  { id: "s1", show: 0.04, hide: 0.17, mark: "MARK I", tag: "Improvised", note: "Built under pressure, welded rather than engineered — proof of concept only." },
  { id: "s2", show: 0.2, hide: 0.33, mark: "MARK III", tag: "Combat", note: "First armor rated for sustained flight and repulsor combat load." },
  { id: "s3", show: 0.36, hide: 0.49, mark: "MARK VII", tag: "Modular", note: "Segmented plating that assembles itself piece by piece around the pilot." },
  { id: "s4", show: 0.52, hide: 0.64, mark: "MARK XLII", tag: "Remote-call", note: "Individually-actuated plates fly to the pilot from a distance." },
  { id: "s5", show: 0.67, hide: 0.78, mark: "BLEEDING EDGE", tag: "Nanite", note: "Stored as liquid, reshapes itself into full armor in under three seconds." },
];

export default function ArsenalShowcase() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const introRef = useRef<HTMLDivElement | null>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const tickingRef = useRef(false);

  const [loaded, setLoaded] = useState(false);
  const [visibleCards, setVisibleCards] = useState<string[]>([]);
  const [showCta, setShowCta] = useState(false);
  const prevVisibleIdsRef = useRef("");

  useEffect(() => {
    let loadedCount = 0;
    const imgs: HTMLImageElement[] = [];
    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      img.src = FRAME_PATH(i);
      img.onload = () => {
        loadedCount++;
        if (loadedCount === FRAME_COUNT) setLoaded(true);
      };
      imgs.push(img);
    }
    framesRef.current = imgs;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const section = sectionRef.current!;
    const ctx = canvas.getContext("2d")!;

    function resizeCanvas() {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      drawFrame(currentFrameRef.current);
    }

    function drawFrame(index: number) {
      const img = framesRef.current[index];
      if (!img || !img.complete || img.naturalWidth === 0) return;

      const cw = canvas.width;
      const ch = canvas.height;
      const imgRatio = img.naturalWidth / img.naturalHeight;
      const canvasRatio = cw / ch;

      let drawW: number;
      let drawH: number;
      if (canvasRatio > imgRatio) {
        drawW = cw;
        drawH = cw / imgRatio;
      } else {
        drawH = ch;
        drawW = ch * imgRatio;
      }
      if (window.innerWidth <= 768) {
        drawW *= 1.3;
        drawH *= 1.3;
      }
      const drawX = (cw - drawW) / 2;
      const drawY = (ch - drawH) / 2;

      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, drawX, drawY, drawW, drawH);
    }

    function computeProgress() {
      const rect = section.getBoundingClientRect();
      const scrollableHeight = section.offsetHeight - window.innerHeight;
      const progress = Math.min(1, Math.max(0, -rect.top / scrollableHeight));

      const frameIndex = Math.min(FRAME_COUNT - 1, Math.floor(progress * FRAME_COUNT));
      currentFrameRef.current = frameIndex;
      drawFrame(frameIndex);

      if (introRef.current) {
        const introOpacity = Math.max(0, 1 - progress / 0.06);
        introRef.current.style.opacity = String(introOpacity);
      }

      const newVisible = SUITS.filter((s) => progress >= s.show && progress <= s.hide).map(
        (s) => s.id
      );
      const newIds = [...newVisible].sort().join(",");
      if (newIds !== prevVisibleIdsRef.current) {
        prevVisibleIdsRef.current = newIds;
        setVisibleCards(newVisible);
      }

      setShowCta(progress >= 0.82);
    }

    function onScroll() {
      if (!tickingRef.current) {
        tickingRef.current = true;
        requestAnimationFrame(() => {
          computeProgress();
          tickingRef.current = false;
        });
      }
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("scroll", onScroll, { passive: true });
    computeProgress();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("scroll", onScroll);
    };
  }, [loaded]);

  return (
    <section ref={sectionRef} className="showcase-scroll relative h-[500vh] bg-[#050506]">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />

        <div
          ref={introRef}
          className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 text-center px-6"
        >
          <div className="font-mono text-[0.78rem] tracking-[0.35em] text-gold">THE ARSENAL</div>
          <h2 className="text-[clamp(2.2rem,7vw,5.4rem)] font-bold leading-[0.95] text-white">
            Five marks. One evolution.
          </h2>
          <p className="max-w-[46ch] text-base leading-relaxed text-white/75">
            Keep scrolling — each suit in the lineup earned its slot by fixing what broke on the last one.
          </p>
        </div>

        {SUITS.map((suit, i) => {
          const visible = visibleCards.includes(suit.id);
          const side = i % 2 === 0 ? "left-6 md:left-16" : "right-6 md:right-16";
          return (
            <div
              key={suit.id}
              className={`absolute ${side} bottom-24 z-20 w-[min(300px,80vw)] rounded-2xl border border-line bg-black/60 p-6 backdrop-blur-md transition-all duration-400 ${
                visible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
              }`}
            >
              <div className="mb-1 flex items-center justify-between font-mono text-[0.68rem] tracking-[0.2em] text-cyan">
                <span>{suit.mark}</span>
                <span className="text-muted">{suit.tag}</span>
              </div>
              <p className="text-sm leading-relaxed text-white/75">{suit.note}</p>
            </div>
          );
        })}

        <div
          className={`absolute inset-0 z-30 flex flex-col items-center justify-center gap-6 bg-black/80 text-center backdrop-blur-sm transition-opacity duration-500 ${
            showCta ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <div className="font-mono text-xs tracking-[0.3em] text-gold">END OF ARCHIVE</div>
          <h3 className="max-w-[16ch] text-[clamp(1.8rem,5vw,3.4rem)] font-bold text-white">
            Ready to design the next mark?
          </h3>
          <Button onClick={() => document.getElementById("access")?.scrollIntoView({ behavior: "smooth" })}>
            Jump to access
          </Button>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 1024px) {
          .showcase-scroll {
            height: 450vh !important;
          }
        }
        @media (max-width: 768px) {
          .showcase-scroll {
            height: 400vh !important;
          }
        }
      `}</style>
    </section>
  );
}
