export interface Tempo {
  en: string;
  ko: string;
}

/** Map a BPM value to a classical Italian tempo marking. */
export function getTempo(bpm: number): Tempo {
  if (bpm < 60) return { en: "Largo", ko: "매우 느리게" };
  if (bpm < 76) return { en: "Adagio", ko: "느리게" };
  if (bpm < 108) return { en: "Andante", ko: "걷는 빠르기로" };
  if (bpm < 120) return { en: "Moderato", ko: "보통 빠르기로" };
  if (bpm < 156) return { en: "Allegro", ko: "빠르게" };
  if (bpm < 176) return { en: "Vivace", ko: "경쾌하고 빠르게" };
  return { en: "Presto", ko: "매우 빠르게" };
}

export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}
