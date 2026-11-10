import { useCallback, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import lake from "@/assets/gal-shaders-lake.jpg";
import dragon from "@/assets/gal-dragon.jpg";
import castle from "@/assets/gal-castle.jpg";
import city from "@/assets/gal-city.jpg";
import redstone from "@/assets/gal-redstone.jpg";
import rails from "@/assets/gal-rails.jpg";
import { McButton } from "@/components/mc/McButton";
import { Modal } from "@/components/mc/Modal";
import { Reveal, SectionHeading } from "@/components/mc/Reveal";
import { cn } from "@/lib/utils";

const TAGS = ["Все", "Шейдеры", "Мега-постройки", "Редстоун"] as const;
type Tag = (typeof TAGS)[number];

const SHOTS: { src: string; title: string; tag: Exclude<Tag, "Все">; desc: string }[] = [
  { src: lake, title: "Закат над вишнёвым озером", tag: "Шейдеры", desc: "Отражения, объёмные облака и лучи солнца с шейдерами." },
  { src: castle, title: "Королевская цитадель", tag: "Мега-постройки", desc: "Замок на горе и целый город у подножия — сотни часов работы." },
  { src: redstone, title: "Логическая машина", tag: "Редстоун", desc: "Поршни, повторители и лампы: компьютер из пыли редстоуна." },
  { src: dragon, title: "Битва с Драконом Края", tag: "Шейдеры", desc: "Финальный босс в алмазной броне — кадр с кинематографичным светом." },
  { src: city, title: "Лазурный мегаполис", tag: "Мега-постройки", desc: "Небоскрёбы из кварца и стекла, мосты и морские фонари." },
  { src: rails, title: "Подземная фабрика", tag: "Редстоун", desc: "Автоферма, вагонетки и сортировка лута глубоко под землёй." },
];

export function Gallery() {
  const [tag, setTag] = useState<Tag>("Все");
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const list = useMemo(() => (tag === "Все" ? SHOTS : SHOTS.filter((s) => s.tag === tag)), [tag]);
  const current = openIdx !== null ? list[openIdx] : null;

  const step = useCallback(
    (d: number) => setOpenIdx((i) => (i === null ? i : (i + d + list.length) % list.length)),
    [list.length],
  );
  const onKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    },
    [step],
  );
  const close = useCallback(() => setOpenIdx(null), []);

  return (
    <section id="gallery" className="relative bg-obsidian-2 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading
          kicker="// Галерея"
          title="Миры, которые построили игроки"
          subtitle="Шейдеры, мега-постройки и редстоун-инженерия. Нажми на кадр, чтобы открыть его на весь экран."
        />

        <Reveal>
          <div className="mb-10 flex flex-wrap justify-center gap-3" role="group" aria-label="Фильтр галереи">
            {TAGS.map((t) => (
              <McButton key={t} size="sm" variant={t === tag ? "selected" : "dark"} aria-pressed={t === tag} onClick={() => setTag(t)}>
                {t}
              </McButton>
            ))}
          </div>
        </Reveal>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((s, i) => (
            <button
              key={s.title}
              onClick={() => setOpenIdx(i)}
              className="group mc-panel relative block overflow-hidden text-left animate-in fade-in zoom-in-95 duration-500"
              style={{ animationDelay: `${i * 60}ms`, animationFillMode: "both" }}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={s.src}
                  alt={s.title}
                  loading="lazy"
                  width={1024}
                  height={768}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/10 to-transparent opacity-90" />
                <span className="font-pixel absolute top-3 left-3 border-2 border-obsidian bg-obsidian/80 px-2 py-1 text-[0.5rem] text-emerald">
                  {s.tag}
                </span>
                <span className="mc-btn absolute top-3 right-3 h-9 w-9 bg-stone p-0 opacity-0 transition-opacity group-hover:opacity-100">
                  <Maximize2 className="h-4 w-4" />
                </span>
              </div>
              <div className="absolute right-0 bottom-0 left-0 p-4">
                <h3 className="font-pixel text-shadow-pixel text-[0.7rem] leading-relaxed">{s.title}</h3>
                <p className="mt-1 line-clamp-2 text-xs text-foreground/75">{s.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <Modal open={current !== null} onClose={close} label="Просмотр скриншота" onKey={onKey}>
        {current && (
          <figure className="mc-panel p-2">
            <img src={current.src} alt={current.title} className="max-h-[75vh] w-full object-contain" />
            <figcaption className="flex flex-wrap items-center justify-between gap-4 p-4">
              <div>
                <p className="font-pixel text-[0.55rem] text-emerald">{current.tag}</p>
                <p className="font-pixel mt-2 text-sm">{current.title}</p>
                <p className="mt-2 text-sm text-muted-foreground">{current.desc}</p>
              </div>
              <div className="flex items-center gap-2">
                <McButton size="icon" aria-label="Предыдущий" onClick={() => step(-1)}>
                  <ChevronLeft className="h-5 w-5" />
                </McButton>
                <span className="font-pixel w-14 text-center text-[0.55rem] text-muted-foreground">
                  {(openIdx ?? 0) + 1}/{list.length}
                </span>
                <McButton size="icon" aria-label="Следующий" onClick={() => step(1)}>
                  <ChevronRight className="h-5 w-5" />
                </McButton>
              </div>
            </figcaption>
          </figure>
        )}
      </Modal>
    </section>
  );
}
