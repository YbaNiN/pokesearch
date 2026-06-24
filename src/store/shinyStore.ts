import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GameMode, RoundResult, Generation } from '@/types';

/**
 * Estado del modo "Adivina el Shiny".
 * Es un modo APARTE: no toca el ranking ni la Pokédex de Supabase y mantiene
 * sus propias estadísticas en LocalStorage, separadas del juego principal.
 */
interface ShinyStats {
  bestScore: number;
  bestStreak: number;
  totalGames: number;
  totalCorrect: number;
  totalRounds: number;
}

interface ShinyState {
  mode: GameMode;
  generation: Generation;
  score: number;
  streak: number;
  lastResult: RoundResult;
  stats: ShinyStats;

  setMode: (mode: GameMode) => void;
  setGeneration: (generation: Generation) => void;
  startGame: () => void;
  registerCorrect: () => void;
  registerWrong: (timeout: boolean) => void;
  resetRound: () => void;
  endGame: () => void;
  resetStats: () => void;
  getAccuracy: () => number;
}

const initialStats: ShinyStats = {
  bestScore: 0,
  bestStreak: 0,
  totalGames: 0,
  totalCorrect: 0,
  totalRounds: 0,
};

const acc = (correct: number, rounds: number): number =>
  rounds === 0 ? 0 : Math.round((correct / rounds) * 100);

export const useShinyStore = create<ShinyState>()(
  persist(
    (set, get) => ({
      mode: 'classic',
      generation: 'gen1',
      score: 0,
      streak: 0,
      lastResult: 'idle',
      stats: initialStats,

      setMode: (mode) => set({ mode }),

      setGeneration: (generation) => set({ generation }),

      startGame: () =>
        set((s) => ({
          score: 0,
          streak: 0,
          lastResult: 'idle',
          stats: { ...s.stats, totalGames: s.stats.totalGames + 1 },
        })),

      registerCorrect: () =>
        set((s) => {
          const score = s.score + 1;
          const streak = s.streak + 1;
          return {
            score,
            streak,
            lastResult: 'correct',
            stats: {
              ...s.stats,
              totalCorrect: s.stats.totalCorrect + 1,
              totalRounds: s.stats.totalRounds + 1,
              bestScore: Math.max(s.stats.bestScore, score),
              bestStreak: Math.max(s.stats.bestStreak, streak),
            },
          };
        }),

      registerWrong: (timeout) =>
        set((s) => ({
          streak: 0,
          lastResult: timeout ? 'timeout' : 'incorrect',
          stats: { ...s.stats, totalRounds: s.stats.totalRounds + 1 },
        })),

      resetRound: () => set({ lastResult: 'idle' }),

      endGame: () => set({ lastResult: 'idle' }),

      resetStats: () => set({ stats: initialStats }),

      getAccuracy: () => {
        const { totalCorrect, totalRounds } = get().stats;
        return acc(totalCorrect, totalRounds);
      },
    }),
    {
      name: 'wiapt-shiny-storage',
      partialize: (s) => ({ stats: s.stats, mode: s.mode, generation: s.generation }),
    }
  )
);
