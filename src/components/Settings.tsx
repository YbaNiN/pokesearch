import { useGameStore } from '@/store/gameStore';

export function Settings() {
  const soundEnabled = useGameStore((s) => s.settings.soundEnabled);
  const toggleSound = useGameStore((s) => s.toggleSound);
  const resetStats = useGameStore((s) => s.resetStats);

  return (
    <div className="flex flex-col gap-3 rounded-2xl border-4 border-poke-black bg-poke-darkblue/50 p-4">
      <div className="flex items-center justify-between">
        <span className="font-body text-sm font-semibold text-white">Sonido</span>
        <button
          onClick={toggleSound}
          role="switch"
          aria-checked={soundEnabled}
          className={`relative h-7 w-14 rounded-full border-2 border-poke-black transition ${
            soundEnabled ? 'bg-poke-yellow' : 'bg-poke-black/60'
          }`}
        >
          <span
            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${
              soundEnabled ? 'left-7' : 'left-0.5'
            }`}
          />
        </button>
      </div>

      <button
        onClick={() => {
          if (confirm('¿Borrar todas las estadísticas guardadas?')) resetStats();
        }}
        className="rounded-xl border-2 border-poke-black bg-poke-red/80 px-3 py-2 font-body text-sm font-semibold text-white transition hover:bg-poke-red"
      >
        Reiniciar estadísticas
      </button>
    </div>
  );
}
