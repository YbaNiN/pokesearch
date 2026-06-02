import { useQuery } from '@tanstack/react-query';
import { fetchPokemon, fetchPokemonList } from '@/services/pokeapi';
import type { Pokemon } from '@/types';
import { randomIds, shuffle } from '@/utils/helpers';

/** Obtiene un Pokémon por id (con caché). */
export function usePokemon(id: number) {
  return useQuery<Pokemon>({
    queryKey: ['pokemon', id],
    queryFn: () => fetchPokemon(id),
    staleTime: Infinity,
    gcTime: Infinity,
  });
}

/** Lista de nombres oficiales para autocompletado. */
export function usePokemonNames() {
  return useQuery<string[]>({
    queryKey: ['pokemon-names'],
    queryFn: () => fetchPokemonList(151),
    staleTime: Infinity,
    gcTime: Infinity,
  });
}

/** Genera 4 opciones (incluida la correcta) para modo opción múltiple. */
export function useChoices(correct?: Pokemon) {
  return useQuery<Pokemon[]>({
    queryKey: ['choices', correct?.id],
    enabled: !!correct,
    staleTime: Infinity,
    queryFn: async () => {
      if (!correct) return [];
      const ids = randomIds(3, [correct.id]);
      const others = await Promise.all(ids.map(fetchPokemon));
      return shuffle([correct, ...others]);
    },
  });
}
