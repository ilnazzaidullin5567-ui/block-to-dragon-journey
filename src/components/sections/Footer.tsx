import { useRef, useState, type CSSProperties } from "react";
import { PixelArt } from "@/components/mc/PixelArt";
import { creeperFace, grassBlock } from "@/lib/sprites";
import { sfx } from "@/lib/audio";
import { cn } from "@/lib/utils";

const NAV = [
  ["О мире", "#about"],
  ["Измерения", "#dimensions"],
  ["Режимы", "#modes"],
  ["Крафт", "#crafting"],
  ["Галерея", "#gallery"],
  ["Саундтрек", "#music"],
];
const EXTERNAL = [
  ["Официальный сайт", "https://www.minecraft.net/ru-ru"],
  ["Minecraft Wiki", "https://ru.minecraft.wiki/"],
  ["Трейлер на YouTube", "https://www.youtube.com/watch?v=MmB9b5njVbA"],
];

type Phase = "idle" | "hiss" | "boom";

export function Footer() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [count, setCount] = useState(0);
  const [bits, setBits] = useState<{ id: number; dx: number; dy: number; c: string; s: number }[]>([]);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const ignite = () => {
    if (phase !== "idle") return;
    setPhase("hiss");
    sfx.hiss();
    timers.current.push(
      setTimeout(() => {
        setPhase("boom");
        sfx.boom();
        setCount((c) => c + 1);
        const cols = ["#4fae3a", "#7ccf5f", "#efefef", "#ff4500", "#3a3a3a"];
        setBits(
          Array.from({ length: 40 }, (_, i) => {
            const a = Math.random() * Math.PI * 2;
            const d = 80 + Math.random() * 180;
            return { id: Date.now() + i, dx: Math.cos(a) * d, dy: Math.sin(a) * d, c: cols[i % cols.length] ?? "#4fae3a", s: 6 + Math.random() * 10 };
          }),
        );
      }, 1500),
      setTimeout(() => {
        setPhase("idle");
        setBits([]);
      }, 3200),
    );
  };

  return (
    <footer className="relative bg-bedrock">
      <div className="h-3 bg-obsidian-tex shadow-[0_-4px_0_0_oklch(0_0_0/0.6)]" />
      <div className="absolute inset-0 top-3 bg-gradient-to-b from-obsidian/70 via-obsidian/40 to-obsidian/80" />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-16 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <div className="flex items-center gap-3">
            <span className="mc-slot grid h-11 w-11 place-items-center">
              <PixelArt sprite={grassBlock} size={28} />
            </span>
            <span className="font-pixel text-shadow-pixel text-[0.7rem] leading-tight">
              <span className="text-emerald">БЕСКОНЕЧНЫЕ</span>
              <br />
              МИРЫ
            </span>
          </div>
          <p className="mt-5 max-w-xs text-sm text-foreground/75">
            От первого блока до Дракона Края. Фан-лендинг, сделанный с любовью к кубам, редстоуну и ночным
            пещерам.
          </p>
        </div>

        <nav aria-label="Разделы">
          <p className="font-pixel mb-4 text-[0.55rem] uppercase text-emerald">Навигация</p>
          <ul className="space-y-2">
            {NAV.map(([l, h]) => (
              <li key={h}>
                <a href={h} className="font-mono text-sm text-foreground/80 transition-colors hover:text-emerald">
                  › {l}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="font-pixel mb-4 text-[0.55rem] uppercase text-emerald">Ресурсы</p>
          <ul className="space-y-2">
            {EXTERNAL.map(([l, h]) => (
              <li key={h}>
                <a href={h} target="_blank" rel="noreferrer" className="font-mono text-sm text-foreground/80 transition-colors hover:text-diamond">
                  ↗ {l}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Creeper easter egg */}
        <div className="flex flex-col items-center text-center md:items-end md:text-right">
          <p className="font-pixel mb-4 text-[0.55rem] uppercase text-redstone">Пасхалка</p>
          <div className="relative">
            <button
              onClick={ignite}
              aria-label="Нажми на Крипера — осторожно, шипит!"
              className={cn(
                "mc-slot relative grid h-28 w-28 place-items-center transition-transform",
                phase === "idle" && "hover:scale-105",
                phase === "hiss" && "animate-hiss",
                phase === "boom" && "scale-0 opacity-0",
              )}
            >
              <PixelArt sprite={creeperFace} size={88} />
              {phase === "hiss" && (
                <span className="absolute inset-0 bg-foreground" style={{ animation: "flash-white 300ms steps(2) infinite" }} />
              )}
            </button>
            {bits.map((b) => (
              <span
                key={b.id}
                className="pointer-events-none absolute top-1/2 left-1/2"
                style={
                  {
                    width: b.s,
                    height: b.s,
                    background: b.c,
                    "--dx": `${b.dx}px`,
                    "--dy": `${b.dy}px`,
                    animation: "particle-burst 1000ms cubic-bezier(0.1,0.6,0.3,1) forwards",
                  } as CSSProperties
                }
              />
            ))}
            {phase === "boom" && (
              <span className="font-pixel text-shadow-pixel absolute inset-0 grid animate-pop-in place-items-center text-lg text-lava">
                БУМ!
              </span>
            )}
          </div>
          <p className="mt-4 font-mono text-xs text-foreground/80" aria-live="polite">
            {phase === "hiss" ? "Сссссс…" : phase === "boom" ? "Ты взорвал крипера!" : "Нажми на Крипера — осторожно, шипит!"}
          </p>
          {count > 0 && <p className="font-pixel mt-2 text-[0.5rem] text-muted-foreground">Взорвано: {count}</p>}
        </div>
      </div>

      <div className="relative border-t-2 border-obsidian/80 bg-obsidian/70">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 font-mono text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Бесконечные Миры · Фан-проект, не является официальным сайтом.</p>
          <p>Minecraft — товарный знак Mojang Studios и Microsoft.</p>
        </div>
      </div>
    </footer>
  );
}
