import { useEffect, useState } from "react";
import { PixelArt } from "@/components/mc/PixelArt";
import { McButton } from "@/components/mc/McButton";
import { Reveal, SectionHeading } from "@/components/mc/Reveal";
import {
  beacon,
  diamond,
  diamondPickaxe,
  glass,
  goldIngot,
  goldSword,
  gunpowder,
  netherStar,
  obsidian,
  sand,
  stick,
  tnt,
  type Sprite,
} from "@/lib/sprites";
import { sfx } from "@/lib/audio";
import { cn } from "@/lib/utils";

type Item = { name: string; sprite: Sprite };
const I = {
  D: { name: "Алмаз", sprite: diamond },
  S: { name: "Палка", sprite: stick },
  G: { name: "Золотой слиток", sprite: goldIngot },
  P: { name: "Порох", sprite: gunpowder },
  A: { name: "Песок", sprite: sand },
  L: { name: "Стекло", sprite: glass },
  N: { name: "Звезда Незера", sprite: netherStar },
  O: { name: "Обсидиан", sprite: obsidian },
} satisfies Record<string, Item>;
type Key = keyof typeof I;

type TooltipLine = { text: string; tone: "gray" | "blue" | "green" | "red" | "yellow" | "pink" };
type Recipe = {
  id: string;
  name: string;
  grid: (Key | null)[];
  result: Sprite;
  enchanted: boolean;
  nameTone: "aqua" | "white" | "yellow";
  lines: TooltipLine[];
};

const RECIPES: Recipe[] = [
  {
    id: "pickaxe",
    name: "Алмазная кирка",
    grid: ["D", "D", "D", null, "S", null, null, "S", null],
    result: diamondPickaxe,
    enchanted: true,
    nameTone: "aqua",
    lines: [
      { text: "Эффективность V", tone: "gray" },
      { text: "Удача III", tone: "gray" },
      { text: "Неразрушимость III", tone: "gray" },
      { text: "Починка", tone: "gray" },
      { text: "", tone: "gray" },
      { text: "В ведущей руке:", tone: "gray" },
      { text: " +5 Урон атаки", tone: "green" },
      { text: " 1.2 Скорость атаки", tone: "green" },
    ],
  },
  {
    id: "sword",
    name: "Зачарованный золотой меч",
    grid: [null, "G", null, null, "G", null, null, "S", null],
    result: goldSword,
    enchanted: true,
    nameTone: "aqua",
    lines: [
      { text: "Острота V", tone: "gray" },
      { text: "Заговор огня II", tone: "gray" },
      { text: "Добыча III", tone: "gray" },
      { text: "Неразрушимость III", tone: "gray" },
      { text: "", tone: "gray" },
      { text: "В ведущей руке:", tone: "gray" },
      { text: " +7 Урон", tone: "green" },
      { text: " 1.6 Скорость атаки", tone: "green" },
    ],
  },
  {
    id: "tnt",
    name: "Динамит TNT",
    grid: ["P", "A", "P", "A", "P", "A", "P", "A", "P"],
    result: tnt,
    enchanted: false,
    nameTone: "white",
    lines: [
      { text: "Сила взрыва: 4", tone: "red" },
      { text: "Фитиль: 4 секунды", tone: "gray" },
      { text: "Поджигается кремнём и огнивом", tone: "gray" },
      { text: "", tone: "gray" },
      { text: "Осторожно: шипит не только крипер", tone: "pink" },
    ],
  },
  {
    id: "beacon",
    name: "Маяк",
    grid: ["L", "L", "L", "L", "N", "L", "O", "O", "O"],
    result: beacon,
    enchanted: true,
    nameTone: "aqua",
    lines: [
      { text: "Скорость II", tone: "blue" },
      { text: "Спешка II", tone: "blue" },
      { text: "Сила II", tone: "blue" },
      { text: "Регенерация", tone: "blue" },
      { text: "", tone: "gray" },
      { text: "Радиус действия: до 50 блоков", tone: "yellow" },
    ],
  },
];

const TONE = {
  gray: "text-mc-gray",
  blue: "text-mc-blue",
  green: "text-emerald",
  red: "text-redstone",
  yellow: "text-mc-yellow",
  pink: "text-mc-pink",
  aqua: "text-mc-aqua",
  white: "text-foreground",
} as const;

export function Crafting() {
  const [recipeId, setRecipeId] = useState(RECIPES[0]!.id);
  const [ready, setReady] = useState(false);
  const [inventory, setInventory] = useState<Record<string, number>>({});
  const [toast, setToast] = useState<string | null>(null);
  const recipe = RECIPES.find((r) => r.id === recipeId)!;
  const filledCount = recipe.grid.filter(Boolean).length;

  useEffect(() => {
    setReady(false);
    const t = setTimeout(() => setReady(true), 120 * 9 + 150);
    return () => clearTimeout(t);
  }, [recipeId]);

  const take = () => {
    if (!ready) return;
    sfx.pop();
    setInventory((inv) => ({ ...inv, [recipe.id]: (inv[recipe.id] ?? 0) + 1 }));
    setToast(`${recipe.name} — в инвентаре!`);
    setTimeout(() => setToast(null), 1800);
  };

  return (
    <section id="crafting" className="relative overflow-hidden bg-obsidian py-24 sm:py-32">
      <div className="absolute -top-40 left-1/2 h-96 w-[60rem] -translate-x-1/2 bg-grass/15 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4">
        <SectionHeading
          kicker="// Интерактивный верстак"
          title="Скрафти легендарный предмет"
          subtitle="Выбери рецепт — ресурсы сами лягут в сетку 3×3. Нажми на готовый предмет, чтобы забрать его в инвентарь."
        />

        <div className="grid items-start gap-8 lg:grid-cols-[18rem_1fr]">
          {/* Recipe book */}
          <Reveal>
            <div className="mc-panel p-3">
              <p className="font-pixel mb-3 px-1 text-[0.55rem] uppercase text-muted-foreground">Книга рецептов</p>
              <div className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-2 lg:grid-cols-1">
                {RECIPES.map((r) => {
                  const active = r.id === recipeId;
                  return (
                    <button
                      key={r.id}
                      onClick={() => setRecipeId(r.id)}
                      aria-pressed={active}
                      className={cn(
                        "mc-btn justify-start gap-3 px-3 py-3 text-left text-[0.55rem] normal-case",
                        active ? "bg-grass-dark text-mc-yellow" : "bg-obsidian-3 text-foreground",
                      )}
                    >
                      <span className="mc-slot grid h-10 w-10 shrink-0 place-items-center">
                        <PixelArt sprite={r.result} size={26} />
                      </span>
                      <span className="min-w-0 leading-snug break-words">{r.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="grid items-start gap-8 xl:grid-cols-[1fr_20rem]">
              {/* Crafting window */}
              <div className="mc-window p-5 sm:p-7">
                <p className="font-pixel mb-5 text-[0.65rem] text-stone-dark">Верстак</p>
                <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center sm:gap-10">
                  <div className="grid grid-cols-3 gap-1">
                    {recipe.grid.map((k, i) => {
                      const item = k ? I[k] : null;
                      return (
                        <div
                          key={`${recipe.id}-${i}`}
                          className="mc-window-slot group relative grid h-16 w-16 place-items-center sm:h-20 sm:w-20"
                        >
                          {item && (
                            <>
                              <span className="animate-pop-in" style={{ animationDelay: `${i * 120}ms` }}>
                                <PixelArt sprite={item.sprite} size={40} title={item.name} />
                              </span>
                              <span className="mc-tooltip pointer-events-none absolute bottom-full left-1/2 z-10 mb-1 -translate-x-1/2 whitespace-nowrap px-2 py-1 text-xs text-foreground opacity-0 transition-opacity group-hover:opacity-100">
                                {item.name}
                              </span>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Arrow */}
                  <svg viewBox="0 0 11 8" className="pixel h-10 w-14 rotate-90 sm:rotate-0" shapeRendering="crispEdges" aria-hidden>
                    <path d="M0 3h7V1h1v1h1v1h1v1h1v1h-1v1h-1v1h-1v1h-1V5H0z" className={cn("transition-colors duration-300", ready ? "fill-grass-dark" : "fill-stone-dark")} />
                  </svg>

                  <button
                    onClick={take}
                    disabled={!ready}
                    aria-label={ready ? `Забрать: ${recipe.name}` : "Крафт в процессе"}
                    className={cn(
                      "mc-window-slot relative grid h-24 w-24 place-items-center transition-transform sm:h-28 sm:w-28",
                      ready && "cursor-pointer hover:scale-105 active:translate-y-1",
                    )}
                  >
                    {ready ? (
                      <span key={recipe.id} className={cn("animate-pop-in", recipe.enchanted && "enchant-glint")}>
                        <PixelArt sprite={recipe.result} size={64} />
                      </span>
                    ) : (
                      <span className="font-pixel text-[0.5rem] text-stone-dark">{filledCount}/9</span>
                    )}
                  </button>
                </div>

                {/* Inventory hotbar */}
                <div className="mt-8">
                  <p className="font-pixel mb-2 text-[0.55rem] text-stone-dark">Инвентарь</p>
                  <div className="grid grid-cols-9 gap-0.5 sm:gap-1">
                    {Array.from({ length: 9 }).map((_, i) => {
                      const id = Object.keys(inventory)[i];
                      const r = id ? RECIPES.find((x) => x.id === id) : null;
                      return (
                        <div key={i} className="mc-window-slot relative grid aspect-square place-items-center">
                          {r && (
                            <>
                              <PixelArt sprite={r.result} size="70%" title={r.name} />
                              <span className="font-pixel text-shadow-pixel absolute right-0.5 bottom-0 text-[0.5rem] text-foreground">
                                {inventory[r.id]}
                              </span>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <p className="mt-3 h-4 font-mono text-xs text-grass-dark" aria-live="polite">
                    {toast}
                  </p>
                </div>
              </div>

              {/* Tooltip */}
              <div className="flex flex-col gap-4">
                <div
                  key={recipe.id + String(ready)}
                  className={cn("mc-tooltip transition-opacity duration-300", ready ? "opacity-100 animate-in fade-in slide-in-from-bottom-2" : "opacity-40")}
                >
                  <p className={cn("text-base font-bold", TONE[recipe.nameTone])}>{recipe.name}</p>
                  {recipe.lines.map((l, i) =>
                    l.text ? (
                      <p key={i} className={cn("text-sm whitespace-pre", TONE[l.tone])}>
                        {l.text}
                      </p>
                    ) : (
                      <div key={i} className="h-3" />
                    ),
                  )}
                  <p className="mt-3 text-xs text-mc-gray/70">minecraft:{recipe.id}</p>
                </div>
                <McButton variant="emerald" onClick={take} disabled={!ready} className="disabled:opacity-50">
                  Забрать предмет
                </McButton>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
