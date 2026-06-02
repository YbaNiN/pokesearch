import { motion } from 'framer-motion';
import type { Pokemon } from '@/types';

interface MultipleChoiceProps {
  options: Pokemon[];
  disabled: boolean;
  correctId?: number;
  selectedId?: number;
  onSelect: (name: string, id: number) => void;
}

export function MultipleChoice({
  options,
  disabled,
  correctId,
  selectedId,
  onSelect,
}: MultipleChoiceProps) {
  return (
    <div className="grid w-full grid-cols-2 gap-3">
      {options.map((p, i) => {
        const revealCorrect = disabled && p.id === correctId;
        const revealWrong = disabled && p.id === selectedId && p.id !== correctId;
        const base =
          'rounded-xl border-4 border-poke-black px-3 py-3 font-body text-base font-bold shadow-retro transition active:translate-y-1 active:shadow-none disabled:cursor-not-allowed';
        const skin = revealCorrect
          ? 'bg-green-400 text-poke-black'
          : revealWrong
            ? 'bg-poke-red text-white'
            : 'bg-white text-poke-black hover:bg-poke-yellow';

        return (
          <motion.button
            key={p.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            disabled={disabled}
            onClick={() => onSelect(p.name, p.id)}
            className={`${base} ${skin}`}
          >
            {p.displayName}
          </motion.button>
        );
      })}
    </div>
  );
}
