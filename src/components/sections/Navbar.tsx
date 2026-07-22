"use client";

import { useEffect, useState } from "react";
import { List, X } from "@phosphor-icons/react";

const LINKS = [
  { href: "#systems", label: "Systems" },
  { href: "#log", label: "Flight Log" },
  { href: "#diagnostics", label: "Diagnostics" },
  { href: "#access", label: "Access" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-100 flex items-center justify-between border-b border-line px-6 py-5 backdrop-blur-xl transition-colors duration-300 md:px-14 ${
        scrolled ? "bg-background/75" : "bg-background/35"
      }`}
    >
      <div className="flex items-center gap-2.5 font-display text-lg font-bold tracking-wider">
        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-cyan shadow-[0_0_12px_var(--cyan)]" />
        M A R K &mdash; LXXXV
      </div>

      <div className="hidden items-center gap-10 font-mono text-xs uppercase tracking-[0.12em] text-muted md:flex">
        {LINKS.map((l) => (
          <a key={l.href} href={l.href} className="transition-colors hover:text-gold">
            {l.label}
          </a>
        ))}
      </div>

      <button
        className="text-foreground md:hidden"
        onClick={() => setOpen((v) => !v)}
        aria-label="Toggle menu"
      >
        {open ? <X size={22} /> : <List size={22} />}
      </button>

      {open && (
        <div className="absolute inset-x-0 top-full flex flex-col gap-1 border-b border-line bg-background/95 p-4 font-mono text-sm uppercase tracking-wider text-muted md:hidden">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-lg px-3 py-3 hover:bg-panel hover:text-gold"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
