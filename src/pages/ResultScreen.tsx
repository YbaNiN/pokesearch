import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { ScoreBoard } from '@/components/ScoreBoard';
import { sfx } from '@/utils/sound';

export function ResultScreen() {
  const navigate = useNavigate();
  const score = useGameStore((s) => s.score);
  const stats = useGameStore((s) => s.stats);
  const startGame = useGameStore((s) => s.startGame);
  const soundEnabled = useGameStore((s) => s.settings.soundEnabled);

  const isRecord = score > 0 && score >= stats.bestScore;

  const again = () => {
    if (soundEnabled) sfx.start();
    startGame();
    navigate('/play');
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-xl flex-col items-center justify-center gap-8 px-4 py-10 text-center">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        {isRecord && (
          <p className="mb-2 font-display text-sm text-poke-yellow text-stroke">★ NUEVO RÉCORD ★</p>
        )}
        <p className="font-display text-xs text-poke-white/60">PUNTUACIÓN</p>
        <p className="mt-2 font-display text-6xl text-white text-stroke">{score}</p>
      </motion.div>

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
          onClick={() => navigate('/')}
          className="w-full rounded-2xl border-4 border-poke-black bg-poke-darkblue/60 px-6 py-3 font-display text-xs text-white shadow-retro transition hover:bg-poke-blue"
        >
          MENÚ PRINCIPAL
        </button>
      </div>
    </div>
  );
}
