import { useState } from 'react';
import { motion } from 'framer-motion';
import { Pokeball, BALL_THEMES, type BallTheme } from '@/components/Pokeball';
import { ContactModal } from '@/components/ContactModal';
import { sfx } from '@/utils/sound';
import { useGameStore } from '@/store/gameStore';

export function ContactBalls() {
  const soundEnabled = useGameStore((s) => s.settings.soundEnabled);
  const [active, setActive] = useState<BallTheme | null>(null);

  const open = (theme: BallTheme) => {
    sfx.resume();
    if (soundEnabled) sfx.reveal();
    setActive(theme);
  };

  return (
    <>
      <div className="grid grid-cols-4 gap-3">
        {BALL_THEMES.map((theme, i) => (
          <motion.button
            key={theme.channel}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            whileHover={{ y: -6, rotate: [0, -8, 8, 0] }}
            whileTap={{ scale: 0.9 }}
            onClick={() => open(theme)}
            className="flex flex-col items-center gap-1.5 rounded-2xl border-4 border-poke-black bg-poke-darkblue/60 p-2.5 shadow-retro transition hover:bg-poke-blue/50"
            aria-label={theme.label}
          >
            <Pokeball theme={theme} size={56} />
            <span className="font-body text-[11px] font-semibold leading-tight text-white">
              {theme.label}
            </span>
          </motion.button>
        ))}
      </div>

      <ContactModal theme={active} onClose={() => setActive(null)} />
    </>
  );
}
