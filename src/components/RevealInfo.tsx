import { motion } from 'framer-motion';
import type { Pokemon, RoundResult } from '@/types';
import { TYPE_COLORS, TYPE_LABELS } from '@/utils/constants';

interface RevealInfoProps {
  pokemon: Pokemon;
  result: RoundResult;
  shiny?: boolean;
}

const MESSAGES: Record<Exclude<RoundResult, 'idle'>, { text: string; color: string }> = {
  correct: { text: '¡Correcto!', color: '#22c55e' },
  incorrect: { text: '¡Incorrecto!', color: '#FF0000' },
  timeout: { text: '¡Se acabó el tiempo!', color: '#FFCB05' },
};

export function RevealInfo({ pokemon, result, shiny = false }: RevealInfoProps) {
  if (result === 'idle') return null;
  const msg = MESSAGES[result];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-3 text-center"
    >
      {shiny && (
        <motion.div
          initial={{ scale: 0, opacity: 0, rotate: -8 }}
          animate={{ scale: [0, 1.2, 1], opacity: 1, rotate: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="rounded-full border-2 border-poke-black px-4 py-1 font-display text-xs text-poke-black shadow-retro"
          style={{
            background: 'linear-gradient(90deg, #7FFBFF, #FFCB05)',
            boxShadow: '0 0 18px rgba(127,251,255,0.7)',
          }}
        >
          ✨ ¡SHINY! ✨
        </motion.div>
      )}

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
        {shiny && <span className="ml-2 align-middle text-lg">✨</span>}
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
