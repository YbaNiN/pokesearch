import type { Pokemon, PokemonType } from '@/types';
import { capitalize } from '@/utils/helpers';

const BASE = 'https://pokeapi.co/api/v2';

interface RawPokemon {
  id: number;
  name: string;
  types: { type: { name: string } }[];
  sprites: {
    front_default: string | null;
    other: {
      'official-artwork': { front_default: string | null };
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

  return {
    id: data.id,
    name: data.name,
    displayName: capitalize(data.name),
    image: artwork,
    sprite: data.sprites.front_default ?? artwork,
    types: data.types.map((t) => t.type.name as PokemonType),
  };
}

export async function fetchPokemonList(limit = 151): Promise<string[]> {
  if (nameCache) return nameCache;
  const res = await fetch(`${BASE}/pokemon?limit=${limit}&offset=0`);
  if (!res.ok) throw new Error(`PokéAPI error ${res.status}`);
  const data: { results: { name: string }[] } = await res.json();
  nameCache = data.results.map((r) => r.name);
  return nameCache;
}
