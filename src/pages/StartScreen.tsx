import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GameModeSelector } from '@/components/GameModeSelector';
import { GenerationSelector } from '@/components/GenerationSelector';
import { ScoreBoard } from '@/components/ScoreBoard';
import { Settings } from '@/components/Settings';
import { AccountBar } from '@/components/AccountBar';
import { ContactBalls } from '@/components/ContactBalls';
import { useGameStore } from '@/store/gameStore';
import { sfx } from '@/utils/sound';

export function StartScreen() {
  const navigate = useNavigate();
  const startGame = useGameStore((s) => s.startGame);
  const soundEnabled = useGameStore((s) => s.settings.soundEnabled);

  const play = () => {
    sfx.resume();
    if (soundEnabled) sfx.start();
    startGame();
    navigate('/play');
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-xl flex-col items-center justify-center gap-8 px-4 py-10">
      <div className="w-full">
        <AccountBar />
      </div>

      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <p className="font-display text-sm text-poke-yellow text-stroke">¿QUIÉN ES ESTE</p>
        <h1 className="mt-2 font-display text-3xl leading-relaxed text-white text-stroke sm:text-4xl">
          POKÉMON?
        </h1>
        <p className="mt-4 font-body text-base text-poke-white/70">
          Adivina la silueta antes de que se acabe el tiempo.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="w-full"
      >
        <h2 className="mb-3 font-display text-xs text-poke-white/60">MODO DE JUEGO</h2>
        <GameModeSelector />
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
        className="w-full rounded-2xl border-4 border-poke-black bg-poke-red px-6 py-4 font-display text-base text-white shadow-glow shadow-retro transition hover:brightness-110"
      >
        ▶ JUGAR
      </motion.button>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => navigate('/ranking')}
        className="w-full rounded-2xl border-4 border-poke-black bg-poke-blue px-6 py-3 font-display text-sm text-white shadow-retro transition hover:brightness-110"
      >
        🏆 RANKING
      </motion.button>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => navigate('/pokedex')}
        className="w-full rounded-2xl border-4 border-poke-black bg-poke-darkblue/80 px-6 py-3 font-display text-sm text-white shadow-retro transition hover:brightness-110"
      >
        📕 POKÉDEX
      </motion.button>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.32 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => navigate('/shiny')}
        className="w-full rounded-2xl border-4 border-poke-black px-6 py-3 font-display text-sm text-white shadow-retro transition hover:brightness-110"
        style={{
          background: 'linear-gradient(90deg, #1B2A6B, #2E5A8F)',
          boxShadow: '0 6px 0 0 rgba(0,0,0,0.35), 0 0 18px rgba(127,251,255,0.35)',
        }}
      >
        ✨ ADIVINA EL SHINY
      </motion.button>

      <div className="w-full">
        <h2 className="mb-3 font-display text-xs text-poke-white/60">ESTADÍSTICAS</h2>
        <ScoreBoard />
      </div>

      <div className="w-full">
        <h2 className="mb-3 font-display text-xs text-poke-white/60">AJUSTES</h2>
        <Settings />
      </div>

      <div className="w-full">
        <h2 className="mb-3 font-display text-xs text-poke-white/60">CONTACTO</h2>
        <ContactBalls />
      </div>

      <p className="mt-4 text-center font-body text-xs text-poke-white/40">
        Proyecto personal y educativo. Datos e imágenes oficiales vía PokéAPI.
        Pokémon © Nintendo / Game Freak / The Pokémon Company.
      </p>
    </div>
  );
}
