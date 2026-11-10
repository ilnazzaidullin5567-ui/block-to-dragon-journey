import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          el.classList.add("is-visible");
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={cn("reveal", className)} style={{ ["--reveal-delay" as string]: `${delay}ms` }}>
      {children}
    </div>
  );
}

export function SectionHeading({
  kicker,
  title,
  subtitle,
  className,
}: {
  kicker: string;
  title: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <Reveal className={cn("mx-auto mb-12 max-w-3xl text-center", className)}>
      <p className="font-pixel mb-4 text-[0.6rem] uppercase tracking-widest text-emerald">{kicker}</p>
      <h2 className="font-pixel text-shadow-pixel text-xl leading-relaxed text-foreground sm:text-2xl lg:text-3xl">
        {title}
      </h2>
      {subtitle && <p className="mt-5 text-base text-muted-foreground sm:text-lg">{subtitle}</p>}
    </Reveal>
  );
}
