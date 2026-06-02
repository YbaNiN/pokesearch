import type { GameMode, ModeConfig, PokemonType } from '@/types';

export const GEN1_RANGE = { min: 1, max: 151 } as const;

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
