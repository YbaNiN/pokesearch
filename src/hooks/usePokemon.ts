import { useQuery } from '@tanstack/react-query';
import { fetchPokemon, fetchPokemonList } from '@/services/pokeapi';
import type { Pokemon } from '@/types';
import { randomIds, shuffle } from '@/utils/helpers';
import { NATIONAL_RANGE } from '@/utils/constants';

/** Obtiene un Pokémon por id (con caché). */
export function usePokemon(id: number) {
  return useQuery<Pokemon>({
    queryKey: ['pokemon', id],
    queryFn: () => fetchPokemon(id),
    staleTime: Infinity,
    gcTime: Infinity,
  });
}

/**
 * Lista de nombres oficiales (toda la dex nacional) para autocompletado.
 * El filtrado por generación se hace en quien la consume.
 */
export function usePokemonNames() {
  return useQuery<string[]>({
    queryKey: ['pokemon-names'],
    queryFn: () => fetchPokemonList(NATIONAL_RANGE.max),
    staleTime: Infinity,
    gcTime: Infinity,
  });
}

/**
 * Genera 4 opciones (incluida la correcta) para modo opción múltiple.
 * Los señuelos se sacan del mismo rango de generación que el objetivo,
 * para que las opciones sean coherentes con la generación elegida.
 */
export function useChoices(
  correct?: Pokemon,
  range: { min: number; max: number } = NATIONAL_RANGE
) {
  return useQuery<Pokemon[]>({
    queryKey: ['choices', correct?.id, range.min, range.max],
    enabled: !!correct,
    staleTime: Infinity,
    queryFn: async () => {
      if (!correct) return [];
      const ids = randomIds(3, [correct.id], range);
      const others = await Promise.all(ids.map(fetchPokemon));
      return shuffle([correct, ...others]);
    },
  });
}
