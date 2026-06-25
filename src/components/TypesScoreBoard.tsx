import { useTypesStore } from '@/store/typesStore';

interface TypesScoreBoardProps {
  compact?: boolean;
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col items-center rounded-xl border-2 border-poke-black bg-poke-black/40 px-3 py-2">
      <span className="font-display text-base text-poke-yellow">{value}</span>
      <span className="font-body text-[10px] uppercase tracking-wide text-poke-white/60">
        {label}
      </span>
    </div>
  );
}

export function TypesScoreBoard({ compact }: TypesScoreBoardProps) {
  const score = useTypesStore((s) => s.score);
  const streak = useTypesStore((s) => s.streak);
  const stats = useTypesStore((s) => s.stats);
  const acc = useTypesStore((s) => s.getAccuracy());

  if (compact) {
    return (
      <div className="grid grid-cols-4 gap-2">
        <Stat label="Puntos" value={score} />
        <Stat label="Racha" value={streak} />
        <Stat label="Mejor" value={stats.bestStreak} />
        <Stat label="Precisión" value={`${acc}%`} />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <Stat label="Mejor puntaje" value={stats.bestScore} />
      <Stat label="Mejor racha" value={stats.bestStreak} />
      <Stat label="Partidas" value={stats.totalGames} />
      <Stat label="Precisión" value={`${acc}%`} />
    </div>
  );
}
