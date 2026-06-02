import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { ScoreBoard } from '@/components/ScoreBoard';
import { AuthModal } from '@/components/AuthModal';
import { useAuth } from '@/context/AuthContext';
import { saveScore, type SaveResult } from '@/services/ranking';
import { sfx } from '@/utils/sound';

type SaveState = 'idle' | 'saving' | 'error' | SaveResult;

export function ResultScreen() {
  const navigate = useNavigate();
  const score = useGameStore((s) => s.score);
  const stats = useGameStore((s) => s.stats);
  const mode = useGameStore((s) => s.mode);
  const startGame = useGameStore((s) => s.startGame);
  const soundEnabled = useGameStore((s) => s.settings.soundEnabled);

  const { user } = useAuth();
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [authOpen, setAuthOpen] = useState(false);
  const savedRef = useRef(false);

  const isRecord = score > 0 && score >= stats.bestScore;

  // Guarda la puntuacion una sola vez si hay usuario y score > 0.
  useEffect(() => {
    if (savedRef.current || !user || score <= 0) return;
    savedRef.current = true;
    setSaveState('saving');
    saveScore(user.id, score, mode)
      .then((result) => setSaveState(result))
      .catch(() => setSaveState('error'));
  }, [user, score, mode]);

  const again = () => {
    if (soundEnabled) sfx.start();
    startGame();
    navigate('/play');
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-xl flex-col items-center justify-center gap-8 px-4 py-10 text-center">
      <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        {isRecord && (
          <p className="mb-2 font-display text-sm text-poke-yellow text-stroke">
            ★ NUEVO RÉCORD ★
          </p>
        )}
        <p className="font-display text-xs text-poke-white/60">PUNTUACIÓN</p>
        <p className="mt-2 font-display text-6xl text-white text-stroke">{score}</p>
      </motion.div>

      {score > 0 && (
        <div className="w-full">
          {!user && (
            <div className="flex flex-col items-center gap-3 rounded-2xl border-4 border-poke-black bg-poke-darkblue/50 p-4">
              <p className="font-body text-sm text-poke-white/80">
                Inicia sesión para guardar esta puntuación en el ranking global.
              </p>
              <button
                onClick={() => setAuthOpen(true)}
                className="rounded-xl border-2 border-poke-black bg-poke-yellow px-4 py-2 font-display text-[10px] text-poke-black transition hover:brightness-110"
              >
                ENTRAR Y GUARDAR
              </button>
            </div>
          )}
          {user && saveState === 'saving' && (
            <p className="font-body text-sm text-poke-white/60">Guardando en el ranking…</p>
          )}
          {user && saveState === 'first' && (
            <p className="font-body text-sm text-poke-yellow">
              ✓ Primera marca registrada en el ranking
            </p>
          )}
          {user && saveState === 'record' && (
            <p className="font-body text-sm text-poke-yellow">
              ★ ¡Nuevo récord! Tu marca del ranking ha mejorado
            </p>
          )}
          {user && saveState === 'not-beaten' && (
            <p className="font-body text-sm text-poke-white/60">
              No superaste tu mejor marca en el ranking
            </p>
          )}
          {user && saveState === 'error' && (
            <p className="font-body text-sm text-poke-red">
              No se pudo guardar la puntuación.
            </p>
          )}
        </div>
      )}

      <div className="w-full">
        <ScoreBoard />
      </div>

      <div className="flex w-full flex-col gap-3">
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={again}
          className="w-full rounded-2xl border-4 border-poke-black bg-poke-red px-6 py-4 font-display text-base text-white shadow-retro transition hover:brightness-110"
        >
          JUGAR DE NUEVO
        </motion.button>
        <button
          onClick={() => navigate('/ranking')}
          className="w-full rounded-2xl border-4 border-poke-black bg-poke-blue px-6 py-3 font-display text-xs text-white shadow-retro transition hover:brightness-110"
        >
          🏆 VER RANKING
        </button>
        <button
          onClick={() => navigate('/')}
          className="w-full rounded-2xl border-4 border-poke-black bg-poke-darkblue/60 px-6 py-3 font-display text-xs text-white shadow-retro transition hover:bg-poke-blue"
        >
          MENÚ PRINCIPAL
        </button>
      </div>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
}
