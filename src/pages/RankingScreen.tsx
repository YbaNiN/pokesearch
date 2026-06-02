import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { fetchRanking } from '@/services/ranking';
import { MODES } from '@/utils/constants';
import type { GameMode } from '@/types';
import { useAuth } from '@/context/AuthContext';

type Filter = 'all' | GameMode;

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'Todos' },
  { id: 'classic', label: MODES.classic.label },
  { id: 'hard', label: MODES.hard.label },
  { id: 'expert', label: MODES.expert.label },
  { id: 'infinite', label: MODES.infinite.label },
];

export function RankingScreen() {
  const navigate = useNavigate();
  const { username } = useAuth();
  const [filter, setFilter] = useState<Filter>('all');

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['ranking', filter],
    queryFn: () => fetchRanking(filter === 'all' ? undefined : filter, 20),
    staleTime: 30_000,
  });

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-xl flex-col gap-5 px-4 py-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="rounded-lg border-2 border-poke-black bg-poke-darkblue/60 px-3 py-1 font-display text-[10px] text-white transition hover:bg-poke-blue"
        >
          ← MENÚ
        </button>
        <h1 className="font-display text-sm text-poke-yellow text-stroke">RANKING</h1>
        <button
          onClick={() => refetch()}
          className="rounded-lg border-2 border-poke-black bg-poke-darkblue/60 px-3 py-1 font-display text-[10px] text-white transition hover:bg-poke-blue"
        >
          ↻
        </button>
      </div>

      {/* filtros por modo */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`rounded-lg border-2 border-poke-black px-3 py-1.5 font-body text-xs font-semibold transition ${
              filter === f.id
                ? 'bg-poke-yellow text-poke-black'
                : 'bg-poke-darkblue/60 text-white hover:bg-poke-blue/60'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {isLoading && (
        <p className="py-10 text-center font-body text-sm text-poke-white/60">
          Cargando ranking…
        </p>
      )}

      {isError && (
        <p className="py-10 text-center font-body text-sm text-poke-white/60">
          No se pudo cargar el ranking.
        </p>
      )}

      {data && data.length === 0 && (
        <p className="py-10 text-center font-body text-sm text-poke-white/60">
          Aún no hay puntuaciones en este modo. ¡Sé el primero!
        </p>
      )}

      {data && data.length > 0 && (
        <div className="flex flex-col gap-2">
          {data.map((row, i) => {
            const isMe = username && row.username === username;
            const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : null;
            return (
              <motion.div
                key={`${row.username}-${i}`}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`flex items-center gap-3 rounded-xl border-4 border-poke-black px-4 py-2.5 shadow-retro ${
                  isMe ? 'bg-poke-yellow/90 text-poke-black' : 'bg-poke-darkblue/60 text-white'
                }`}
              >
                <span className="w-8 text-center font-display text-sm">
                  {medal ?? i + 1}
                </span>
                <span className="flex-1 truncate font-body text-base font-semibold">
                  {row.username}
                  {isMe && <span className="ml-2 text-xs opacity-70">(tú)</span>}
                </span>
                {filter === 'all' && (
                  <span className="font-body text-[10px] uppercase opacity-60">
                    {MODES[row.mode].label}
                  </span>
                )}
                <span className="font-display text-base text-poke-yellow text-stroke">
                  {row.score}
                </span>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
