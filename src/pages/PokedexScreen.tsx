import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { fetchCaughtIds } from '@/services/pokedex';
import { usePokemonNames } from '@/hooks/usePokemon';
import { capitalize } from '@/utils/helpers';
import { GEN1_RANGE } from '@/utils/constants';

const TOTAL = GEN1_RANGE.max; // 151

/** Sprite oficial pequeño por id (mismo CDN que usa PokéAPI). */
const spriteUrl = (id: number) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

export function PokedexScreen() {
  const navigate = useNavigate();
  const { user, username } = useAuth();

  const { data: names = [] } = usePokemonNames();

  const {
    data: caughtIds = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['pokedex', user?.id],
    queryFn: () => fetchCaughtIds(user!.id),
    enabled: !!user,
    staleTime: 30_000,
  });

  const caught = new Set(caughtIds);
  const total = caught.size;
  const percent = Math.round((total / TOTAL) * 100);

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-xl flex-col gap-5 px-4 py-6">
      {/* barra superior */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="rounded-lg border-2 border-poke-black bg-poke-darkblue/60 px-3 py-1 font-display text-[10px] text-white transition hover:bg-poke-blue"
        >
          ← MENÚ
        </button>
        <h1 className="font-display text-sm text-poke-yellow text-stroke">POKÉDEX</h1>
        <span className="w-12" />
      </div>

      {/* sin sesión */}
      {!user && (
        <div className="flex flex-col items-center gap-3 rounded-2xl border-4 border-poke-black bg-poke-darkblue/50 p-6 text-center">
          <p className="font-body text-sm text-poke-white/80">
            Inicia sesión para tener tu propia Pokédex. Cada Pokémon que adivines
            quedará registrado aquí.
          </p>
          <button
            onClick={() => navigate('/')}
            className="rounded-xl border-2 border-poke-black bg-poke-yellow px-4 py-2 font-display text-[10px] text-poke-black transition hover:brightness-110"
          >
            VOLVER AL MENÚ
          </button>
        </div>
      )}

      {user && (
        <>
          {/* progreso */}
          <div className="rounded-2xl border-4 border-poke-black bg-poke-darkblue/50 p-4">
            <div className="mb-2 flex items-center justify-between font-body text-sm">
              <span className="font-semibold text-white">
                {username ?? 'Entrenador'}
              </span>
              <span className="font-display text-xs text-poke-yellow">
                {total}/{TOTAL}
              </span>
            </div>
            <div className="h-4 w-full overflow-hidden rounded-full border-2 border-poke-black bg-poke-black/60">
              <motion.div
                className="h-full rounded-full bg-poke-yellow"
                style={{ boxShadow: '0 0 14px #FFCB05' }}
                initial={{ width: 0 }}
                animate={{ width: `${percent}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
            </div>
            <p className="mt-2 text-right font-body text-[11px] text-poke-white/60">
              {percent}% completada
            </p>
          </div>

          {isLoading && (
            <p className="py-10 text-center font-body text-sm text-poke-white/60">
              Cargando Pokédex…
            </p>
          )}

          {isError && (
            <p className="py-10 text-center font-body text-sm text-poke-white/60">
              No se pudo cargar la Pokédex.
            </p>
          )}

          {!isLoading && !isError && (
            <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
              {Array.from({ length: TOTAL }, (_, i) => i + 1).map((id) => {
                const isCaught = caught.has(id);
                const name = names[id - 1];
                const num = `#${String(id).padStart(3, '0')}`;
                return (
                  <motion.div
                    key={id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: Math.min(id, 30) * 0.01 }}
                    className={`flex flex-col items-center gap-1 rounded-xl border-4 border-poke-black p-2 shadow-retro ${
                      isCaught ? 'bg-poke-darkblue/70' : 'bg-poke-black/50'
                    }`}
                  >
                    <span className="self-start font-display text-[9px] text-poke-white/50">
                      {num}
                    </span>
                    <div className="flex aspect-square w-full items-center justify-center">
                      {isCaught ? (
                        <img
                          src={spriteUrl(id)}
                          alt={name ? capitalize(name) : num}
                          draggable={false}
                          className="h-full w-full select-none object-contain"
                        />
                      ) : (
                        <img
                          src={spriteUrl(id)}
                          alt="No capturado"
                          draggable={false}
                          className="h-full w-full select-none object-contain opacity-60 [filter:brightness(0)_saturate(100%)]"
                        />
                      )}
                    </div>
                    <span
                      className={`w-full truncate text-center font-body text-[11px] font-semibold ${
                        isCaught ? 'text-white' : 'text-poke-white/30'
                      }`}
                    >
                      {isCaught && name ? capitalize(name) : '???'}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
