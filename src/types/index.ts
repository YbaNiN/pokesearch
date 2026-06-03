export type GameMode = 'classic' | 'hard' | 'expert' | 'infinite';

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
