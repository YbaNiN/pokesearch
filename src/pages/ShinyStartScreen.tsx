import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShinyModeSelector } from '@/components/ShinyModeSelector';
import { GenerationSelector } from '@/components/GenerationSelector';
import { ShinyScoreBoard } from '@/components/ShinyScoreBoard';
import { useShinyStore } from '@/store/shinyStore';
import { useGameStore } from '@/store/gameStore';
import { sfx } from '@/utils/sound';

/**
 * El selector de generación es compartido (GenerationSelector usa gameStore),
 * así que aquí sincronizamos: el modo shiny respeta la misma generación elegida
 * en el menú principal. Es coherente y evita duplicar UI.
 */
export function ShinyStartScreen() {
  const navigate = useNavigate();
  const startGame = useShinyStore((s) => s.startGame);
  const soundEnabled = useGameStore((s) => s.settings.soundEnabled);

  const play = () => {
    sfx.resume();
    if (soundEnabled) sfx.start();
    startGame();
    navigate('/shiny/play');
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
        <p className="font-display text-sm text-poke-yellow text-stroke">✨ ADIVINA EL</p>
        <h1
          className="mt-2 font-display text-3xl leading-relaxed text-white text-stroke sm:text-4xl"
          style={{ textShadow: '0 0 18px rgba(127,251,255,0.6)' }}
        >
          SHINY
        </h1>
        <p className="mt-4 font-body text-base text-poke-white/70">
          De las 4 versiones, solo una es el shiny de verdad. ¡Encuéntralo!
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="w-full"
      >
        <h2 className="mb-3 font-display text-xs text-poke-white/60">MODO DE JUEGO</h2>
        <ShinyModeSelector />
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

      <div className="w-full">
        <h2 className="mb-3 font-display text-xs text-poke-white/60">ESTADÍSTICAS SHINY</h2>
        <ShinyScoreBoard />
      </div>

      <p className="mt-4 text-center font-body text-xs text-poke-white/40">
        Los shiny falsos se generan recoloreando el artwork oficial. Modo aparte:
        no cuenta para el ranking ni la Pokédex.
      </p>
    </div>
  );
}
