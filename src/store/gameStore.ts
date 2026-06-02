import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GameMode, RoundResult, Stats, Settings } from '@/types';
import { accuracy } from '@/utils/helpers';

interface GameState {
  mode: GameMode;
  score: number;
  streak: number;
  lastResult: RoundResult;
  stats: Stats;
  settings: Settings;

  setMode: (mode: GameMode) => void;
  startGame: () => void;
  registerCorrect: () => void;
  registerWrong: (timeout: boolean) => void;
  resetRound: () => void;
  endGame: () => void;
  toggleSound: () => void;
  resetStats: () => void;
  getAccuracy: () => number;
}

const initialStats: Stats = {
  bestScore: 0,
  bestStreak: 0,
  totalGames: 0,
  totalCorrect: 0,
  totalRounds: 0,
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      mode: 'classic',
      score: 0,
      streak: 0,
      lastResult: 'idle',
      stats: initialStats,
      settings: { soundEnabled: true },

      setMode: (mode) => set({ mode }),

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

      toggleSound: () =>
        set((s) => ({ settings: { ...s.settings, soundEnabled: !s.settings.soundEnabled } })),

      resetStats: () => set({ stats: initialStats }),

      getAccuracy: () => {
        const { totalCorrect, totalRounds } = get().stats;
        return accuracy(totalCorrect, totalRounds);
      },
    }),
    {
      name: 'wiapt-storage',
      partialize: (s) => ({ stats: s.stats, settings: s.settings, mode: s.mode }),
    }
  )
);
