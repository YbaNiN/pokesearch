import { motion } from 'framer-motion';
import type { Pokemon, RoundResult } from '@/types';
import { TYPE_COLORS, TYPE_LABELS } from '@/utils/constants';

interface RevealInfoProps {
  pokemon: Pokemon;
  result: RoundResult;
}

const MESSAGES: Record<Exclude<RoundResult, 'idle'>, { text: string; color: string }> = {
  correct: { text: '¡Correcto!', color: '#22c55e' },
  incorrect: { text: '¡Incorrecto!', color: '#FF0000' },
  timeout: { text: '¡Se acabó el tiempo!', color: '#FFCB05' },
};

export function RevealInfo({ pokemon, result }: RevealInfoProps) {
  if (result === 'idle') return null;
  const msg = MESSAGES[result];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-3 text-center"
    >
      <motion.h2
        initial={{ scale: 0.6 }}
        animate={{ scale: [0.6, 1.15, 1] }}
        transition={{ duration: 0.5 }}
        className="text-stroke font-display text-xl"
        style={{ color: msg.color }}
      >
        {msg.text}
      </motion.h2>

      <p className="font-display text-2xl text-white">
        <span className="text-poke-white/50">#{String(pokemon.id).padStart(3, '0')}</span>{' '}
        {pokemon.displayName}
      </p>

      <div className="flex flex-wrap justify-center gap-2">
        {pokemon.types.map((t) => (
          <span
            key={t}
            className="rounded-full border-2 border-poke-black px-4 py-1 font-body text-sm font-bold text-white shadow-retro"
            style={{ background: TYPE_COLORS[t] }}
          >
            {TYPE_LABELS[t]}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
