import overworld from "@/assets/dim-overworld.jpg";
import city from "@/assets/gal-city.jpg";
import nether from "@/assets/dim-nether.jpg";
import castle from "@/assets/gal-castle.jpg";
import { PixelArt } from "@/components/mc/PixelArt";
import { Reveal, SectionHeading } from "@/components/mc/Reveal";
import { compass, diamondSword, grassBlock, heartHardcore, type Sprite } from "@/lib/sprites";

type Mode = {
  name: string;
  en: string;
  icon: Sprite;
  image: string;
  accent: string;
  advancement: string;
  description: string;
  stats: { label: string; value: number }[];
  lore: string[];
};

const MODES: Mode[] = [
  {
    name: "Выживание",
    en: "Survival",
    icon: diamondSword,
    image: overworld,
    accent: "var(--emerald)",
    advancement: "Время добывать!",
    description: "Добывай ресурсы, следи за голодом и здоровьем, крафти броню и переживи первую ночь.",
    stats: [
      { label: "Сложность", value: 3 },
      { label: "Свобода", value: 4 },
      { label: "Адреналин", value: 3 },
    ],
    lore: ["Классический режим", "Опыт, голод и монстры", "Подходит новичкам"],
  },
  {
    name: "Творчество",
    en: "Creative",
    icon: grassBlock,
    image: city,
    accent: "var(--diamond)",
    advancement: "Архитектор",
    description: "Бесконечные блоки, полёт и бессмертие. Только ты, воображение и пустой мир.",
    stats: [
      { label: "Сложность", value: 0 },
      { label: "Свобода", value: 5 },
      { label: "Адреналин", value: 1 },
    ],
    lore: ["Все блоки в инвентаре", "Полёт двойным прыжком", "Мгновенная добыча"],
  },
  {
    name: "Хардкор",
    en: "Hardcore",
    icon: heartHardcore,
    image: nether,
    accent: "var(--redstone)",
    advancement: "Одна жизнь",
    description: "Максимальная сложность и одна попытка. Умер — мир остаётся только в воспоминаниях.",
    stats: [
      { label: "Сложность", value: 5 },
      { label: "Свобода", value: 3 },
      { label: "Адреналин", value: 5 },
    ],
    lore: ["Сложность заблокирована", "Без возрождения", "Для настоящих героев"],
  },
  {
    name: "Приключение",
    en: "Adventure",
    icon: compass,
    image: castle,
    accent: "var(--gold)",
    advancement: "Странник",
    description: "Карты от авторов, квесты и головоломки. Ломать можно только то, что разрешено.",
    stats: [
      { label: "Сложность", value: 3 },
      { label: "Свобода", value: 2 },
      { label: "Адреналин", value: 4 },
    ],
    lore: ["Пользовательские карты", "Сюжет и загадки", "Особые правила"],
  },
];

export function GameModes() {
  return (
    <section id="modes" className="relative bg-obsidian-2 py-24 sm:py-32">
      <div className="absolute inset-0 bg-pixel-grid" />
      <div className="relative mx-auto max-w-7xl px-4">
        <SectionHeading
          kicker="// Режимы игры"
          title="Выбери свой путь"
          subtitle="Четыре режима — четыре разных Minecraft. Наведи на карточку, чтобы прочитать описание предмета."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {MODES.map((m, i) => (
            <Reveal key={m.en} delay={i * 100}>
              <article
                className="group relative h-full outline-none"
                tabIndex={0}
                style={{ ["--mode" as string]: m.accent }}
              >
                <div className="mc-panel flex h-full flex-col transition-all duration-200 group-hover:-translate-y-2 group-hover:shadow-[0_0_40px_-6px_var(--mode),6px_6px_0_0_oklch(0_0_0/0.5)] group-focus-visible:-translate-y-2">
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={m.image}
                      alt={`Иллюстрация режима «${m.name}»`}
                      loading="lazy"
                      width={1024}
                      height={768}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-obsidian-2 to-transparent" />
                  </div>

                  {/* Advancement toast */}
                  <div className="relative -mt-8 mx-4 flex items-center gap-3 border-2 border-obsidian bg-obsidian-3 p-2 shadow-[var(--bevel)]">
                    <span
                      className="pixel-corners grid h-12 w-12 shrink-0 place-items-center"
                      style={{ background: `color-mix(in oklab, ${m.accent} 35%, var(--obsidian))` }}
                    >
                      <PixelArt sprite={m.icon} size={30} />
                    </span>
                    <span className="min-w-0">
                      <span className="font-pixel block text-[0.5rem] text-mc-yellow">Достижение получено!</span>
                      <span className="mt-1 block truncate font-mono text-xs">{m.advancement}</span>
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-pixel text-shadow-pixel text-sm" style={{ color: m.accent }}>
                      {m.name}
                    </h3>
                    <p className="mt-1 font-mono text-xs text-muted-foreground">{m.en}</p>
                    <p className="mt-4 flex-1 text-sm text-foreground/85">{m.description}</p>
                    <dl className="mt-5 space-y-2">
                      {m.stats.map((s) => (
                        <div key={s.label} className="flex items-center justify-between gap-3">
                          <dt className="font-mono text-xs text-muted-foreground">{s.label}</dt>
                          <dd className="flex gap-1" aria-label={`${s.value} из 5`}>
                            {Array.from({ length: 5 }).map((_, k) => (
                              <span
                                key={k}
                                className="h-3 w-4 border border-obsidian"
                                style={{ background: k < s.value ? m.accent : "var(--obsidian-3)" }}
                              />
                            ))}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>

                {/* Enchanted tooltip */}
                <div
                  role="tooltip"
                  className="mc-tooltip pointer-events-none absolute top-6 left-1/2 z-20 w-60 -translate-x-1/2 -translate-y-full opacity-0 transition-all duration-200 group-hover:-translate-y-[calc(100%+8px)] group-hover:opacity-100 group-focus-visible:opacity-100"
                >
                  <p className="text-sm font-bold text-mc-aqua">Режим «{m.name}»</p>
                  {m.lore.map((l) => (
                    <p key={l} className="text-xs text-mc-gray">
                      {l}
                    </p>
                  ))}
                  <p className="mt-2 text-xs text-mc-blue">/gamemode {m.en.toLowerCase()}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
