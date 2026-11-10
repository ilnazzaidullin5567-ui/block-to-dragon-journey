import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { PixelArt } from "@/components/mc/PixelArt";
import { McButton } from "@/components/mc/McButton";
import { Reveal, SectionHeading } from "@/components/mc/Reveal";
import { musicDisc } from "@/lib/sprites";
import { playTrack, readLevels, stopTrack, type TrackId } from "@/lib/audio";
import { cn } from "@/lib/utils";

const TRACKS: { id: TrackId; title: string; artist: string; year: string; mood: string; disc: ReturnType<typeof musicDisc>; accent: string }[] = [
  { id: "sweden", title: "Sweden", artist: "C418", year: "Volume Alpha · 2011", mood: "Тихий рассвет над первым домом", disc: musicDisc("#5d9c3b", "#9be27a"), accent: "var(--emerald)" },
  { id: "pigstep", title: "Pigstep", artist: "Lena Raine", year: "Nether Update · 2020", mood: "Грув бастиона пиглинов", disc: musicDisc("#e64a19", "#ffb36b"), accent: "var(--lava)" },
  { id: "otherside", title: "Otherside", artist: "Lena Raine", year: "Caves & Cliffs · 2021", mood: "Полёт над пещерами и скалами", disc: musicDisc("#2ccdb5", "#bff7ee"), accent: "var(--diamond)" },
];

const BARS = 32;

export function Jukebox() {
  const [trackId, setTrackId] = useState<TrackId>("sweden");
  const [playing, setPlaying] = useState(false);
  const barsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const track = TRACKS.find((t) => t.id === trackId)!;

  useEffect(() => {
    const data = new Uint8Array(512);
    // Log-spaced bins from ~90 Hz to ~6 kHz so every bar moves.
    const bins = Array.from({ length: BARS }, (_, i) => Math.round(2 * Math.pow(64, i / (BARS - 1))));
    let raf = 0;
    const raw = new Float32Array(BARS);
    const tick = (t: number) => {
      const active = readLevels(data);
      for (let i = 0; i < BARS; i++) {
        if (!active) {
          raw[i] = 0.08 + Math.abs(Math.sin(t / 900 + i * 0.5)) * 0.08;
          continue;
        }
        // Peak across this bar's frequency band, boosted toward the treble.
        const from = bins[i] ?? 2;
        const to = Math.max(from + 1, bins[i + 1] ?? from + 1);
        let peak = 0;
        for (let k = from; k < to; k++) peak = Math.max(peak, data[k] ?? 0);
        raw[i] = Math.min(1, (peak / 255) * (1.1 + i / BARS));
      }
      barsRef.current.forEach((el, i) => {
        if (!el) return;
        const v = active
          ? 0.25 * (raw[i - 1] ?? 0) + 0.5 * (raw[i] ?? 0) + 0.25 * (raw[i + 1] ?? 0) + Math.abs(Math.sin(t / 220 + i)) * 0.06
          : (raw[i] ?? 0);
        el.style.transform = `scaleY(${Math.max(0.05, Math.min(1, v))})`;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      stopTrack();
    };
  }, []);

  const toggle = () => {
    if (playing) {
      stopTrack();
      setPlaying(false);
    } else {
      playTrack(trackId);
      setPlaying(true);
    }
  };

  const pick = (id: TrackId) => {
    setTrackId(id);
    if (playing) playTrack(id);
  };

  return (
    <section id="music" className="relative overflow-hidden bg-obsidian py-24 sm:py-32">
      <div
        className="absolute top-1/2 left-1/4 h-[32rem] w-[32rem] -translate-y-1/2 blur-3xl transition-colors duration-700"
        style={{ background: `color-mix(in oklab, ${track.accent} 14%, transparent)` }}
      />
      <div className="relative mx-auto max-w-7xl px-4">
        <SectionHeading
          kicker="// Саундтрек и атмосфера"
          title="Музыкальный автомат"
          subtitle="Дань уважения C418 и Lena Raine — композиторам, чья музыка звучит в каждом закате кубического мира."
        />

        <div className="grid items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <div className="flex flex-col items-center">
              {/* Disc */}
              <div className="relative z-10 -mb-6 sm:-mb-8">
                <div
                  className={cn("animate-spin-disc drop-shadow-[0_10px_20px_oklch(0_0_0/0.6)]", !playing && "[animation-play-state:paused]")}
                >
                  <PixelArt sprite={track.disc} size={240} className="h-48 w-48 sm:h-60 sm:w-60" title={`Пластинка ${track.title}`} />
                </div>
              </div>
              {/* Jukebox block */}
              <div className="mc-panel relative w-full max-w-sm overflow-hidden border-4 border-obsidian">
                <div className="h-6 bg-wood-dark shadow-[inset_0_-4px_0_oklch(0_0_0/0.35)]" />
                <div className="grid grid-cols-[1fr_2fr_1fr] gap-0 bg-wood p-4">
                  <div className="h-full bg-wood-deep shadow-[inset_-3px_-3px_0_oklch(0_0_0/0.35)]" />
                  <div className="mx-3 flex h-36 items-end justify-center gap-[2px] bg-obsidian p-2 shadow-[inset_3px_3px_0_oklch(0_0_0/0.6)]">
                    {Array.from({ length: BARS }).map((_, i) => (
                      <span
                        key={i}
                        ref={(el) => {
                          barsRef.current[i] = el;
                        }}
                        className="h-full w-full origin-bottom transition-transform duration-75"
                        style={{
                          background: `linear-gradient(to top, ${track.accent}, color-mix(in oklab, ${track.accent} 40%, white))`,
                          transform: "scaleY(0.1)",
                        }}
                      />
                    ))}
                  </div>
                  <div className="h-full bg-wood-deep shadow-[inset_-3px_-3px_0_oklch(0_0_0/0.35)]" />
                </div>
                <div className="h-6 bg-wood-dark shadow-[inset_0_4px_0_oklch(1_0_0/0.08)]" />
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="mc-panel p-6 sm:p-8">
              <p className="font-pixel text-[0.55rem] uppercase text-muted-foreground">Сейчас играет</p>
              <h3 className="font-pixel text-shadow-pixel mt-3 text-xl sm:text-2xl" style={{ color: track.accent }}>
                {track.title}
              </h3>
              <p className="mt-2 font-mono text-sm text-foreground/85">
                {track.artist} · {track.year}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{track.mood}</p>

              <div className="mt-6">
                <McButton variant={playing ? "lava" : "emerald"} size="lg" onClick={toggle} className="w-full sm:w-auto">
                  {playing ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current" />}
                  {playing ? "Остановить" : "Поставить пластинку"}
                </McButton>
              </div>

              <ul className="mt-8 space-y-2">
                {TRACKS.map((t) => {
                  const active = t.id === trackId;
                  return (
                    <li key={t.id}>
                      <button
                        onClick={() => pick(t.id)}
                        aria-pressed={active}
                        className={cn(
                          "flex w-full items-center gap-4 border-2 p-3 text-left transition-colors",
                          active ? "border-foreground bg-obsidian-3" : "border-transparent bg-obsidian/60 hover:bg-obsidian-3",
                        )}
                      >
                        <span className={cn(active && playing && "animate-spin-disc")}>
                          <PixelArt sprite={t.disc} size={36} />
                        </span>
                        <span className="flex-1">
                          <span className="block font-pixel text-[0.6rem]" style={active ? { color: t.accent } : undefined}>
                            Пластинка · {t.title}
                          </span>
                          <span className="mt-1 block font-mono text-xs text-muted-foreground">
                            {t.artist} — {t.year}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
              <p className="mt-6 font-mono text-[0.7rem] leading-relaxed text-muted-foreground">
                Звучат синтезированные мелодии-посвящения в духе оригиналов, а не сами записи. Оригинальный саундтрек
                ищи на стримингах.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
