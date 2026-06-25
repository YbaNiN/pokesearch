import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TypesModeSelector } from '@/components/TypesModeSelector';
import { GenerationSelector } from '@/components/GenerationSelector';
import { TypesScoreBoard } from '@/components/TypesScoreBoard';
import { useTypeIndex } from '@/hooks/useTypeChallenges';
import { useTypesStore } from '@/store/typesStore';
import { useGameStore } from '@/store/gameStore';
import { sfx } from '@/utils/sound';

export function TypesStartScreen() {
  const navigate = useNavigate();
  const startGame = useTypesStore((s) => s.startGame);
  const soundEnabled = useGameStore((s) => s.settings.soundEnabled);
  // Precarga el índice de tipos mientras el jugador configura la partida.
  const { isLoading } = useTypeIndex();

  const play = () => {
    sfx.resume();
    if (soundEnabled) sfx.start();
    startGame();
    navigate('/types/play');
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-xl flex-col items-center justify-center gap-8 px-4 py-10">
      <div className="flex w-full items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="rounded-lg border-2 border-poke-black bg-poke-darkblue/60 px-3 py-1 font-display text-[10px] text-white transition hover:bg-poke-blue"
        >
          ← MENÚ
        </button>
        <span className="w-12" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <p className="font-display text-sm text-poke-yellow text-stroke">🧩 MAESTRO DE</p>
        <h1
          className="mt-2 font-display text-3xl leading-relaxed text-white text-stroke sm:text-4xl"
          style={{ textShadow: '0 0 18px rgba(127,251,255,0.6)' }}
        >
          TIPOS
        </h1>
        <p className="mt-4 font-body text-base text-poke-white/70">
          Te damos uno o dos tipos. Escribe un Pokémon que tenga
          <span className="text-poke-yellow"> exactamente</span> esos tipos.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="w-full"
      >
        <h2 className="mb-3 font-display text-xs text-poke-white/60">MODO DE JUEGO</h2>
        <TypesModeSelector />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15 }}
        className="w-full"
      >
        <h2 className="mb-3 font-display text-xs text-poke-white/60">GENERACIÓN</h2>
        <GenerationSelector />
      </motion.div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        whileTap={{ scale: 0.96 }}
        onClick={play}
        disabled={isLoading}
        className="w-full rounded-2xl border-4 border-poke-black bg-poke-red px-6 py-4 font-display text-base text-white shadow-glow shadow-retro transition hover:brightness-110 disabled:opacity-60"
      >
        {isLoading ? 'CARGANDO TIPOS…' : '▶ JUGAR'}
      </motion.button>

      <div className="w-full">
        <h2 className="mb-3 font-display text-xs text-poke-white/60">ESTADÍSTICAS TIPOS</h2>
        <TypesScoreBoard />
      </div>

      <p className="mt-4 text-center font-body text-xs text-poke-white/40">
        Coincidencia exacta: si pedimos Agua + Volador, no vale un Agua puro.
        Modo aparte: no cuenta para el ranking ni la Pokédex.
      </p>
    </div>
  );
}
