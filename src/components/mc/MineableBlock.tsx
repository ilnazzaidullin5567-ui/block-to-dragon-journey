import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { PixelArt } from "./PixelArt";
import {
  crackPixels,
  diamond,
  diamondOre,
  dirt,
  grassBlock,
  grassTop,
  obsidian,
  tnt,
  gunpowder,
  type Sprite,
} from "@/lib/sprites";
import { sfx } from "@/lib/audio";

type BlockDef = { name: string; top: Sprite; side: Sprite; bottom: Sprite; drop: Sprite; dropName: string; colors: string[]; time: number };

const BLOCKS: BlockDef[] = [
  { name: "Блок травы", top: grassTop, side: grassBlock, bottom: dirt, drop: grassBlock, dropName: "Земля", colors: ["#5d9c3b", "#467a2b", "#86603d", "#5e4127"], time: 900 },
  { name: "Алмазная руда", top: diamondOre, side: diamondOre, bottom: diamondOre, drop: diamond, dropName: "Алмаз", colors: ["#7d7d7d", "#5f5f5f", "#5decf5", "#1aa3a8"], time: 1500 },
  { name: "Динамит", top: tnt, side: tnt, bottom: tnt, drop: gunpowder, dropName: "Порох", colors: ["#d8352a", "#efefef", "#2b2b2b", "#ff4500"], time: 700 },
  { name: "Обсидиан", top: obsidian, side: obsidian, bottom: obsidian, drop: obsidian, dropName: "Обсидиан", colors: ["#14101e", "#231a35", "#4b2f7a", "#9b30ff"], time: 2200 },
];

type Particle = { id: number; dx: number; dy: number; color: string; size: number; delay: number };

function Cracks({ stage }: { stage: number }) {
  const count = Math.floor(stage * crackPixels.length);
  if (count <= 0) return null;
  return (
    <svg viewBox="0 0 8 8" className="pixel pointer-events-none absolute inset-0 h-full w-full" shapeRendering="crispEdges" aria-hidden>
      {crackPixels.slice(0, count).map(([x, y], i) => (
        <rect key={i} x={x} y={y} width={1} height={1} fill="#000" opacity={0.6} />
      ))}
    </svg>
  );
}

export function MineableBlock() {
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [broken, setBroken] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [tilt, setTilt] = useState({ x: -22, y: 35 });
  const [mined, setMined] = useState<Record<string, number>>({});
  const [lastDrop, setLastDrop] = useState<{ key: number; name: string; sprite: Sprite } | null>(null);
  const mining = useRef(false);
  const raf = useRef<number>(0);
  const lastTick = useRef(0);
  const lastDig = useRef(0);
  const block = BLOCKS[index];

  const breakIt = useCallback(() => {
    const b = BLOCKS[index];
    sfx.breakBlock();
    if (b.name === "Динамит") sfx.boom();
    setBroken(true);
    setParticles(
      Array.from({ length: 34 }, (_, i) => {
        const ang = Math.random() * Math.PI * 2;
        const dist = 70 + Math.random() * 130;
        return {
          id: Date.now() + i,
          dx: Math.cos(ang) * dist,
          dy: Math.sin(ang) * dist - 40,
          color: b.colors[i % b.colors.length],
          size: 6 + Math.round(Math.random() * 8),
          delay: Math.random() * 80,
        };
      }),
    );
    setMined((m) => ({ ...m, [b.dropName]: (m[b.dropName] ?? 0) + 1 }));
    setLastDrop({ key: Date.now(), name: b.dropName, sprite: b.drop });
    setTimeout(() => sfx.xp(), 250);
    setTimeout(() => {
      setBroken(false);
      setProgress(0);
      setParticles([]);
      setIndex((i) => (i + 1) % BLOCKS.length);
    }, 1100);
  }, [index]);

  useEffect(() => {
    const loop = (t: number) => {
      const dt = lastTick.current ? t - lastTick.current : 16;
      lastTick.current = t;
      if (mining.current && !broken) {
        if (t - lastDig.current > 230) {
          sfx.dig();
          lastDig.current = t;
        }
        setProgress((p) => {
          const next = p + dt / BLOCKS[index].time;
          return next >= 1 ? 1 : next;
        });
      }
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
  }, [broken, index]);

  useEffect(() => {
    if (progress >= 1 && !broken) breakIt();
  }, [progress, broken, breakIt]);

  const start = () => {
    mining.current = true;
  };
  const stop = () => {
    mining.current = false;
    if (!broken) setProgress(0);
  };

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ x: -22 - py * 30, y: 35 + px * 50 });
  };

  const shake = progress > 0 && !broken ? Math.sin(progress * 120) * 2 : 0;
  const faceStyle = (transform: string): CSSProperties => ({
    transform,
    position: "absolute",
    inset: 0,
    backfaceVisibility: "hidden",
  });

  return (
    <div className="flex flex-col items-center gap-6">
      <div
        className="relative grid h-72 w-72 cursor-crosshair touch-none place-items-center select-none sm:h-80 sm:w-80"
        style={{ perspective: "900px" }}
        onPointerEnter={start}
        onPointerDown={start}
        onPointerLeave={(e) => {
          stop();
          if (e.pointerType === "mouse") setTilt({ x: -22, y: 35 });
        }}
        onPointerUp={(e) => e.pointerType !== "mouse" && stop()}
        onPointerMove={onMove}
        role="img"
        aria-label={`${block.name}: наведи курсор, чтобы добыть`}
      >
        {/* glow */}
        <div className="absolute inset-10 bg-emerald/20 blur-3xl" />
        <div
          className="relative h-36 w-36 transition-[opacity,transform] duration-200 sm:h-40 sm:w-40"
          style={{
            transformStyle: "preserve-3d",
            transform: `translateX(${shake}px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${broken ? 0 : 1 - progress * 0.06})`,
            opacity: broken ? 0 : 1,
          }}
        >
          {(
            [
              ["rotateY(0deg) translateZ(calc(var(--s)/2))", block.side, 1],
              ["rotateY(90deg) translateZ(calc(var(--s)/2))", block.side, 0.78],
              ["rotateY(180deg) translateZ(calc(var(--s)/2))", block.side, 0.7],
              ["rotateY(-90deg) translateZ(calc(var(--s)/2))", block.side, 0.85],
              ["rotateX(90deg) translateZ(calc(var(--s)/2))", block.top, 1.15],
              ["rotateX(-90deg) translateZ(calc(var(--s)/2))", block.bottom, 0.5],
            ] as const
          ).map(([t, sprite, light], i) => (
            <div key={i} style={{ ...faceStyle(t), filter: `brightness(${light})` }} className="[--s:9rem] sm:[--s:10rem]">
              <PixelArt sprite={sprite} size="100%" />
              <Cracks stage={progress} />
              <div className="absolute inset-0 border-2 border-obsidian/40" />
            </div>
          ))}
        </div>

        {particles.map((p) => (
          <span
            key={p.id}
            className="pointer-events-none absolute top-1/2 left-1/2"
            style={
              {
                width: p.size,
                height: p.size,
                background: p.color,
                boxShadow: "inset -2px -2px 0 rgb(0 0 0 / 0.35)",
                "--dx": `${p.dx}px`,
                "--dy": `${p.dy}px`,
                animation: `particle-burst 900ms cubic-bezier(0.1,0.6,0.3,1) ${p.delay}ms forwards`,
              } as CSSProperties
            }
          />
        ))}

        {lastDrop && broken && (
          <div key={lastDrop.key} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pop-in">
            <div className="animate-bob flex flex-col items-center gap-2">
              <PixelArt sprite={lastDrop.sprite} size={48} />
              <span className="font-pixel text-shadow-pixel text-[0.6rem] text-mc-yellow">+1 {lastDrop.name}</span>
            </div>
          </div>
        )}
      </div>

      {/* Progress + inventory */}
      <div className="w-full max-w-xs">
        <div className="mb-2 flex items-center justify-between font-pixel text-[0.55rem] uppercase">
          <span className="text-foreground">{block.name}</span>
          <span className="text-emerald">{Math.round(progress * 100)}%</span>
        </div>
        <div className="mc-slot h-3 p-0.5">
          <div className="h-full bg-emerald shadow-[var(--glow-emerald)]" style={{ width: `${progress * 100}%` }} />
        </div>
        <p className="mt-3 text-center font-mono text-xs text-muted-foreground">
          Наведи курсор (или зажми пальцем), чтобы добыть блок
        </p>
        {Object.keys(mined).length > 0 && (
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {BLOCKS.filter((b) => mined[b.dropName]).map((b) => (
              <div key={b.dropName} className="mc-slot relative grid h-11 w-11 place-items-center" title={b.dropName}>
                <PixelArt sprite={b.drop} size={26} />
                <span className="font-pixel text-shadow-pixel absolute right-0.5 bottom-0 text-[0.5rem]">{mined[b.dropName]}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
