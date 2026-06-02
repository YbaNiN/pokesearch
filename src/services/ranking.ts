import { supabase } from '@/services/supabase';
import type { GameMode } from '@/types';

export interface RankingEntry {
  username: string;
  score: number;
  mode: GameMode;
  created_at: string;
}

/** Guarda una puntuación del usuario logueado. RLS exige que user_id sea el suyo. */
export async function saveScore(
  userId: string,
  score: number,
  mode: GameMode
): Promise<void> {
  const { error } = await supabase
    .from('scores')
    .insert({ user_id: userId, score, mode });
  if (error) throw error;
}

/** Top global o filtrado por modo. Une scores con el nombre de usuario. */
export async function fetchRanking(
  mode?: GameMode,
  limit = 20
): Promise<RankingEntry[]> {
  let query = supabase
    .from('scores')
    .select('score, mode, created_at, profiles(username)')
    .order('score', { ascending: false })
    .limit(limit);

  if (mode) query = query.eq('mode', mode);

  const { data, error } = await query;
  if (error) throw error;

  return (data ?? []).map((row: any) => ({
    username: row.profiles?.username ?? 'Anónimo',
    score: row.score,
    mode: row.mode,
    created_at: row.created_at,
  }));
}
