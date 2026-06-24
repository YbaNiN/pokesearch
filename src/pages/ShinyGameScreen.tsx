import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import { ShinyChoiceGrid } from '@/components/ShinyChoiceGrid';
import { Timer } from '@/components/Timer';
import { RevealInfo } from '@/components/RevealInfo';
import { ShinyScoreBoard } from '@/components/ShinyScoreBoard';

import { usePokemon } from '@/hooks/usePokemon';
import { useTimer } from '@/hooks/useTimer';
import { useShinyStore } from '@/store/shinyStore';
import { useGameStore } from '@/store/gameStore';
import { SHINY_MODES, GENERATIONS, genRange } from '@/utils/constants';
import { randomId, shuffle, fakeShinyFilters } from '@/utils/helpers';
import { sfx } from '@/utils/sound';

interface Variant {
  id: number;
  real: boolean;
  filter?: string;
}

export function ShinyGameScreen() {
  const navigate = useNavigate();
  const mode = useShinyStore((s) => s.mode);
  const cfg = SHINY_MODES[mode];
  // La generación es compartida con el menú principal (gameStore).
  const generation = useGameStore((s) => s.generation);
  const range = useMemo(() => genRange(generation), [generation]);
  const soundEnabled = useGameStore((s) => s.settings.soundEnabled);

  const lastResult = useShinyStore((s) => s.lastResult);
  const registerCorrect = useShinyStore((s) => s.registerCorrect);
  const registerWrong = useShinyStore((s) => s.registerWrong);
  const resetRound = useShinyStore((s) => s.resetRound);

  const [targetId, setTargetId] = useState(() => randomId(range));
  const [revealed, setRevealed] = useState(false);
  const [selectedId, setSelectedId] = useState<number | undefined>(undefined);
  const settledRef = useRef(false);

  const { data: pokemon, isLoading } = usePokemon(targetId);

  // 4 casillas: 1 shiny real + 3 falsos recoloreados, en orden aleatorio.
  // Cada casilla recibe un id sintético (0..3) para identificar la selección.
  const variants = useMemo<Variant[]>(() => {
    const fakeFilters = fakeShinyFilters(3);
    const cells: Variant[] = [
      { id: 0, real: true },
      { id: 1, real: false, filter: fakeFilters[0] },
      { id: 2, real: false, filter: fakeFilters[1] },
      { id: 3, real: false, filter: fakeFilters[2] },
    ];
    return shuffle(cells);
    // Nueva combinación cada vez que cambia el Pokémon objetivo.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetId]);

  const playSfx = useCallback(
    (fn: () => void) => {
      if (soundEnabled) fn();
    },
    [soundEnabled]
  );

  const handleExpire = useCallback(() => {
    if (settledRef.current) return;
    settledRef.current = true;
    registerWrong(true);
    setRevealed(true);
    playSfx(sfx.wrong);
    playSfx(sfx.reveal);
  }, [registerWrong, playSfx]);

  const { remaining, progress, running, start, stop } = useTimer({
    duration: cfg.seconds,
    onExpire: handleExpire,
    onTick: () => playSfx(sfx.tick),
  });

  useEffect(() => {
    if (pokemon && !revealed && !settledRef.current) {
      sfx.resume();
      start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pokemon?.id]);

  const settle = (id: number, real: boolean) => {
    if (settledRef.current || !pokemon) return;
    settledRef.current = true;
    stop();
    setSelectedId(id);
    setRevealed(true);

    if (real) {
      registerCorrect();
      playSfx(sfx.correct);
      playSfx(sfx.shiny);
    } else {
      registerWrong(false);
      playSfx(sfx.wrong);
    }
    playSfx(sfx.reveal);
  };

  const nextRound = () => {
    if (lastResult !== 'correct' && mode === 'infinite') {
      navigate('/shiny/result');
      return;
    }
    resetRound();
    settledRef.current = false;
    setRevealed(false);
    setSelectedId(undefined);
    setTargetId(randomId(range));
  };

  const quit = () => {
    stop();
    navigate('/shiny/result');
  };

  return (
    <div className="crt mx-auto flex min-h-screen w-full max-w-xl flex-col gap-5 px-4 py-6">
      {/* barra superior */}
      <div className="flex items-center justify-between">
        <button
          onClick={quit}
          className="rounded-lg border-2 border-poke-black bg-poke-darkblue/60 px-3 py-1 font-display text-[10px] text-white transition hover:bg-poke-blue"
        >
          ✕ SALIR
        </button>
        <span className="font-display text-[10px] text-poke-yellow">
          SHINY · {cfg.label.toUpperCase()} · {GENERATIONS[generation].label.toUpperCase()}
        </span>
      </div>

      <ShinyScoreBoard compact />

      {/* visor */}
      <div className="relative rounded-3xl border-4 border-poke-black bg-gradient-to-b from-poke-blue/40 to-poke-darkblue/70 p-5 shadow-retro">
        <AnimatePresence>
          {!revealed && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mb-4 text-center font-display text-sm text-poke-yellow text-stroke"
            >
              ¿Cuál es el shiny de verdad?
            </motion.p>
          )}
        </AnimatePresence>

        {isLoading || !pokemon ? (
          <div className="flex aspect-square w-full max-w-[340px] mx-auto items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="h-16 w-16 rounded-full border-8 border-poke-yellow border-t-transparent"
            />
          </div>
        ) : (
          <ShinyChoiceGrid
            pokemon={pokemon}
            variants={variants}
            disabled={revealed || !running}
            selectedId={selectedId}
            result={lastResult}
            onSelect={settle}
          />
        )}
      </div>

      {/* zona inferior: timer  /  revelación */}
      <div className="min-h-[160px]">
        {!revealed ? (
          <Timer remaining={remaining} progress={progress} total={cfg.seconds} />
        ) : (
          pokemon && (
            <div className="flex flex-col items-center gap-5">
              <RevealInfo pokemon={pokemon} result={lastResult} shiny />
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                onClick={nextRound}
                className="w-full rounded-2xl border-4 border-poke-black bg-poke-yellow px-6 py-3 font-display text-sm text-poke-black shadow-retro transition active:translate-y-1 active:shadow-none"
              >
                {mode === 'infinite' && lastResult !== 'correct'
                  ? 'VER RESULTADO →'
                  : 'SIGUIENTE →'}
              </motion.button>
            </div>
          )
        )}
      </div>
    </div>
  );
}
