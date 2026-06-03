import { supabase } from '@/services/supabase';

/**
 * Registra un Pokémon como capturado para el usuario.
 * Usa upsert con onConflict para que repetir una captura no falle ni duplique.
 * RLS exige que user_id sea el del propio usuario.
 */
export async function catchPokemon(
  userId: string,
  pokemonId: number
): Promise<void> {
  const { error } = await supabase
    .from('pokedex')
    .upsert(
      { user_id: userId, pokemon_id: pokemonId },
      { onConflict: 'user_id,pokemon_id', ignoreDuplicates: true }
    );
  if (error) throw error;
}

/** Devuelve los ids (1-1025) de los Pokémon capturados por el usuario. */
export async function fetchCaughtIds(userId: string): Promise<number[]> {
  const { data, error } = await supabase
    .from('pokedex')
    .select('pokemon_id')
    .eq('user_id', userId);
  if (error) throw error;
  return (data ?? []).map((row: { pokemon_id: number }) => row.pokemon_id);
}
