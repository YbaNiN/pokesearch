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

/**
 * Genera N filtros CSS de recoloreo distintos entre sí para los "shiny falsos"
 * del modo Adivina el Shiny. Cada filtro gira el tono (hue-rotate) una cantidad
 * claramente diferente y ajusta saturación/brillo para que ningún falso se
 * parezca al shiny oficial. Robusto: no depende de CORS ni de canvas.
 *
 * Se barajan los giros disponibles y se toman los primeros `count`, así cada
 * ronda muestra una combinación de recoloreos diferente.
 */
export const fakeShinyFilters = (count: number): string[] => {
  // Giros de tono repartidos por la rueda de color, evitando 0º (sin cambio).
  const hues = [40, 80, 120, 160, 200, 240, 280, 320];
  const sats = [1.15, 0.85, 1.3, 0.7, 1.1, 0.9];
  const brights = [1.05, 0.95, 1.1, 0.9];

  const shuffledHues = shuffle(hues).slice(0, count);
  return shuffledHues.map((hue, i) => {
    const sat = sats[i % sats.length];
    const bright = brights[i % brights.length];
    return `hue-rotate(${hue}deg) saturate(${sat}) brightness(${bright})`;
  });
};
