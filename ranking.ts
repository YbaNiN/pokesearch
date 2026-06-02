import { supabase } from '@/services/supabase';
import type { GameMode } from '@/types';

export interface RankingEntry {
  username: string;
  score: number;
  mode: GameMode;
  created_at: string;
}

export type SaveResult = 'record' | 'first' | 'not-beaten';

/**
 * Guarda la puntuación del usuario quedándose solo con su mejor marca por modo.
 * Devuelve:
 *  - 'first'      → primera marca registrada en ese modo
 *  - 'record'     → ha superado su marca anterior
 *  - 'not-beaten' → no ha superado su mejor marca (no se sobreescribe)
 * RLS exige que user_id sea el del propio usuario.
 */
export async function saveScore(
  userId: string,
  score: number,
  mode: GameMode
): Promise<SaveResult> {
  // Leemos la mejor marca actual para decidir qué hacer.
  const { data: existing } = await supabase
    .from('scores')
    .select('id, score')
    .eq('user_id', userId)
    .eq('mode', mode)
    .maybeSingle();

  if (existing) {
    // Ya hay una fila para este modo.
    if (existing.score >= score) {
      // La marca guardada es igual o mejor: no tocamos nada.
      return 'not-beaten';
    }
    // Superó su récord: actualizamos esa fila (usa la política UPDATE).
    const { error } = await supabase
      .from('scores')
      .update({ score, created_at: new Date().toISOString() })
      .eq('id', existing.id);
    if (error) throw error;
    return 'record';
  }

  // Primera marca en este modo: insertamos (usa la política INSERT).
  const { error } = await supabase
    .from('scores')
    .insert({ user_id: userId, score, mode });
  if (error) throw error;
  return 'first';
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
