"use client";

import { useEffect, useRef, useState } from "react";

const FRAME_COUNT = 106;
const FRAME_PATH = (i: number) => `/frames/frame_${String(i).padStart(4, "0")}.jpg`;

const ANNOTATIONS = [
  {
    id: "card-1",
    show: 0.1,
    hide: 0.3,
    eyebrow: "01 / POWER",
    title: "Reactor spins up",
    body: "The core comes online first — everything downstream of it waits for this.",
  },
  {
    id: "card-2",
    show: 0.35,
    hide: 0.55,
    eyebrow: "02 / PLATING",
    title: "Plating locks in",
    body: "Segments seat themselves in sequence, heaviest first, then the fine joints.",
  },
  {
    id: "card-3",
    show: 0.6,
    hide: 0.8,
    eyebrow: "03 / HUD",
    title: "Visor comes up",
    body: "Targeting and diagnostics overlays boot last, once the frame can actually move.",
  },
];

export default function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const heroTextRef = useRef<HTMLDivElement | null>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const tickingRef = useRef(false);

  const [loadProgress, setLoadProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [visibleCards, setVisibleCards] = useState<string[]>([]);
  const prevVisibleIdsRef = useRef("");

  // preload frames
  useEffect(() => {
    let loadedCount = 0;
    const imgs: HTMLImageElement[] = [];

    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      img.src = FRAME_PATH(i);
      img.onload = () => {
        loadedCount++;
        setLoadProgress(loadedCount / FRAME_COUNT);
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

      if (heroTextRef.current) {
        const opacity = Math.max(0, 1 - progress / 0.08);
        heroTextRef.current.style.opacity = String(opacity);
      }

      const newVisible = ANNOTATIONS.filter((a) => progress >= a.show && progress <= a.hide).map(
        (a) => a.id
      );
      const newIds = [...newVisible].sort().join(",");
      if (newIds !== prevVisibleIdsRef.current) {
        prevVisibleIdsRef.current = newIds;
        setVisibleCards(newVisible);
      }
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
    <section ref={sectionRef} className="scroll-animation relative h-[400vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-background">
        {!loaded && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-4 bg-background">
            <div className="h-[3px] w-[220px] overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full bg-gradient-to-r from-cyan to-gold transition-[width] duration-150"
                style={{ width: `${Math.round(loadProgress * 100)}%` }}
              />
            </div>
            <span className="font-mono text-xs tracking-[0.25em] text-muted">
              LOADING SUIT SEQUENCE — {Math.round(loadProgress * 100)}%
            </span>
          </div>
        )}

        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

        <div
          ref={heroTextRef}
          className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 text-center"
        >
          <div className="font-mono text-[0.78rem] tracking-[0.35em] text-cyan drop-shadow-[0_0_8px_rgba(0,0,0,0.8)]">
            ARC REACTOR &nbsp;/&nbsp; MODEL VII
          </div>
          <h1 className="text-[clamp(2.6rem,9vw,7.2rem)] font-bold leading-[0.92] text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.8)]">
            SUIT UP
          </h1>
          <p className="max-w-[44ch] text-base leading-relaxed text-white/80 drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
            Scroll to bring the reactor online. Every system below runs on the same core.
          </p>
        </div>

        {ANNOTATIONS.map((card, i) => {
          const visible = visibleCards.includes(card.id);
          const side = i % 2 === 0 ? "left-6 md:left-16" : "right-6 md:right-16";
          return (
            <div
              key={card.id}
              className={`absolute ${side} top-1/2 z-20 w-[min(320px,80vw)] -translate-y-1/2 rounded-2xl border border-line bg-background/70 p-6 backdrop-blur-md transition-all duration-400 ${
                visible ? "translate-y-[-50%] opacity-100" : "translate-y-[-40%] opacity-0"
              }`}
            >
              <div className="mb-2 font-mono text-[0.7rem] tracking-[0.2em] text-gold">
                {card.eyebrow}
              </div>
              <h3 className="mb-2 text-lg font-semibold normal-case tracking-normal text-white">
                {card.title}
              </h3>
              <p className="text-sm leading-relaxed text-white/70">{card.body}</p>
            </div>
          );
        })}

        <div className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2 font-mono text-[0.68rem] tracking-[0.25em] text-white/60">
          SCROLL TO CHARGE
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 1024px) {
          .scroll-animation {
            height: 350vh !important;
          }
        }
        @media (max-width: 768px) {
          .scroll-animation {
            height: 300vh !important;
          }
        }
      `}</style>
    </section>
  );
}
