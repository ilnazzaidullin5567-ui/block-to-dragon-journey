/**
 * Hand-drawn pixel-art sprites. Each sprite is a grid of characters mapped to a palette;
 * "." is transparent. Palette hex values are artwork data (textures), not UI theme colors.
 */
export type Sprite = { rows: string[]; palette: Record<string, string> };

const OUT = "#1b1b1b";

export const heart: Sprite = {
  rows: [".KK.KK.", "KRRKRWK", "KRRRRRK", "KRRRRRK", ".KRRRK.", "..KRK..", "...K..."],
  palette: { K: OUT, R: "#e62e2e", W: "#ffd3d3" },
};
export const heartEmpty: Sprite = {
  rows: heart.rows,
  palette: { K: OUT, R: "#3a2a2e", W: "#4a3a3e" },
};
export const heartHardcore: Sprite = {
  rows: ["KKK.KKK", "KRRKRWK", "KRDRRRK", "KRRRRRK", ".KRRDK.", "..KRK..", "...K..."],
  palette: { K: "#f0f0f0", R: "#8f0d0d", D: "#3a0000", W: "#ff7a7a" },
};

export const hunger: Sprite = {
  rows: ["......BB", ".....BWB", "....BWB.", ".KKKB...", "KMSMMK..", "KSMMMK..", "KMMMK...", ".KKK...."],
  palette: { B: "#e8dcc0", W: "#ffffff", K: "#3b2410", M: "#b5651d", S: "#e09040" },
};
export const hungerEmpty: Sprite = {
  rows: hunger.rows,
  palette: { B: "#5a5550", W: "#6a6560", K: "#2a2420", M: "#3e3530", S: "#4a4038" },
};

export const grassBlock: Sprite = {
  rows: ["GgGGGgGG", "GGgGgGGg", "gGDgGDgG", "DDdDDDdD", "DdDDDdDD", "DDDdDDDd", "dDDDdDDD", "DDdDDDDd"],
  palette: { G: "#5d9c3b", g: "#467a2b", D: "#86603d", d: "#5e4127" },
};
export const grassTop: Sprite = {
  rows: ["GgGGGgGG", "GGgGgGGg", "gGGGGGgG", "GGgGGgGG", "GGGGgGGG", "gGGgGGGg", "GGGGGgGG", "GgGGGGGg"],
  palette: { G: "#5d9c3b", g: "#467a2b" },
};
export const dirt: Sprite = {
  rows: ["DDdDDDdD", "DdDDDdDD", "DDDdDDDd", "dDDDdDDD", "DDdDDDDd", "DDDDdDDD", "dDDdDDdD", "DDDDDDDD"],
  palette: { D: "#86603d", d: "#5e4127" },
};
export const diamondOre: Sprite = {
  rows: ["SSsSSSsS", "SDdSSsSS", "SdDSsSDS", "sSSSSSdS", "SSsSDSSs", "SSSDdSsS", "sSSSsSSS", "SDSSSSdS"],
  palette: { S: "#7d7d7d", s: "#5f5f5f", D: "#5decf5", d: "#1aa3a8" },
};
export const stoneTex: Sprite = {
  rows: ["SSsSSSsS", "SsSSsSSS", "SSSsSSsS", "sSSSSSSS", "SSsSSsSs", "SSSSsSSS", "sSSsSSSS", "SSSSSSsS"],
  palette: { S: "#7d7d7d", s: "#5f5f5f" },
};

export const creeperFace: Sprite = {
  rows: ["GgGGgGGl", "GKKGGKKG", "GKKGgKKG", "lGGKKGGg", "GGKKKKGG", "GgKKKKGl", "GGKGGKGG", "lGGgGGgG"],
  palette: { G: "#4fae3a", g: "#3a8a2a", l: "#7ccf5f", K: "#111111" },
};

export const diamondSword: Sprite = {
  rows: [
    "..............KK",
    ".............KWK",
    "............KWDK",
    "...........KWDK.",
    "..........KWDK..",
    ".........KWDK...",
    "........KWDK....",
    ".......KWDK.....",
    "..KK..KWDK......",
    "..KDKKWDK.......",
    "...KDKDK........",
    "...KBKK.........",
    "..KBKDK.........",
    ".KBK.KK.........",
    "KCK.............",
    "KK..............",
  ],
  palette: { K: OUT, W: "#d4fffb", D: "#33ebcb", B: "#6b4a2b", C: "#2ccdb5" },
};
export const goldSword: Sprite = {
  rows: diamondSword.rows,
  palette: { K: OUT, W: "#fffbd0", D: "#ffd23f", B: "#6b4a2b", C: "#ffaa00" },
};

export const diamondPickaxe: Sprite = {
  rows: [
    "....KKKKKK......",
    "..KKWDDDDDKK....",
    ".KWDKKKKKDDDK...",
    "..KK....KBKDDK..",
    "........KBK.KDK.",
    ".......KBK..KDK.",
    "......KBK....KDK",
    ".....KBK.....KK.",
    "....KBK.........",
    "...KBK..........",
    "..KBK...........",
    ".KBK............",
    "KBK.............",
    "KK..............",
  ],
  palette: { K: OUT, W: "#d4fffb", D: "#33ebcb", B: "#7a5532" },
};

export const diamond: Sprite = {
  rows: ["..KKKK..", ".KWWDDK.", "KWWDDDDK", "KDWDDDBK", ".KDDDBK.", "..KDBK..", "...KK..."],
  palette: { K: "#0e3f3d", W: "#d4fffb", D: "#33ebcb", B: "#1aa3a8" },
};
export const stick: Sprite = {
  rows: ["......KK", ".....KBK", "....KBK.", "...KBK..", "..KBK...", ".KBK....", "KBK.....", "KK......"],
  palette: { K: "#3b2410", B: "#8a5e34" },
};
export const goldIngot: Sprite = {
  rows: ["........", "..KKKKKK", ".KWYYYYK", "KYYYYYOK", "KOOOOOK.", ".KKKKK..", "........"],
  palette: { K: "#5a3a00", W: "#fffbd0", Y: "#ffd23f", O: "#d68f00" },
};
export const gunpowder: Sprite = {
  rows: ["........", "...g.G..", "..GgGgG.", ".gGsGgGg", ".GgGgsG.", "gGsGgGg.", ".gGgGg..", "........"],
  palette: { g: "#3e3e3e", G: "#6e6e6e", s: "#a8a8a8" },
};
export const sand: Sprite = {
  rows: ["YYyYYYyY", "YyYYYYYy", "YYYyYyYY", "yYYYYYYY", "YYyYYyYy", "YYYYyYYY", "yYYyYYYY", "YYYYYYyY"],
  palette: { Y: "#e3d6a0", y: "#cbbd85" },
};
export const glass: Sprite = {
  rows: ["WWWWWWWW", "W......W", "W.w....W", "W..w...W", "W......W", "W....w.W", "W......W", "WWWWWWWW"],
  palette: { W: "#dff4ff", w: "#ffffff" },
};
export const obsidian: Sprite = {
  rows: ["OoOOPOoO", "oOOoOOOP", "OOPOOoOO", "OoOOOOPo", "POOoOOOO", "OOOOPoOo", "oOPOOOOO", "OOOoOOPO"],
  palette: { O: "#14101e", o: "#231a35", P: "#4b2f7a" },
};
export const netherStar: Sprite = {
  rows: ["....K....", "...KWK...", "K..KWK..K", ".KKWWWKK.", "..KWYWK..", ".KKWWWKK.", "K..KWK..K", "...KWK...", "....K...."],
  palette: { K: "#8f8fb0", W: "#ffffff", Y: "#fff6a8" },
};
export const tnt: Sprite = {
  rows: ["RRrRRrRR", "rRRRRRrR", "WWWWWWWW", "WKWKKWKW", "WKWKWWKW", "WWWWWWWW", "RrRRrRRR", "RRRrRRrR"],
  palette: { R: "#d8352a", r: "#9c2018", W: "#efefef", K: "#2b2b2b" },
};
export const beacon: Sprite = {
  rows: ["GGGGGGGG", "G.wwww.G", "G.wCCw.G", "G.wCCw.G", "G.wwww.G", "GOOOOOOG", "OoOPOoOO", "OOOOOOOO"],
  palette: { G: "#c8f4ff", w: "#e9fbff", C: "#6ff7ff", O: "#14101e", o: "#231a35", P: "#4b2f7a" },
};
export const compass: Sprite = {
  rows: ["..KKKK..", ".KSSSSK.", "KSSSRSSK", "KSSRRSSK", "KSSWSSSK", "KSWSSSSK", ".KSSSSK.", "..KKKK.."],
  palette: { K: "#3a3a3a", S: "#b9b9b9", R: "#e62e2e", W: "#f2f2f2" },
};
export const enderEye: Sprite = {
  rows: ["..KKKK..", ".KGGGGK.", "KGgYYgGK", "KGYKKYGK", "KGYKKYGK", "KGgYYgGK", ".KGGGGK.", "..KKKK.."],
  palette: { K: "#0b2a22", G: "#1d7d64", g: "#2ccdb5", Y: "#b6ff8a" },
};

/** Procedural music disc: concentric pixel rings with a coloured label. */
export function musicDisc(label: string, accent: string): Sprite {
  const size = 16;
  const rows: string[] = [];
  const c = 7.5;
  for (let y = 0; y < size; y++) {
    let row = "";
    for (let x = 0; x < size; x++) {
      const d = Math.hypot(x - c, y - c);
      if (d > 7.6) row += ".";
      else if (d > 6.8) row += "K";
      else if (d > 3.2) row += (Math.round(d * 2) % 3 === 0 ? "g" : "D");
      else if (d > 1.1) row += (x + y) % 5 === 0 ? "a" : "L";
      else row += "H";
    }
    rows.push(row);
  }
  // highlight glint
  const glintRows = rows.map((r, y) =>
    r
      .split("")
      .map((ch, x) => (ch === "D" && x - y === -6 ? "w" : ch))
      .join(""),
  );
  return {
    rows: glintRows,
    palette: { K: "#0a0a0a", D: "#1c1c1c", g: "#2c2c2c", L: label, a: accent, H: "#050505", w: "#5a5a5a" },
  };
}

/** Ordered crack pixels for a 8x8 block-breaking overlay (10 stages in-game, 5 here). */
export const crackPixels: [number, number][] = [
  [3, 3], [4, 4], [4, 3], [3, 4], [5, 5], [2, 2], [5, 3], [2, 5], [6, 6], [1, 1],
  [6, 2], [1, 6], [4, 6], [6, 4], [3, 1], [1, 3], [7, 7], [0, 0], [5, 1], [0, 5],
  [7, 3], [2, 7], [6, 0], [0, 6],
];
