import { motion } from 'framer-motion';
import type { PokemonType } from '@/types';
import { TYPE_COLORS, TYPE_LABELS } from '@/utils/constants';

interface TypeBadgesProps {
  types: PokemonType[];
  large?: boolean;
}

/** Chapas de tipo con el color oficial, reutilizando TYPE_COLORS/TYPE_LABELS. */
export function TypeBadges({ types, large }: TypeBadgesProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {types.map((t, i) => (
        <motion.span
          key={t}
          initial={{ opacity: 0, scale: 0.6, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: i * 0.12, type: 'spring', stiffness: 260 }}
          className={`inline-flex items-center rounded-xl border-4 border-poke-black font-display text-white shadow-retro ${
            large ? 'px-5 py-3 text-base' : 'px-3 py-2 text-xs'
          }`}
          style={{
            backgroundColor: TYPE_COLORS[t],
            textShadow: '1px 1px 0 rgba(0,0,0,0.6)',
          }}
        >
          {TYPE_LABELS[t]}
        </motion.span>
      ))}
    </div>
  );
}
