export type GameMode = 'classic' | 'hard' | 'expert' | 'infinite';

export type Generation = 'all' | 'gen1' | 'gen2' | 'gen3' | 'gen4' | 'gen5'
  | 'gen6' | 'gen7' | 'gen8' | 'gen9';

export interface GenConfig {
  id: Generation;
  label: string;     // etiqueta corta (ej. "Gen 1")
  region: string;    // región asociada (ej. "Kanto")
  min: number;       // primer id de la dex nacional (0 para 'all')
  max: number;       // último id
}

export interface ModeConfig {
  id: GameMode;
  label: string;
  seconds: number;
  autocomplete: boolean;
  description: string;
}

export type PokemonType =
  | 'normal' | 'fire' | 'water' | 'electric' | 'grass' | 'ice'
  | 'fighting' | 'poison' | 'ground' | 'flying' | 'psychic' | 'bug'
  | 'rock' | 'ghost' | 'dragon' | 'dark' | 'steel' | 'fairy';

export interface Pokemon {
  id: number;
  name: string;          // nombre oficial en minúsculas (api)
  displayName: string;   // capitalizado para mostrar
  image: string;         // artwork oficial
  shinyImage: string;    // artwork oficial shiny
  sprite: string;        // sprite oficial pequeño
  types: PokemonType[];
}

export type RoundResult = 'idle' | 'correct' | 'incorrect' | 'timeout';

export interface Stats {
  bestScore: number;
  bestStreak: number;
  totalGames: number;
  totalCorrect: number;
  totalRounds: number;
}

export interface Settings {
  soundEnabled: boolean;
}
