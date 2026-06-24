import { motion } from 'framer-motion';
import type { GameMode } from '@/types';
import { SHINY_MODES } from '@/utils/constants';
import { useShinyStore } from '@/store/shinyStore';

const ORDER: GameMode[] = ['classic', 'hard', 'expert', 'infinite'];

export function ShinyModeSelector() {
  const mode = useShinyStore((s) => s.mode);
  const setMode = useShinyStore((s) => s.setMode);

  return (
    <div className="grid w-full grid-cols-2 gap-3">
      {ORDER.map((id, i) => {
        const cfg = SHINY_MODES[id];
        const selected = mode === id;
        return (
          <motion.button
            key={id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => setMode(id)}
            className={`flex flex-col items-start rounded-2xl border-4 border-poke-black px-4 py-3 text-left shadow-retro transition active:translate-y-1 active:shadow-none ${
              selected ? 'bg-poke-yellow text-poke-black' : 'bg-poke-darkblue/60 text-white hover:bg-poke-blue/60'
            }`}
          >
            <span className="font-display text-xs">{cfg.label}</span>
            <span className="mt-1 font-body text-xs opacity-80">{cfg.description}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
