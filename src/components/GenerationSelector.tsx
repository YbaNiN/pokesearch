import { motion } from 'framer-motion';
import { GENERATIONS, GEN_ORDER } from '@/utils/constants';
import { useGameStore } from '@/store/gameStore';

export function GenerationSelector() {
  const generation = useGameStore((s) => s.generation);
  const setGeneration = useGameStore((s) => s.setGeneration);

  return (
    <div className="flex flex-wrap gap-2">
      {GEN_ORDER.map((id, i) => {
        const cfg = GENERATIONS[id];
        const selected = generation === id;
        return (
          <motion.button
            key={id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.03 }}
            onClick={() => setGeneration(id)}
            title={cfg.region}
            className={`rounded-xl border-4 border-poke-black px-3 py-2 font-display text-[10px] shadow-retro transition active:translate-y-1 active:shadow-none ${
              selected
                ? 'bg-poke-yellow text-poke-black'
                : 'bg-poke-darkblue/60 text-white hover:bg-poke-blue/60'
            }`}
          >
            {cfg.label}
          </motion.button>
        );
      })}
    </div>
  );
}
