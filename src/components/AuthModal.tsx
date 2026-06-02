import { useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

type Mode = 'login' | 'signup';

export function AuthModal({ open, onClose }: AuthModalProps) {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [info, setInfo] = useState<string | null>(null);

  const reset = () => {
    setEmail('');
    setPassword('');
    setUsername('');
    setError(null);
    setInfo(null);
    setBusy(false);
  };

  const close = () => {
    reset();
    onClose();
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setBusy(true);
    try {
      if (mode === 'login') {
        await signIn(email.trim(), password);
        close();
      } else {
        if (username.trim().length < 3) {
          throw new Error('El nombre de usuario debe tener al menos 3 caracteres.');
        }
        await signUp(email.trim(), password, username.trim());
        setInfo(
          'Cuenta creada. Revisa tu correo para confirmar la cuenta antes de iniciar sesión.'
        );
      }
    } catch (err: any) {
      setError(traducirError(err?.message ?? 'Algo salió mal.'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
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

            <h2 className="text-center font-display text-base text-poke-yellow text-stroke">
              {mode === 'login' ? 'INICIAR SESIÓN' : 'CREAR CUENTA'}
            </h2>
            <p className="mt-2 text-center font-body text-xs text-poke-white/60">
              {mode === 'login'
                ? 'Entra para guardar tus puntuaciones en el ranking.'
                : 'Regístrate para competir en el ranking global.'}
            </p>

            {info ? (
              <div className="mt-6 flex flex-col gap-4 text-center">
                <p className="rounded-lg border-2 border-poke-yellow bg-poke-yellow/15 px-3 py-3 font-body text-sm text-white">
                  {info}
                </p>
                <button
                  onClick={() => {
                    setMode('login');
                    setInfo(null);
                  }}
                  className="w-full rounded-2xl border-4 border-poke-black bg-poke-yellow px-6 py-3 font-display text-sm text-poke-black shadow-retro transition active:translate-y-1 active:shadow-none"
                >
                  IR A INICIAR SESIÓN
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="mt-5 flex flex-col gap-4">
                {mode === 'signup' && (
                  <div className="flex flex-col gap-1">
                    <label className="font-body text-sm font-semibold text-white">
                      Nombre de usuario
                    </label>
                    <input
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      maxLength={20}
                      placeholder="Entrenador123"
                      autoComplete="off"
                      className="rounded-xl border-4 border-poke-black bg-white px-4 py-2.5 font-body text-base font-semibold text-poke-black outline-none transition focus:border-poke-blue"
                    />
                  </div>
                )}

                <div className="flex flex-col gap-1">
                  <label className="font-body text-sm font-semibold text-white">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@correo.com"
                    autoComplete="email"
                    className="rounded-xl border-4 border-poke-black bg-white px-4 py-2.5 font-body text-base font-semibold text-poke-black outline-none transition focus:border-poke-blue"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-body text-sm font-semibold text-white">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                    className="rounded-xl border-4 border-poke-black bg-white px-4 py-2.5 font-body text-base font-semibold text-poke-black outline-none transition focus:border-poke-blue"
                  />
                </div>

                {error && (
                  <p className="rounded-lg border-2 border-poke-red bg-poke-red/20 px-3 py-2 font-body text-sm text-white">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={busy || !email.trim() || !password}
                  className="w-full rounded-2xl border-4 border-poke-black bg-poke-red px-6 py-3 font-display text-sm text-white shadow-retro transition active:translate-y-1 active:shadow-none disabled:opacity-40"
                >
                  {busy ? 'CARGANDO…' : mode === 'login' ? '▶ ENTRAR' : '▶ REGISTRARME'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMode(mode === 'login' ? 'signup' : 'login');
                    setError(null);
                  }}
                  className="font-body text-sm text-poke-yellow underline-offset-2 hover:underline"
                >
                  {mode === 'login'
                    ? '¿No tienes cuenta? Regístrate'
                    : '¿Ya tienes cuenta? Inicia sesión'}
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function traducirError(msg: string): string {
  const m = msg.toLowerCase();
  if (m.includes('invalid login credentials')) return 'Email o contraseña incorrectos.';
  if (m.includes('already registered') || m.includes('already been registered'))
    return 'Ese email ya está registrado.';
  if (m.includes('password should be at least'))
    return 'La contraseña debe tener al menos 6 caracteres.';
  if (m.includes('unable to validate email') || m.includes('invalid email'))
    return 'El email no es válido.';
  if (m.includes('duplicate key') && m.includes('username'))
    return 'Ese nombre de usuario ya está en uso.';
  if (m.includes('email not confirmed'))
    return 'Confirma tu email antes de iniciar sesión.';
  return msg;
}
