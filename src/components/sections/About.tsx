import { PixelArt } from "@/components/mc/PixelArt";
import { Reveal, SectionHeading } from "@/components/mc/Reveal";
import { diamond, grassBlock, creeperFace, diamondPickaxe, type Sprite } from "@/lib/sprites";

const STATS: { value: string; label: string; icon: Sprite }[] = [
  { value: "300 млн+", label: "проданных копий — самая продаваемая игра в истории", icon: diamond },
  { value: "60 млн", label: "блоков от края до края мира по каждой оси", icon: grassBlock },
  { value: "2009", label: "год, когда был поставлен первый блок", icon: diamondPickaxe },
  { value: "∞", label: "сгенерированных миров — ни один не повторяется", icon: creeperFace },
];

export function About() {
  return (
    <section id="about" className="relative bg-obsidian py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading
          kicker="// О мире"
          title="Один блок. Бесконечность вариантов."
          subtitle="Minecraft — это мир, собранный из кубов: добывай ресурсы, крафти инструменты, переживи ночь и строй всё, что можешь представить. Здесь нет сценария — историю пишешь ты."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal key={s.value} delay={i * 90}>
              <div className="mc-panel pixel-corners group h-full p-6 transition-transform duration-200 hover:-translate-y-1">
                <div className="mc-slot mb-5 grid h-16 w-16 place-items-center transition-transform group-hover:scale-110">
                  <PixelArt sprite={s.icon} size={38} />
                </div>
                <p className="font-pixel text-shadow-pixel text-xl text-emerald sm:text-2xl">{s.value}</p>
                <p className="mt-3 text-sm text-muted-foreground">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
