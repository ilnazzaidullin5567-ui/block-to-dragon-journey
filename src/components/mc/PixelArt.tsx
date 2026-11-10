import { memo, useMemo } from "react";
import type { Sprite } from "@/lib/sprites";
import { cn } from "@/lib/utils";

type Props = {
  sprite: Sprite;
  size?: number | string;
  className?: string;
  title?: string;
};

/** Renders a sprite grid as a crisp SVG; horizontal runs are merged for fewer nodes. */
export const PixelArt = memo(function PixelArt({ sprite, size = 32, className, title }: Props) {
  const { rects, w, h } = useMemo(() => {
    const w = Math.max(...sprite.rows.map((r) => r.length));
    const h = sprite.rows.length;
    const rects: { x: number; y: number; len: number; fill: string }[] = [];
    sprite.rows.forEach((row, y) => {
      let x = 0;
      while (x < row.length) {
        const ch = row.charAt(x);
        if (ch === ".") {
          x++;
          continue;
        }
        let len = 1;
        while (row[x + len] === ch) len++;
        const fill = sprite.palette[ch];
        if (fill) rects.push({ x, y, len, fill });
        x += len;
      }
    });
    return { rects, w, h };
  }, [sprite]);

  const dim = Math.max(w, h);
  return (
    <svg
      viewBox={`0 0 ${dim} ${dim}`}
      width={size}
      height={size}
      shapeRendering="crispEdges"
      className={cn("pixel shrink-0", className)}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <g transform={`translate(${(dim - w) / 2} ${(dim - h) / 2})`}>
        {rects.map((r, i) => (
          <rect key={i} x={r.x} y={r.y} width={r.len} height={1} fill={r.fill} />
        ))}
      </g>
    </svg>
  );
});
