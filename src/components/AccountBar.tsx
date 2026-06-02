import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { AuthModal } from '@/components/AuthModal';

export function AccountBar() {
  const { user, username, signOut, loading } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-end">
        <span className="font-body text-xs text-poke-white/40">Cargando…</span>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between rounded-2xl border-4 border-poke-black bg-poke-darkblue/50 px-4 py-2.5">
        {user ? (
          <>
            <div className="flex flex-col">
              <span className="font-body text-[10px] uppercase tracking-wide text-poke-white/50">
                Conectado como
              </span>
              <span className="font-body text-sm font-semibold text-poke-yellow">
                {username ?? user.email}
              </span>
            </div>
            <button
              onClick={signOut}
              className="rounded-lg border-2 border-poke-black bg-poke-red/80 px-3 py-1.5 font-display text-[10px] text-white transition hover:bg-poke-red"
            >
              SALIR
            </button>
          </>
        ) : (
          <>
            <span className="font-body text-sm text-poke-white/70">
              Juega libre · entra para el ranking
            </span>
            <button
              onClick={() => setAuthOpen(true)}
              className="rounded-lg border-2 border-poke-black bg-poke-yellow px-3 py-1.5 font-display text-[10px] text-poke-black transition hover:brightness-110"
            >
              ENTRAR
            </button>
          </>
        )}
      </div>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
