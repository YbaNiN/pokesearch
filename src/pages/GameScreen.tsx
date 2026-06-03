import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import { PokemonCard } from '@/components/PokemonCard';
import { Timer } from '@/components/Timer';
import { AnswerInput } from '@/components/AnswerInput';
import { MultipleChoice } from '@/components/MultipleChoice';
import { ScoreBoard } from '@/components/ScoreBoard';
import { RevealInfo } from '@/components/RevealInfo';

import { usePokemon, usePokemonNames, useChoices } from '@/hooks/usePokemon';
import { useTimer } from '@/hooks/useTimer';
import { useGameStore } from '@/store/gameStore';
import { useAuth } from '@/context/AuthContext';
import { catchPokemon } from '@/services/pokedex';
import { MODES } from '@/utils/constants';
import { normalize, randomId } from '@/utils/helpers';
import { sfx } from '@/utils/sound';

export function GameScreen() {
  const navigate = useNavigate();
  const mode = useGameStore((s) => s.mode);
  const cfg = MODES[mode];
  const soundEnabled = useGameStore((s) => s.settings.soundEnabled);
  const lastResult = useGameStore((s) => s.lastResult);
  const registerCorrect = useGameStore((s) => s.registerCorrect);
  const registerWrong = useGameStore((s) => s.registerWrong);
  const resetRound = useGameStore((s) => s.resetRound);
  const { user } = useAuth();

  const [targetId, setTargetId] = useState(() => randomId());
  const [revealed, setRevealed] = useState(false);
  const [selectedId, setSelectedId] = useState<number | undefined>(undefined);
  const settledRef = useRef(false);

  const { data: pokemon, isLoading } = usePokemon(targetId);
  const { data: names = [] } = usePokemonNames();
  const { data: choices = [] } = useChoices(cfg.autocomplete ? undefined : pokemon);

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

  // Inicia el cronómetro cuando el Pokémon está listo y la ronda no se ha resuelto.
  useEffect(() => {
    if (pokemon && !revealed && !settledRef.current) {
      sfx.resume();
      start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pokemon?.id]);

  const settle = (guessName: string, guessId?: number) => {
    if (settledRef.current || !pokemon) return;
    settledRef.current = true;
    stop();
    setSelectedId(guessId);
    setRevealed(true);

    const correct = normalize(guessName) === normalize(pokemon.name);
    if (correct) {
      registerCorrect();
      playSfx(sfx.correct);
      // Registra el Pokémon en la Pokédex del usuario (si hay sesión).
      // Es "fire-and-forget": no bloquea el juego si falla.
      if (user) {
        catchPokemon(user.id, pokemon.id).catch(() => {
          /* silencioso: la captura no debe interrumpir la partida */
        });
      }
    } else {
      registerWrong(false);
      playSfx(sfx.wrong);
    }
    playSfx(sfx.reveal);
  };

  const nextRound = () => {
    if (lastResult !== 'correct' && mode === 'infinite') {
      navigate('/result');
      return;
    }
    resetRound();
    settledRef.current = false;
    setRevealed(false);
    setSelectedId(undefined);
    setTargetId(randomId());
  };

  const quit = () => {
    stop();
    navigate('/result');
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
        <span className="font-display text-[10px] text-poke-yellow">{cfg.label.toUpperCase()}</span>
      </div>

      <ScoreBoard compact />

      {/* visor estilo Pokédex */}
      <div className="relative rounded-3xl border-4 border-poke-black bg-gradient-to-b from-poke-blue/40 to-poke-darkblue/70 p-5 shadow-retro">
        <AnimatePresence>
          {!revealed && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mb-3 text-center font-display text-sm text-poke-yellow text-stroke"
            >
              ¿Quién es este Pokémon?
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
          <PokemonCard pokemon={pokemon} revealed={revealed} result={lastResult} />
        )}
      </div>

      {/* zona inferior: timer + input  /  revelación */}
      <div className="min-h-[180px]">
        {!revealed ? (
          <div className="flex flex-col gap-4">
            <Timer remaining={remaining} progress={progress} total={cfg.seconds} />
            {pokemon && running && (
              cfg.autocomplete ? (
                <AnswerInput
                  names={names}
                  autocomplete
                  disabled={revealed}
                  onSubmit={(g) => settle(g)}
                />
              ) : choices.length ? (
                <MultipleChoice
                  options={choices}
                  disabled={revealed}
                  correctId={pokemon.id}
                  selectedId={selectedId}
                  onSelect={(name, id) => settle(name, id)}
                />
              ) : (
                <AnswerInput
                  names={names}
                  autocomplete={false}
                  disabled={revealed}
                  onSubmit={(g) => settle(g)}
                />
              )
            )}
          </div>
        ) : (
          pokemon && (
            <div className="flex flex-col items-center gap-5">
              {!cfg.autocomplete && choices.length > 0 && (
                <MultipleChoice
                  options={choices}
                  disabled
                  correctId={pokemon.id}
                  selectedId={selectedId}
                  onSelect={() => {}}
                />
              )}
              <RevealInfo pokemon={pokemon} result={lastResult} />
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
