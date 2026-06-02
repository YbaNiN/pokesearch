import { useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { capitalize, normalize } from '@/utils/helpers';

interface AnswerInputProps {
  names: string[];
  autocomplete: boolean;
  disabled: boolean;
  onSubmit: (guess: string) => void;
}

export function AnswerInput({ names, autocomplete, disabled, onSubmit }: AnswerInputProps) {
  const [value, setValue] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = useMemo(() => {
    if (!autocomplete || value.trim().length < 1) return [];
    const n = normalize(value);
    return names
      .filter((name) => normalize(name).startsWith(n))
      .slice(0, 5);
  }, [value, names, autocomplete]);

  const submit = (guess: string) => {
    if (disabled || !guess.trim()) return;
    onSubmit(guess);
    setValue('');
    setActive(0);
  };

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (suggestions.length) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActive((a) => (a + 1) % suggestions.length);
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActive((a) => (a - 1 + suggestions.length) % suggestions.length);
        return;
      }
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      submit(suggestions[active] ?? value);
    }
  };

  return (
    <div className="relative w-full">
      <div className="flex gap-2">
        <input
          ref={inputRef}
          value={value}
          disabled={disabled}
          onChange={(e) => {
            setValue(e.target.value);
            setActive(0);
          }}
          onKeyDown={handleKey}
          placeholder="Escribe tu respuesta…"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          className="w-full rounded-xl border-4 border-poke-black bg-white px-4 py-3 font-body text-lg font-semibold text-poke-black shadow-retro outline-none transition focus:border-poke-blue disabled:opacity-50"
        />
        <button
          onClick={() => submit(suggestions[active] ?? value)}
          disabled={disabled || !value.trim()}
          className="shrink-0 rounded-xl border-4 border-poke-black bg-poke-yellow px-5 font-display text-xs text-poke-black shadow-retro transition active:translate-y-1 active:shadow-none disabled:opacity-40"
        >
          OK
        </button>
      </div>

      <AnimatePresence>
        {suggestions.length > 0 && !disabled && (
          <motion.ul
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="absolute z-30 mt-2 w-full overflow-hidden rounded-xl border-4 border-poke-black bg-white shadow-retro"
          >
            {suggestions.map((name, i) => (
              <li key={name}>
                <button
                  onMouseEnter={() => setActive(i)}
                  onClick={() => submit(name)}
                  className={`block w-full px-4 py-2 text-left font-body text-lg font-semibold text-poke-black transition ${
                    i === active ? 'bg-poke-blue text-white' : 'hover:bg-poke-yellow/40'
                  }`}
                >
                  {capitalize(name)}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
