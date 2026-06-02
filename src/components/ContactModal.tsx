import { useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pokeball, type BallTheme } from '@/components/Pokeball';
import { sendToDiscord } from '@/services/discord';
import { sfx } from '@/utils/sound';
import { useGameStore } from '@/store/gameStore';

interface ContactModalProps {
  theme: BallTheme | null;
  onClose: () => void;
}

type Status = 'idle' | 'sending' | 'sent' | 'error';

export function ContactModal({ theme, onClose }: ContactModalProps) {
  const soundEnabled = useGameStore((s) => s.settings.soundEnabled);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  if (!theme) return null;

  const reset = () => {
    setName('');
    setMessage('');
    setStatus('idle');
  };

  const close = () => {
    reset();
    onClose();
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim() || status === 'sending') return;
    setStatus('sending');
    try {
      await sendToDiscord({
        channel: theme.channel,
        name: name.trim(),
        message: message.trim(),
      });
      setStatus('sent');
      if (soundEnabled) sfx.correct();
    } catch {
      setStatus('error');
      if (soundEnabled) sfx.wrong();
    }
  };

  return (
    <AnimatePresence>
      {theme && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4"
        >
          <motion.div
            initial={{ scale: 0.8, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: 30, opacity: 0 }}
            transition={{ type: 'spring', damping: 22, stiffness: 280 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-3xl border-4 border-poke-black bg-poke-darkblue p-6 shadow-retro"
          >
            <button
              onClick={close}
              aria-label="Cerrar"
              className="absolute right-4 top-4 rounded-lg border-2 border-poke-black bg-poke-black/40 px-2 py-1 font-display text-[10px] text-white transition hover:bg-poke-red"
            >
              ✕
            </button>

            <div className="flex flex-col items-center gap-2">
              <Pokeball theme={theme} size={72} />
              <h2 className="font-display text-sm text-poke-yellow text-stroke">
                {theme.label.toUpperCase()}
              </h2>
              <p className="font-body text-xs text-poke-white/60">{theme.name}</p>
            </div>

            {status === 'sent' ? (
              <div className="mt-6 flex flex-col items-center gap-4 text-center">
                <p className="font-body text-lg font-semibold text-white">
                  ¡Mensaje enviado! 🎉
                </p>
                <p className="font-body text-sm text-poke-white/70">
                  Tu {theme.label.toLowerCase()} ha llegado a nuestro canal de Discord.
                </p>
                <button
                  onClick={close}
                  className="w-full rounded-2xl border-4 border-poke-black bg-poke-yellow px-6 py-3 font-display text-sm text-poke-black shadow-retro transition active:translate-y-1 active:shadow-none"
                >
                  CERRAR
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="mt-5 flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="font-body text-sm font-semibold text-white">
                    Tu nombre
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={40}
                    placeholder="Entrenador/a…"
                    autoComplete="off"
                    className="rounded-xl border-4 border-poke-black bg-white px-4 py-2.5 font-body text-base font-semibold text-poke-black outline-none transition focus:border-poke-blue"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-body text-sm font-semibold text-white">
                    Mensaje
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    maxLength={1500}
                    rows={4}
                    placeholder="Escribe aquí…"
                    className="resize-none rounded-xl border-4 border-poke-black bg-white px-4 py-2.5 font-body text-base font-semibold text-poke-black outline-none transition focus:border-poke-blue"
                  />
                  <span className="self-end font-body text-[10px] text-poke-white/40">
                    {message.length}/1500
                  </span>
                </div>

                {status === 'error' && (
                  <p className="rounded-lg border-2 border-poke-red bg-poke-red/20 px-3 py-2 font-body text-sm text-white">
                    No se pudo enviar. Inténtalo de nuevo en unos segundos.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={!name.trim() || !message.trim() || status === 'sending'}
                  className="w-full rounded-2xl border-4 border-poke-black bg-poke-red px-6 py-3 font-display text-sm text-white shadow-retro transition active:translate-y-1 active:shadow-none disabled:opacity-40"
                >
                  {status === 'sending' ? 'ENVIANDO…' : '▶ ENVIAR'}
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
