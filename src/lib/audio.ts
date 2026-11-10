/**
 * Tiny Web Audio engine: synthesized jukebox loops (tribute variations, not the original
 * recordings) plus game-like sound effects. Browser-only; every entry point is called from
 * event handlers, so nothing runs during SSR.
 */
let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let analyser: AnalyserNode | null = null;

function getCtx() {
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.5;
    analyser = ctx.createAnalyser();
    analyser.fftSize = 1024;
    analyser.smoothingTimeConstant = 0.78;
    master.connect(analyser);
    analyser.connect(ctx.destination);
  }
  if (ctx.state === "suspended") void ctx.resume();
  return { ctx, master: master!, analyser: analyser! };
}

const mtof = (m: number) => 440 * Math.pow(2, (m - 69) / 12);

function tone(freq: number, at: number, dur: number, type: OscillatorType, vol: number, cutoff = 2400) {
  const { ctx, master } = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = cutoff;
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.exponentialRampToValueAtTime(vol, at + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + dur);
  osc.connect(filter).connect(gain).connect(master);
  osc.start(at);
  osc.stop(at + dur + 0.05);
}

function noise(at: number, dur: number, vol: number, type: BiquadFilterType, freq: number, q = 1) {
  const { ctx, master } = getCtx();
  const len = Math.max(1, Math.floor(ctx.sampleRate * dur));
  const buffer = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = type;
  filter.frequency.value = freq;
  filter.Q.value = q;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(vol, at);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + dur);
  src.connect(filter).connect(gain).connect(master);
  src.start(at);
}

export type TrackId = "sweden" | "pigstep" | "otherside";
type Pattern = { bpm: number; lead: (number | null)[]; bass: (number | null)[]; wave: OscillatorType; bassWave: OscillatorType; leadDur: number; cutoff: number; perc?: boolean };

const N = null;
const PATTERNS: Record<TrackId, Pattern> = {
  sweden: {
    bpm: 66,
    wave: "triangle",
    bassWave: "sine",
    leadDur: 1.6,
    cutoff: 1800,
    lead: [76, N, 74, N, 71, N, N, N, 72, N, 71, N, 67, N, N, N, 69, N, 71, N, 74, N, N, N, 72, N, 69, N, 67, N, N, N],
    bass: [48, N, N, N, 55, N, N, N, 45, N, N, N, 52, N, N, N, 41, N, N, N, 48, N, N, N, 43, N, N, N, 50, N, N, N],
  },
  pigstep: {
    bpm: 84,
    wave: "square",
    bassWave: "sawtooth",
    leadDur: 0.22,
    cutoff: 1400,
    perc: true,
    lead: [N, 67, N, 70, 72, N, 70, N, N, 67, N, 65, 67, N, N, N, N, 67, N, 70, 72, N, 75, N, 74, N, 72, N, 70, N, N, N],
    bass: [43, N, 43, 46, N, 43, N, 41, 43, N, 43, 46, N, 48, 46, N, 39, N, 39, 43, N, 39, N, 41, 43, N, 43, 46, N, 48, 46, N],
  },
  otherside: {
    bpm: 96,
    wave: "triangle",
    bassWave: "sine",
    leadDur: 0.35,
    cutoff: 3200,
    perc: true,
    lead: [69, 72, 76, 72, 69, 72, 76, 79, 67, 71, 74, 71, 67, 71, 74, 76, 65, 69, 72, 69, 65, 69, 72, 74, 64, 67, 71, 67, 64, 71, 72, 74],
    bass: [45, N, N, N, 45, N, N, N, 43, N, N, N, 43, N, N, N, 41, N, N, N, 41, N, N, N, 40, N, N, N, 40, N, 43, N],
  },
};

let timer: ReturnType<typeof setInterval> | null = null;
let step = 0;
let nextTime = 0;
let current: TrackId | null = null;

export function playTrack(id: TrackId) {
  stopTrack();
  const { ctx, master } = getCtx();
  master.gain.cancelScheduledValues(ctx.currentTime);
  master.gain.setValueAtTime(0.5, ctx.currentTime);
  current = id;
  step = 0;
  nextTime = ctx.currentTime + 0.06;
  const p = PATTERNS[id];
  const stepDur = 60 / p.bpm / 2;
  timer = setInterval(() => {
    if (!ctx || current !== id) return;
    while (nextTime < ctx.currentTime + 0.15) {
      const i = step % p.lead.length;
      const l = p.lead[i] ?? null;
      const b = p.bass[i] ?? null;
      if (l !== null) tone(mtof(l), nextTime, p.leadDur, p.wave, p.wave === "square" ? 0.06 : 0.14, p.cutoff);
      if (b !== null) tone(mtof(b), nextTime, p.leadDur * 1.6 + 0.3, p.bassWave, p.bassWave === "sawtooth" ? 0.07 : 0.18, 900);
      if (p.perc) {
        if (i % 4 === 0) tone(60, nextTime, 0.18, "sine", 0.35, 400);
        if (i % 4 === 2) noise(nextTime, 0.08, 0.12, "highpass", 6000);
      }
      nextTime += stepDur;
      step++;
    }
  }, 25);
}

export function stopTrack() {
  if (timer) clearInterval(timer);
  timer = null;
  current = null;
  if (ctx && master) {
    master.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.08);
  }
}

/** Fills `out` with frequency magnitudes (0–255). Returns false when audio is idle. */
export function readLevels(out: Uint8Array<ArrayBuffer>) {
  if (!analyser || !current) return false;
  analyser.getByteFrequencyData(out);
  return true;
}

function sfxGain() {
  const { ctx, master } = getCtx();
  if (!current) {
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setValueAtTime(0.5, ctx.currentTime);
  }
  return ctx;
}

export const sfx = {
  dig() {
    const c = sfxGain();
    noise(c.currentTime, 0.07, 0.18, "bandpass", 900, 2);
  },
  breakBlock() {
    const c = sfxGain();
    noise(c.currentTime, 0.25, 0.4, "lowpass", 1200);
    tone(140, c.currentTime, 0.15, "square", 0.08, 600);
  },
  pop() {
    const c = sfxGain();
    tone(880, c.currentTime, 0.08, "sine", 0.2);
    tone(1320, c.currentTime + 0.06, 0.1, "sine", 0.15);
  },
  xp() {
    const c = sfxGain();
    [1046, 1318, 1568].forEach((f, i) => tone(f, c.currentTime + i * 0.05, 0.18, "sine", 0.12));
  },
  hiss() {
    const c = sfxGain();
    noise(c.currentTime, 1.5, 0.35, "highpass", 3500, 0.7);
  },
  boom() {
    const c = sfxGain();
    noise(c.currentTime, 1.4, 0.9, "lowpass", 500);
    tone(55, c.currentTime, 0.9, "sine", 0.6, 300);
  },
};
