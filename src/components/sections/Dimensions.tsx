import { useState, type CSSProperties } from "react";
import overworld from "@/assets/dim-overworld.jpg";
import nether from "@/assets/dim-nether.jpg";
import end from "@/assets/dim-end.jpg";
import { PixelArt } from "@/components/mc/PixelArt";
import { Reveal, SectionHeading } from "@/components/mc/Reveal";
import { heart, heartEmpty, grassBlock, obsidian, enderEye, type Sprite } from "@/lib/sprites";
import { cn } from "@/lib/utils";

type Dim = {
  id: string;
  name: string;
  en: string;
  icon: Sprite;
  image: string;
  accent: string;
  tagline: string;
  description: string;
  biomes: string[];
  mobs: { name: string; note: string }[];
  danger: number;
  facts: [string, string][];
};

const DIMS: Dim[] = [
  {
    id: "overworld",
    name: "Верхний мир",
    en: "Overworld",
    icon: grassBlock,
    image: overworld,
    accent: "var(--emerald)",
    tagline: "Здесь начинается каждая история",
    description:
      "Солнце, реки, леса и бесконечные пещеры. Днём — время строить и исследовать, ночью — держать меч наготове и не отходить далеко от факелов.",
    biomes: ["Равнины", "Густой лес", "Вишнёвая роща", "Пустыня", "Ледяные пики", "Мангровое болото", "Глубокая тьма"],
    mobs: [
      { name: "Крипер", note: "тихо подходит и взрывается" },
      { name: "Зомби", note: "горит на солнце" },
      { name: "Скелет", note: "меткий лучник" },
      { name: "Варден", note: "слепой страж Глубокой тьмы" },
    ],
    danger: 3,
    facts: [
      ["Как попасть", "Точка возрождения"],
      ["Смена дня и ночи", "Есть · 20 минут"],
      ["Кровать", "Работает"],
    ],
  },
  {
    id: "nether",
    name: "Незер",
    en: "The Nether",
    icon: obsidian,
    image: nether,
    accent: "var(--lava)",
    tagline: "Мир огня, пепла и золота",
    description:
      "Озёра лавы размером с океан, багровые грибные леса и крепости, набитые сокровищами. Каждый шаг в Незере равен восьми блокам Верхнего мира.",
    biomes: ["Пустоши Незера", "Багровый лес", "Искажённый лес", "Долина песка душ", "Базальтовые дельты"],
    mobs: [
      { name: "Гаст", note: "плачет и стреляет огнём" },
      { name: "Пиглин", note: "любит золото" },
      { name: "Ифрит", note: "охраняет крепости" },
      { name: "Хоглин", note: "агрессивный кабан" },
    ],
    danger: 7,
    facts: [
      ["Как попасть", "Портал из обсидиана"],
      ["Смена дня и ночи", "Нет"],
      ["Кровать", "Взрывается!"],
    ],
  },
  {
    id: "end",
    name: "Энд",
    en: "The End",
    icon: enderEye,
    image: end,
    accent: "var(--portal)",
    tagline: "Финал — или только начало",
    description:
      "Парящие острова над бездной, обсидиановые колонны с кристаллами и Дракон Края. Победи его — и откроются внешние острова с городами и элитрами.",
    biomes: ["Главный остров", "Внешние острова", "Высокогорья Энда", "Пустота"],
    mobs: [
      { name: "Дракон Края", note: "главный босс игры" },
      { name: "Эндермен", note: "не смотри ему в глаза" },
      { name: "Шалкер", note: "заставляет левитировать" },
      { name: "Эндермит", note: "мелкий, но надоедливый" },
    ],
    danger: 9,
    facts: [
      ["Как попасть", "Око Края + портал"],
      ["Смена дня и ночи", "Вечная тьма"],
      ["Кровать", "Взрывается!"],
    ],
  },
];

export function Dimensions() {
  const [activeId, setActiveId] = useState(DIMS[0]!.id);
  const dim = DIMS.find((d) => d.id === activeId)!;

  return (
    <section
      id="dimensions"
      className="relative overflow-hidden py-24 sm:py-32"
      style={{ "--dim": dim.accent, transition: "--dim 700ms ease" } as CSSProperties}
    >
      {DIMS.map((d) => (
        <img
          key={d.id}
          src={d.image}
          alt=""
          aria-hidden
          loading="lazy"
          width={1280}
          height={800}
          className={cn(
            "absolute inset-0 h-full w-full scale-105 object-cover blur-[2px] transition-opacity duration-700",
            d.id === activeId ? "opacity-30" : "opacity-0",
          )}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-obsidian via-obsidian/70 to-obsidian" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,color-mix(in_oklab,var(--dim)_22%,transparent),transparent_65%)]" />

      <div className="relative mx-auto max-w-7xl px-4">
        <SectionHeading
          kicker="// Измерения"
          title="Три мира. Три испытания."
          subtitle="Переключай измерения и смотри, как меняется атмосфера, обитатели и уровень опасности."
        />

        <Reveal>
          <div role="tablist" aria-label="Измерения" className="mb-8 grid gap-3 sm:grid-cols-3">
            {DIMS.map((d) => {
              const active = d.id === activeId;
              return (
                <button
                  key={d.id}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveId(d.id)}
                  className={cn(
                    "mc-btn justify-start gap-4 px-4 py-4 text-left",
                    active ? "bg-obsidian-3 text-foreground" : "bg-obsidian-2 text-muted-foreground",
                  )}
                  style={active ? { borderColor: d.accent, boxShadow: `var(--bevel), 0 0 28px color-mix(in oklab, ${d.accent} 50%, transparent)` } : undefined}
                >
                  <span className="mc-slot grid h-12 w-12 shrink-0 place-items-center">
                    <PixelArt sprite={d.icon} size={30} />
                  </span>
                  <span className="flex flex-col gap-1.5">
                    <span className="text-[0.65rem]" style={active ? { color: d.accent } : undefined}>
                      {d.name}
                    </span>
                    <span className="font-mono text-[0.65rem] normal-case text-muted-foreground">{d.en}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </Reveal>

        <Reveal>
          <div
            key={dim.id}
            className="mc-panel grid overflow-hidden border-dim transition-colors duration-700 lg:grid-cols-[1.1fr_1fr] animate-in fade-in duration-500"
            style={{ boxShadow: "inset 0 0 0 2px var(--dim), 0 0 60px -10px var(--dim), 8px 8px 0 0 oklch(0 0 0 / 0.5)" }}
          >
            <div className="relative min-h-72 lg:min-h-full">
              <img
                src={dim.image}
                alt={`${dim.name}: пейзаж измерения`}
                loading="lazy"
                width={1280}
                height={800}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/20 to-transparent" />
              <div className="absolute right-0 bottom-0 left-0 p-6">
                <p className="font-pixel text-shadow-pixel text-[0.6rem] uppercase text-dim">{dim.en}</p>
                <h3 className="font-pixel text-shadow-pixel mt-2 text-xl sm:text-2xl">{dim.name}</h3>
                <p className="mt-2 text-sm text-foreground/80">{dim.tagline}</p>
              </div>
            </div>

            <div className="space-y-7 p-6 sm:p-8">
              <p className="text-base text-foreground/85">{dim.description}</p>

              <div>
                <p className="font-pixel mb-3 text-[0.55rem] uppercase text-dim">Уровень опасности</p>
                <div className="flex flex-wrap gap-1" aria-label={`Опасность: ${dim.danger} из 10`}>
                  {Array.from({ length: 10 }).map((_, i) => (
                    <PixelArt key={i} sprite={i < dim.danger ? heart : heartEmpty} size={22} />
                  ))}
                </div>
              </div>

              <div>
                <p className="font-pixel mb-3 text-[0.55rem] uppercase text-dim">Биомы</p>
                <div className="flex flex-wrap gap-2">
                  {dim.biomes.map((b) => (
                    <span key={b} className="mc-slot px-3 py-1.5 font-mono text-xs text-foreground/90">
                      {b}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-pixel mb-3 text-[0.55rem] uppercase text-dim">Уникальные мобы</p>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {dim.mobs.map((m) => (
                    <li key={m.name} className="flex items-start gap-3 border-l-4 border-dim bg-obsidian/60 px-3 py-2">
                      <span>
                        <span className="block text-sm font-semibold">{m.name}</span>
                        <span className="block font-mono text-xs text-muted-foreground">{m.note}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <dl className="grid grid-cols-3 gap-2">
                {dim.facts.map(([k, v]) => (
                  <div key={k} className="mc-slot p-3">
                    <dt className="font-mono text-[0.65rem] uppercase text-muted-foreground">{k}</dt>
                    <dd className="mt-1 text-xs font-semibold sm:text-sm">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
