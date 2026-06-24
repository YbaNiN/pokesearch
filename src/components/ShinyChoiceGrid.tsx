import { motion } from 'framer-motion';
import type { Pokemon, RoundResult } from '@/types';

interface ShinyChoiceGridProps {
  pokemon: Pokemon;
  /** Una entrada por casilla. real=true es el shiny oficial; filter es el recolor CSS de los falsos. */
  variants: { id: number; real: boolean; filter?: string }[];
  disabled: boolean;
  selectedId?: number;
  result: RoundResult;
  onSelect: (id: number, real: boolean) => void;
}

/**
 * Muestra 4 versiones del MISMO Pokémon: una es el shiny oficial real y el
 * resto son "shiny falsos" recoloreados con filtros CSS. Al revelar, marca en
 * verde el correcto y en rojo el elegido si era erróneo, igual que MultipleChoice.
 */
export function ShinyChoiceGrid({
  pokemon,
  variants,
  disabled,
  selectedId,
  onSelect,
}: ShinyChoiceGridProps) {
  return (
    <div className="grid w-full grid-cols-2 gap-3">
      {variants.map((v, i) => {
        const revealCorrect = disabled && v.real;
        const revealWrong = disabled && v.id === selectedId && !v.real;
        const src = v.real ? pokemon.shinyImage : pokemon.image;

        const skin = revealCorrect
          ? 'border-green-400 bg-green-400/20'
          : revealWrong
            ? 'border-poke-red bg-poke-red/20'
            : 'border-poke-black bg-poke-darkblue/60 hover:bg-poke-blue/50';

        return (
          <motion.button
            key={v.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            disabled={disabled}
            onClick={() => onSelect(v.id, v.real)}
            className={`relative flex aspect-square items-center justify-center rounded-2xl border-4 p-3 shadow-retro transition active:translate-y-1 active:shadow-none disabled:cursor-not-allowed ${skin}`}
            aria-label={`Versión ${i + 1}`}
          >
            <img
              src={src}
              alt={`Versión ${i + 1}`}
              draggable={false}
              loading="eager"
              className="h-full w-full select-none object-contain drop-shadow-[0_6px_12px_rgba(0,0,0,0.5)]"
              style={v.real ? undefined : { filter: v.filter }}
            />

            {/* destello al revelar el shiny correcto */}
            {revealCorrect && (
              <motion.span
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1.3, 1], opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="absolute right-2 top-2 text-2xl"
              >
                ✨
              </motion.span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
