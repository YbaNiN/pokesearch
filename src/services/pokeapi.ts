import type { Pokemon, PokemonType } from '@/types';
import { capitalize } from '@/utils/helpers';

const BASE = 'https://pokeapi.co/api/v2';

interface RawPokemon {
  id: number;
  name: string;
  types: { type: { name: string } }[];
  sprites: {
    front_default: string | null;
    front_shiny: string | null;
    other: {
      'official-artwork': {
        front_default: string | null;
        front_shiny: string | null;
      };
    };
  };
}

/** Lista completa de nombres oficiales (Gen 1) para autocompletado. */
let nameCache: string[] | null = null;

export async function fetchPokemon(id: number): Promise<Pokemon> {
  const res = await fetch(`${BASE}/pokemon/${id}`);
  if (!res.ok) throw new Error(`PokéAPI error ${res.status}`);
  const data: RawPokemon = await res.json();

  const artwork =
    data.sprites.other['official-artwork'].front_default ??
    data.sprites.front_default ??
    '';

  const shinyArtwork =
    data.sprites.other['official-artwork'].front_shiny ??
    data.sprites.front_shiny ??
    artwork;

  return {
    id: data.id,
    name: data.name,
    displayName: capitalize(data.name),
    image: artwork,
    shinyImage: shinyArtwork,
    sprite: data.sprites.front_default ?? artwork,
    types: data.types.map((t) => t.type.name as PokemonType),
  };
}

/**
 * Lista de nombres oficiales ordenada por id de la dex nacional.
 * `names[i]` corresponde al Pokémon con id `i + 1`.
 * Se cachea por el límite máximo solicitado para no repetir la petición.
 */
export async function fetchPokemonList(limit = 1025): Promise<string[]> {
  if (nameCache && nameCache.length >= limit) return nameCache.slice(0, limit);
  const res = await fetch(`${BASE}/pokemon?limit=${limit}&offset=0`);
  if (!res.ok) throw new Error(`PokéAPI error ${res.status}`);
  const data: { results: { name: string }[] } = await res.json();
  nameCache = data.results.map((r) => r.name);
  return nameCache;
}
