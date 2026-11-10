import { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";
import heroImg from "@/assets/hero-world.jpg";
import { PixelArt } from "@/components/mc/PixelArt";
import { McButton, McLink } from "@/components/mc/McButton";
import { MineableBlock } from "@/components/mc/MineableBlock";
import { Modal } from "@/components/mc/Modal";
import { heart, hunger } from "@/lib/sprites";

// Deterministic pseudo-random so SSR and client markup match.
const seeded = (i: number) => {
  const x = Math.sin(i * 9301 + 49297) * 233280;
  return x - Math.floor(x);
};
const ORBS = Array.from({ length: 28 }, (_, i) => ({
  left: seeded(i) * 100,
  top: 35 + seeded(i + 100) * 65,
  size: 6 + Math.round(seeded(i + 200) * 8),
  delay: seeded(i + 300) * 8,
  dur: 6 + seeded(i + 400) * 6,
}));

export function Hero() {
  const bgRef = useRef<HTMLDivElement>(null);
  const [trailer, setTrailer] = useState(false);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const y = window.scrollY;
        if (bgRef.current) bgRef.current.style.transform = `translate3d(0, ${y * 0.4}px, 0) scale(1.12)`;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section id="top" className="relative flex min-h-screen items-center overflow-hidden pt-28 pb-20">
      <div ref={bgRef} className="absolute inset-0 will-change-transform" style={{ transform: "scale(1.12)" }}>
        <img
          src={heroImg}
          alt="Кубический мир на закате: водопады, замок и северное сияние"
          width={1920}
          height={1088}
          className="h-full w-full object-cover"
          fetchPriority="high"
        />
      </div>
      <div className="absolute inset-0 bg-[image:var(--gradient-hero-fade)]" />
      <div className="absolute inset-0 bg-pixel-grid opacity-60" />

      {/* XP orbs */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {ORBS.map((o, i) => (
          <span
            key={i}
            className="absolute bg-mc-yellow"
            style={{
              left: `${o.left}%`,
              top: `${o.top}%`,
              width: o.size,
              height: o.size,
              boxShadow: "0 0 12px 3px color-mix(in oklab, var(--emerald) 75%, transparent), inset -2px -2px 0 color-mix(in oklab, var(--emerald) 80%, black)",
              animation: `xp-float ${o.dur}s ease-in-out ${o.delay}s infinite, xp-pulse 1.4s steps(4) infinite`,
              opacity: 0,
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 px-4 lg:grid-cols-[1.25fr_1fr]">
        <div>
          {/* HUD */}
          <div className="mb-8 inline-flex flex-col gap-2 bg-obsidian/60 p-3 backdrop-blur-sm mc-panel">
            <div className="group flex gap-1" aria-label="Здоровье: 10 из 10">
              {Array.from({ length: 10 }).map((_, i) => (
                <span key={i} className="group-hover:animate-heart-shake" style={{ animationDelay: `${i * 40}ms` }}>
                  <PixelArt sprite={heart} size={22} />
                </span>
              ))}
            </div>
            <div className="flex gap-1" aria-label="Сытость: 10 из 10">
              {Array.from({ length: 10 }).map((_, i) => (
                <PixelArt key={i} sprite={hunger} size={22} />
              ))}
            </div>
            <div className="relative mt-1 h-2.5 border-2 border-obsidian bg-obsidian-3">
              <div className="h-full w-[72%] bg-emerald shadow-[var(--glow-emerald)]" />
              <span className="font-pixel text-shadow-pixel absolute -top-3 left-1/2 -translate-x-1/2 text-[0.6rem] text-emerald">30</span>
            </div>
          </div>

          <h1 className="font-pixel text-shadow-glow text-3xl leading-[1.35] sm:text-5xl lg:text-[3.4rem]">
            <span className="block text-emerald">MINECRAFT:</span>
            <span className="mt-3 block text-[0.62em] text-foreground">СОЗДАЙ СВОЮ ВСЕЛЕННУЮ</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-foreground/85 sm:text-xl">
            Безграничная песочница, где каждый блок — твой выбор. Выживай в первую ночь, строй замки до облаков,
            собирай редстоун-машины и бросай вызов Дракону Края.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <McLink href="#modes" variant="emerald" size="lg">
              Начать выживание
            </McLink>
            <McButton variant="stone" size="lg" onClick={() => setTrailer(true)}>
              <Play className="h-4 w-4 fill-current" /> Смотреть трейлер
            </McButton>
          </div>
          <p className="mt-6 font-mono text-xs text-muted-foreground">
            От первого блока до Дракона Края · Java & Bedrock · 2009 — ∞
          </p>
        </div>

        <div className="flex justify-center">
          <MineableBlock />
        </div>
      </div>

      <a
        href="#about"
        className="font-pixel absolute bottom-6 left-1/2 -translate-x-1/2 animate-bob text-[0.55rem] text-muted-foreground hover:text-emerald"
      >
        ▼ Листай вниз
      </a>

      <Modal open={trailer} onClose={() => setTrailer(false)} label="Трейлер Minecraft">
        <div className="mc-panel p-2">
          <div className="aspect-video w-full bg-obsidian">
            {trailer && (
              <iframe
                className="h-full w-full"
                src="https://www.youtube-nocookie.com/embed/MmB9b5njVbA?autoplay=1&rel=0"
                title="Официальный трейлер Minecraft"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            )}
          </div>
        </div>
      </Modal>
    </section>
  );
}
