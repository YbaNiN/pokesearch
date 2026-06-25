import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import { TypeBadges } from '@/components/TypeBadges';
import { Timer } from '@/components/Timer';
import { TypesScoreBoard } from '@/components/TypesScoreBoard';

import { useTimer } from '@/hooks/useTimer';
import { useTypeChallenges, type TypeChallenge } from '@/hooks/useTypeChallenges';
import { useTypesStore } from '@/store/typesStore';
import { useGameStore } from '@/store/gameStore';
import { TYPES_MODES, GENERATIONS } from '@/utils/constants';
import { sfx } from '@/utils/sound';

type Feedback = null | { kind: 'correct' | 'wrong'; text: string };

export function TypesGameScreen() {
  const navigate = useNavigate();
  const mode = useTypesStore((s) => s.mode);
  const cfg = TYPES_MODES[mode];
  const generation = useGameStore((s) => s.generation);
  const soundEnabled = useGameStore((s) => s.settings.soundEnabled);

  const lastResult = useTypesStore((s) => s.lastResult);
  const registerCorrect = useTypesStore((s) => s.registerCorrect);
  const registerWrong = useTypesStore((s) => s.registerWrong);
  const resetRound = useTypesStore((s) => s.resetRound);

  const { isLoading, randomChallenge, validate } = useTypeChallenges(generation);

  const [challenge, setChallenge] = useState<TypeChallenge | null>(null);
  const [value, setValue] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [shake, setShake] = useState(false);
  const settledRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);

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
    setFeedback({ kind: 'wrong', text: '¡Se acabó el tiempo!' });
    playSfx(sfx.wrong);
    playSfx(sfx.reveal);
  }, [registerWrong, playSfx]);

  const { remaining, progress, running, start, stop } = useTimer({
    duration: cfg.seconds,
    onExpire: handleExpire,
    onTick: () => playSfx(sfx.tick),
  });

  // Carga el primer reto en cuanto el índice está listo.
  const loadChallenge = useCallback(() => {
    const c = randomChallenge();
    setChallenge(c);
    return c;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [randomChallenge]);

  useEffect(() => {
    if (!isLoading && !challenge && !settledRef.current) {
      const c = loadChallenge();
      if (c) {
        sfx.resume();
        start();
        setTimeout(() => inputRef.current?.focus(), 50);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, challenge]);

  const submit = () => {
    if (settledRef.current || !challenge || !value.trim()) return;
    const res = validate(value, challenge);

    if (res.ok) {
      settledRef.current = true;
      stop();
      registerCorrect();
      setRevealed(true);
      setFeedback({
        kind: 'correct',
        text: `¡${res.matched!.displayName} es correcto!`,
      });
      playSfx(sfx.correct);
      playSfx(sfx.reveal);
    } else {
      // Respuesta incorrecta: NO termina la ronda, deja reintentar hasta que
      // expire el tiempo. Solo da feedback y sacude el input.
      setShake(true);
      setTimeout(() => setShake(false), 400);
      playSfx(sfx.wrong);
      if (res.reason === 'unknown') {
        setFeedback({ kind: 'wrong', text: 'Ese Pokémon no está en esta generación.' });
      } else {
        const t = res.matched!.displayName;
        setFeedback({ kind: 'wrong', text: `${t} no tiene esos tipos exactos.` });
      }
      setValue('');
    }
  };

  const nextRound = () => {
    if (lastResult !== 'correct' && mode === 'infinite') {
      navigate('/types/result');
      return;
    }
    resetRound();
    settledRef.current = false;
    setRevealed(false);
    setFeedback(null);
    setValue('');
    const c = loadChallenge();
    if (c) {
      start();
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const quit = () => {
    stop();
    navigate('/types/result');
  };

  return (
    <div className="crt mx-auto flex min-h-screen w-full max-w-xl flex-col gap-5 px-4 py-6">
      <div className="flex items-center justify-between">
        <button
          onClick={quit}
          className="rounded-lg border-2 border-poke-black bg-poke-darkblue/60 px-3 py-1 font-display text-[10px] text-white transition hover:bg-poke-blue"
        >
          ✕ SALIR
        </button>
        <span className="font-display text-[10px] text-poke-yellow">
          TIPOS · {cfg.label.toUpperCase()} · {GENERATIONS[generation].label.toUpperCase()}
        </span>
      </div>

      <TypesScoreBoard compact />

      {/* visor del reto */}
      <div className="relative flex min-h-[200px] flex-col items-center justify-center gap-5 rounded-3xl border-4 border-poke-black bg-gradient-to-b from-poke-blue/40 to-poke-darkblue/70 p-6 shadow-retro">
        {isLoading || !challenge ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="h-14 w-14 rounded-full border-8 border-poke-yellow border-t-transparent"
          />
        ) : (
          <>
            <p className="font-display text-xs text-poke-white/70">
              ESCRIBE UN POKÉMON DE TIPO{challenge.types.length > 1 ? 'S' : ''}
            </p>
            <TypeBadges types={challenge.types} large />
          </>
        )}
      </div>

      {/* feedback */}
      <AnimatePresence mode="wait">
        {feedback && (
          <motion.p
            key={feedback.text}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`text-center font-body text-sm ${
              feedback.kind === 'correct' ? 'text-green-400' : 'text-poke-red'
            }`}
          >
            {feedback.text}
          </motion.p>
        )}
      </AnimatePresence>

      {/* zona inferior */}
      <div className="min-h-[170px]">
        {!revealed ? (
          <div className="flex flex-col gap-4">
            <motion.div animate={shake ? { x: [-8, 8, -6, 6, 0] } : {}} transition={{ duration: 0.4 }}>
              <input
                ref={inputRef}
                type="text"
                value={value}
                disabled={!running}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && submit()}
                placeholder="Nombre del Pokémon…"
                className="w-full rounded-2xl border-4 border-poke-black bg-poke-white px-4 py-3 text-center font-body text-lg text-poke-black outline-none focus:border-poke-yellow disabled:opacity-60"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
              />
            </motion.div>
            <button
              onClick={submit}
              disabled={!running || !value.trim()}
              className="w-full rounded-2xl border-4 border-poke-black bg-poke-red px-6 py-3 font-display text-sm text-white shadow-retro transition hover:brightness-110 active:translate-y-1 active:shadow-none disabled:opacity-50"
            >
              COMPROBAR
            </button>
            <Timer remaining={remaining} progress={progress} total={cfg.seconds} />
          </div>
        ) : (
          challenge && (
            <div className="flex flex-col items-center gap-4">
              <div className="w-full rounded-2xl border-4 border-poke-black bg-poke-darkblue/60 p-4 text-center">
                <p className="font-display text-[10px] text-poke-white/60">
                  ALGUNOS VÁLIDOS{' '}
                  <span className="text-poke-yellow">
                    ({GENERATIONS[generation].label})
                  </span>
                </p>
                <p className="mt-2 font-body text-sm text-white">
                  {challenge.answers.slice(0, 6).join(' · ')}
                  {challenge.answers.length > 6 ? ' …' : ''}
                </p>
              </div>
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
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
