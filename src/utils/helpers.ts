import { GEN1_RANGE } from './constants';

export const capitalize = (s: string): string =>
  s.charAt(0).toUpperCase() + s.slice(1);

/** Normaliza para comparar respuestas: minúsculas, sin acentos ni signos. */
export const normalize = (s: string): string =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '')
    .trim();

export const randomId = (): number =>
  Math.floor(Math.random() * (GEN1_RANGE.max - GEN1_RANGE.min + 1)) +
  GEN1_RANGE.min;

/** N ids únicos dentro del rango Gen 1. */
export const randomIds = (count: number, exclude: number[] = []): number[] => {
  const set = new Set<number>(exclude);
  const result: number[] = [];
  while (result.length < count) {
    const id = randomId();
    if (!set.has(id)) {
      set.add(id);
      result.push(id);
    }
  }
  return result;
};

export const shuffle = <T>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export const accuracy = (correct: number, rounds: number): number =>
  rounds === 0 ? 0 : Math.round((correct / rounds) * 100);
