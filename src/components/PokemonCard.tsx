import { motion, AnimatePresence } from 'framer-motion';
import type { Pokemon, RoundResult } from '@/types';

interface PokemonCardProps {
  pokemon: Pokemon;
  revealed: boolean;
  result: RoundResult;
}

export function PokemonCard({ pokemon, revealed, result }: PokemonCardProps) {
  const shake = result === 'incorrect' || result === 'timeout';

  return (
    <div className="relative mx-auto flex aspect-square w-full max-w-[340px] items-center justify-center">
      {/* halo de revelación */}
      <AnimatePresence>
        {revealed && (
          <motion.div
            key="halo"
            initial={{ scale: 0.2, opacity: 0.9 }}
            animate={{ scale: 2.4, opacity: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="pointer-events-none absolute inset-0 rounded-full"
            style={{ background: 'radial-gradient(circle, #FFCB05 0%, transparent 60%)' }}
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
          src={pokemon.image}
          alt={revealed ? pokemon.displayName : 'Silueta misteriosa'}
          draggable={false}
          className={`h-full w-full select-none object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)] ${
            revealed ? 'revealed' : 'silhouette'
          }`}
        />
      </motion.div>
    </div>
  );
}
