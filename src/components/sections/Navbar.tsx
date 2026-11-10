import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { PixelArt } from "@/components/mc/PixelArt";
import { McLink } from "@/components/mc/McButton";
import { compass, diamondPickaxe, grassBlock, enderEye, diamondSword, type Sprite } from "@/lib/sprites";
import { cn } from "@/lib/utils";

const LINKS: { id: string; label: string; icon: Sprite }[] = [
  { id: "about", label: "О мире", icon: grassBlock },
  { id: "dimensions", label: "Измерения", icon: enderEye },
  { id: "modes", label: "Режимы", icon: diamondSword },
  { id: "crafting", label: "Крафт", icon: diamondPickaxe },
  { id: "gallery", label: "Галерея", icon: compass },
];

export function Navbar() {
  const [active, setActive] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [online, setOnline] = useState(124850);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id));
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    LINKS.forEach((l) => {
      const el = document.getElementById(l.id);
      if (el) io.observe(el);
    });
    const t = setInterval(() => setOnline((n) => n + Math.round((Math.random() - 0.45) * 40)), 2200);
    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
      clearInterval(t);
    };
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "bg-obsidian/90 py-2 backdrop-blur-md shadow-[0_4px_0_0_oklch(0_0_0/0.5)]" : "py-4",
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4">
        <a href="#top" className="group flex items-center gap-3" aria-label="Бесконечные Миры — наверх">
          <span className="mc-slot grid h-11 w-11 place-items-center transition-transform group-hover:-rotate-6">
            <PixelArt sprite={grassBlock} size={28} />
          </span>
          <span className="font-pixel text-shadow-pixel hidden text-[0.65rem] leading-tight sm:block">
            <span className="text-emerald">БЕСКОНЕЧНЫЕ</span>
            <br />
            МИРЫ
          </span>
        </a>

        {/* Hotbar */}
        <nav aria-label="Разделы" className="mc-panel hidden items-stretch gap-1 p-1 lg:flex">
          {LINKS.map((l, i) => {
            const isActive = active === l.id;
            return (
              <a
                key={l.id}
                href={`#${l.id}`}
                className={cn(
                  "relative flex items-center gap-2 border-2 px-3 py-2 font-pixel text-[0.55rem] uppercase transition-colors",
                  isActive
                    ? "border-foreground bg-obsidian-3 text-mc-yellow shadow-[0_0_0_2px_oklch(0_0_0)]"
                    : "border-transparent text-muted-foreground hover:bg-obsidian-3 hover:text-emerald",
                )}
              >
                <span className="absolute top-0.5 left-1 font-pixel text-[0.4rem] text-muted-foreground/70">{i + 1}</span>
                <PixelArt sprite={l.icon} size={18} />
                {l.label}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="mc-slot hidden items-center gap-2 px-3 py-2 md:flex" aria-live="polite">
            <span className="h-2.5 w-2.5 animate-blink bg-emerald shadow-[var(--glow-emerald)]" />
            <span className="font-mono text-xs text-muted-foreground">
              Онлайн: <span className="font-bold text-emerald">{online.toLocaleString("en-US")}</span> игроков
            </span>
          </div>
          <McLink
            href="https://www.minecraft.net/ru-ru"
            target="_blank"
            rel="noreferrer"
            variant="emerald"
            size="sm"
            className="whitespace-nowrap"
          >
            Играть сейчас
          </McLink>
          <button
            type="button"
            className="mc-btn h-10 w-10 bg-stone lg:hidden"
            aria-label={open ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav aria-label="Мобильное меню" className="mc-panel mx-4 mt-3 grid gap-1 p-2 lg:hidden animate-in slide-in-from-top-2 fade-in">
          {LINKS.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 border-2 px-3 py-3 font-pixel text-[0.65rem] uppercase",
                active === l.id ? "border-foreground text-mc-yellow" : "border-transparent text-foreground",
              )}
            >
              <PixelArt sprite={l.icon} size={20} />
              {l.label}
            </a>
          ))}
          <div className="mt-2 flex items-center gap-2 px-3 py-2 font-mono text-xs text-muted-foreground">
            <span className="h-2.5 w-2.5 animate-blink bg-emerald" />
            Онлайн: <span className="font-bold text-emerald">{online.toLocaleString("en-US")}</span> игроков
          </div>
        </nav>
      )}
    </header>
  );
}
