import type { GameMode, ModeConfig, PokemonType, Generation, GenConfig } from '@/types';

export const GEN1_RANGE = { min: 1, max: 151 } as const;

/** Probabilidad de shiny por ronda (clásico Gen 2-5): 1 entre 512. */
export const SHINY_ODDS = 512;

/** Rango total de la Pokédex nacional (Gen 1–9). */
export const NATIONAL_RANGE = { min: 1, max: 1025 } as const;

/** Rangos de id (dex nacional) por generación. */
export const GENERATIONS: Record<Generation, GenConfig> = {
  all:  { id: 'all',  label: 'Todas', region: 'Todas',    min: 1,    max: 1025 },
  gen1: { id: 'gen1', label: 'Gen 1', region: 'Kanto',    min: 1,    max: 151  },
  gen2: { id: 'gen2', label: 'Gen 2', region: 'Johto',    min: 152,  max: 251  },
  gen3: { id: 'gen3', label: 'Gen 3', region: 'Hoenn',    min: 252,  max: 386  },
  gen4: { id: 'gen4', label: 'Gen 4', region: 'Sinnoh',   min: 387,  max: 493  },
  gen5: { id: 'gen5', label: 'Gen 5', region: 'Teselia',  min: 494,  max: 649  },
  gen6: { id: 'gen6', label: 'Gen 6', region: 'Kalos',    min: 650,  max: 721  },
  gen7: { id: 'gen7', label: 'Gen 7', region: 'Alola',    min: 722,  max: 809  },
  gen8: { id: 'gen8', label: 'Gen 8', region: 'Galar',    min: 810,  max: 905  },
  gen9: { id: 'gen9', label: 'Gen 9', region: 'Paldea',   min: 906,  max: 1025 },
};

/** Orden de presentación del selector. */
export const GEN_ORDER: Generation[] = [
  'all', 'gen1', 'gen2', 'gen3', 'gen4', 'gen5', 'gen6', 'gen7', 'gen8', 'gen9',
];

/** Devuelve el rango {min,max} efectivo de una generación. */
export const genRange = (gen: Generation): { min: number; max: number } =>
  gen === 'all' ? NATIONAL_RANGE : GENERATIONS[gen];

export const MODES: Record<GameMode, ModeConfig> = {
  classic: {
    id: 'classic',
    label: 'Clásico',
    seconds: 10,
    autocomplete: true,
    description: '10 segundos · con ayuda',
  },
  hard: {
    id: 'hard',
    label: 'Difícil',
    seconds: 5,
    autocomplete: false,
    description: '5 segundos · sin autocompletado',
  },
  expert: {
    id: 'expert',
    label: 'Experto',
    seconds: 3,
    autocomplete: false,
    description: '3 segundos · solo para maestros',
  },
  infinite: {
    id: 'infinite',
    label: 'Infinito',
    seconds: 10,
    autocomplete: true,
    description: 'Hasta el primer fallo',
  },
};

/**
 * Submodos del modo "Adivina el Shiny". Reutiliza la forma de ModeConfig
 * (mismo tipo GameMode) pero con tiempos/descripciones propios del modo shiny.
 * No tienen autocompletado: siempre son 4 opciones visuales.
 */
export const SHINY_MODES: Record<GameMode, ModeConfig> = {
  classic: {
    id: 'classic',
    label: 'Clásico',
    seconds: 10,
    autocomplete: false,
    description: '10 segundos · tranquilo',
  },
  hard: {
    id: 'hard',
    label: 'Difícil',
    seconds: 5,
    autocomplete: false,
    description: '5 segundos · vista rápida',
  },
  expert: {
    id: 'expert',
    label: 'Experto',
    seconds: 3,
    autocomplete: false,
    description: '3 segundos · ojo de cazador',
  },
  infinite: {
    id: 'infinite',
    label: 'Infinito',
    seconds: 10,
    autocomplete: false,
    description: 'Hasta el primer fallo',
  },
};

export const TYPE_COLORS: Record<PokemonType, string> = {
  normal: '#A8A77A',
  fire: '#EE8130',
  water: '#6390F0',
  electric: '#F7D02C',
  grass: '#7AC74C',
  ice: '#96D9D6',
  fighting: '#C22E28',
  poison: '#A33EA1',
  ground: '#E2BF65',
  flying: '#A98FF3',
  psychic: '#F95587',
  bug: '#A6B91A',
  rock: '#B6A136',
  ghost: '#735797',
  dragon: '#6F35FC',
  dark: '#705746',
  steel: '#B7B7CE',
  fairy: '#D685AD',
};

export const TYPE_LABELS: Record<PokemonType, string> = {
  normal: 'Normal',
  fire: 'Fuego',
  water: 'Agua',
  electric: 'Eléctrico',
  grass: 'Planta',
  ice: 'Hielo',
  fighting: 'Lucha',
  poison: 'Veneno',
  ground: 'Tierra',
  flying: 'Volador',
  psychic: 'Psíquico',
  bug: 'Bicho',
  rock: 'Roca',
  ghost: 'Fantasma',
  dragon: 'Dragón',
  dark: 'Siniestro',
  steel: 'Acero',
  fairy: 'Hada',
};
