import { motion, AnimatePresence } from 'framer-motion';
import type { Pokemon, RoundResult } from '@/types';

interface PokemonCardProps {
  pokemon: Pokemon;
  revealed: boolean;
  result: RoundResult;
  shiny?: boolean;
}

// Posiciones de las estrellas de destello shiny (alrededor del artwork).
const SPARKLES = [
  { top: '6%', left: '14%', size: 26, delay: 0 },
  { top: '18%', left: '78%', size: 20, delay: 0.12 },
  { top: '62%', left: '8%', size: 18, delay: 0.2 },
  { top: '74%', left: '82%', size: 24, delay: 0.08 },
  { top: '40%', left: '46%', size: 16, delay: 0.28 },
];

export function PokemonCard({ pokemon, revealed, result, shiny = false }: PokemonCardProps) {
  const shake = result === 'incorrect' || result === 'timeout';
  const showShiny = revealed && shiny;
  // Usa el artwork shiny solo al revelar; la silueta nunca cambia.
  const src = showShiny ? pokemon.shinyImage : pokemon.image;

  return (
    <div className="relative mx-auto flex aspect-square w-full max-w-[340px] items-center justify-center">
      {/* halo de revelación (dorado normal, cian intenso si es shiny) */}
      <AnimatePresence>
        {revealed && (
          <motion.div
            key="halo"
            initial={{ scale: 0.2, opacity: 0.9 }}
            animate={{ scale: 2.4, opacity: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="pointer-events-none absolute inset-0 rounded-full"
            style={{
              background: showShiny
                ? 'radial-gradient(circle, #7FFBFF 0%, #FFCB05 35%, transparent 65%)'
                : 'radial-gradient(circle, #FFCB05 0%, transparent 60%)',
            }}
          />
        )}
      </AnimatePresence>

      {/* flash blanco */}
      <AnimatePresence>
        {revealed && (
          <motion.div
            key="flash"
            initial={{ opacity: 0.85 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
            className="pointer-events-none absolute inset-0 z-20 rounded-3xl bg-white"
          />
        )}
      </AnimatePresence>

      {/* estrellas shiny */}
      <AnimatePresence>
        {showShiny &&
          SPARKLES.map((s, i) => (
            <motion.span
              key={`sparkle-${i}`}
              className="pointer-events-none absolute z-30 select-none"
              style={{ top: s.top, left: s.left, fontSize: s.size }}
              initial={{ scale: 0, opacity: 0, rotate: -30 }}
              animate={{
                scale: [0, 1.3, 1, 1.15, 1],
                opacity: [0, 1, 1, 1, 0.9],
                rotate: [-30, 0, 10, 0, 0],
              }}
              transition={{ duration: 1, delay: 0.2 + s.delay, ease: 'easeOut' }}
            >
              ✨
            </motion.span>
          ))}
      </AnimatePresence>

      <motion.div
        key={`${pokemon.id}-${revealed}`}
        className="relative z-10 h-full w-full"
        initial={{ scale: 0.7, opacity: 0, y: 20 }}
        animate={
          shake && revealed
            ? { scale: 1, opacity: 1, y: 0, x: [0, -12, 12, -8, 8, 0] }
            : { scale: revealed ? [1, 1.08, 1] : 1, opacity: 1, y: 0 }
        }
        transition={{ duration: 0.55, ease: 'easeOut' }}
      >
        <img
          src={src}
          alt={revealed ? pokemon.displayName : 'Silueta misteriosa'}
          draggable={false}
          className={`h-full w-full select-none object-contain ${
            showShiny
              ? 'drop-shadow-[0_0_22px_rgba(127,251,255,0.8)]'
              : 'drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)]'
          } ${revealed ? 'revealed' : 'silhouette'}`}
        />
      </motion.div>
    </div>
  );
}
