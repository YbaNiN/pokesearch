import type { PokemonType } from '@/types';
import { capitalize } from '@/utils/helpers';

const BASE = 'https://pokeapi.co/api/v2';

const ALL_TYPES: PokemonType[] = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy',
];

export interface TypeIndexEntry {
  id: number;
  name: string;        // nombre api (minúsculas)
  displayName: string; // capitalizado
  types: PokemonType[];
}

/**
 * Índice nacional de Pokémon -> tipos, construido a partir del endpoint
 * /type/{name} de PokéAPI (18 peticiones, cacheadas para siempre por React Query).
 * Permite, sin pedir Pokémon uno a uno:
 *   - validar si un nombre escrito tiene EXACTAMENTE los tipos pedidos
 *   - generar retos resolubles (combinaciones de tipos que existen de verdad)
 */
let cache: Map<number, TypeIndexEntry> | null = null;

function pokedexIdFromUrl(url: string): number | null {
  // .../pokemon/25/  -> 25
  const m = url.match(/\/pokemon\/(\d+)\/?$/);
  return m ? Number(m[1]) : null;
}

export async function buildTypeIndex(): Promise<Map<number, TypeIndexEntry>> {
  if (cache) return cache;

  const map = new Map<number, TypeIndexEntry>();

  const responses = await Promise.all(
    ALL_TYPES.map(async (type) => {
      const res = await fetch(`${BASE}/type/${type}`);
      if (!res.ok) throw new Error(`PokéAPI type error ${res.status}`);
      const data: {
        pokemon: { pokemon: { name: string; url: string } }[];
      } = await res.json();
      return { type, list: data.pokemon };
    })
  );

  for (const { type, list } of responses) {
    for (const { pokemon } of list) {
      const id = pokedexIdFromUrl(pokemon.url);
      // Solo formas base de la dex nacional (ignora formas alternativas con id > 10000).
      if (id === null || id > 1025) continue;

      const existing = map.get(id);
      if (existing) {
        if (!existing.types.includes(type)) existing.types.push(type);
      } else {
        map.set(id, {
          id,
          name: pokemon.name,
          displayName: capitalize(pokemon.name),
          types: [type],
        });
      }
    }
  }

  cache = map;
  return map;
}
