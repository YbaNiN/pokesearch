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

/** Id aleatorio dentro de un rango {min,max} (por defecto Gen 1). */
export const randomId = (
  range: { min: number; max: number } = GEN1_RANGE
): number =>
  Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;

/** N ids únicos dentro del rango indicado (por defecto Gen 1). */
export const randomIds = (
  count: number,
  exclude: number[] = [],
  range: { min: number; max: number } = GEN1_RANGE
): number[] => {
  const set = new Set<number>(exclude);
  const result: number[] = [];
  // Evita bucle infinito si el rango es más pequeño que count.
  const span = range.max - range.min + 1;
  const target = Math.min(count, Math.max(0, span - exclude.length));
  while (result.length < target) {
    const id = randomId(range);
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

/** Tira el dado de shiny: true con probabilidad 1/odds. */
export const rollShiny = (odds: number): boolean =>
  Math.floor(Math.random() * odds) === 0;
