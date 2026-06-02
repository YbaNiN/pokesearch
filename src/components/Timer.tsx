import { motion } from 'framer-motion';

interface TimerProps {
  remaining: number;
  progress: number; // 0..1
  total: number;
}

export function Timer({ remaining, progress, total }: TimerProps) {
  const seconds = Math.ceil(remaining);
  const danger = remaining <= 3;
  const color = danger ? '#FF0000' : progress > 0.5 ? '#FFCB05' : '#3B4CCA';

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between font-display text-xs">
        <span className="text-poke-white/70">TIEMPO</span>
        <motion.span
          key={seconds}
          initial={{ scale: 1.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-stroke"
          style={{ color }}
          aria-live="polite"
        >
          {seconds}
        </motion.span>
      </div>

      <div className="h-5 w-full overflow-hidden rounded-full border-2 border-poke-black bg-poke-black/60">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color, boxShadow: `0 0 18px ${color}` }}
          animate={{
            width: `${progress * 100}%`,
            ...(danger ? { opacity: [1, 0.55, 1] } : { opacity: 1 }),
          }}
          transition={{
            width: { duration: 0.05, ease: 'linear' },
            opacity: danger ? { duration: 0.5, repeat: Infinity } : { duration: 0.1 },
          }}
        />
      </div>

      <div className="mt-1 text-right font-body text-[10px] text-poke-white/40">
        máx {total}s
      </div>
    </div>
  );
}
