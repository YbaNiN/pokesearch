import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { buildTypeIndex, type TypeIndexEntry } from '@/services/types';
import type { Generation, PokemonType } from '@/types';
import { genRange } from '@/utils/constants';
import { normalize, shuffle } from '@/utils/helpers';

/** Clave canónica de un conjunto de tipos (orden-independiente). */
export const typeKey = (types: PokemonType[]): string =>
  [...types].sort().join('+');

export interface TypeChallenge {
  types: PokemonType[]; // 1 o 2 tipos pedidos
  /** Nombres válidos (display) dentro de la generación, para la pista al revelar. */
  answers: string[];
}

export function useTypeIndex() {
  return useQuery<Map<number, TypeIndexEntry>>({
    queryKey: ['type-index'],
    queryFn: buildTypeIndex,
    staleTime: Infinity,
    gcTime: Infinity,
  });
}

/**
 * A partir del índice y la generación elegida, expone:
 *  - challenges: combinaciones de tipos REALMENTE resolubles en esa generación
 *  - validate(): comprueba que un nombre escrito existe en la generación y
 *    tiene EXACTAMENTE los tipos pedidos (coincidencia exacta, orden libre)
 */
export function useTypeChallenges(generation: Generation) {
  const { data: index, isLoading } = useTypeIndex();
  const range = genRange(generation);

  const { challenges, byKey, nameToEntry } = useMemo(() => {
    const challenges: TypeChallenge[] = [];
    const byKey = new Map<string, TypeIndexEntry[]>();
    const nameToEntry = new Map<string, TypeIndexEntry>();

    if (!index) return { challenges, byKey, nameToEntry };

    for (const entry of index.values()) {
      if (entry.id < range.min || entry.id > range.max) continue;
      nameToEntry.set(normalize(entry.name), entry);
      const key = typeKey(entry.types);
      const arr = byKey.get(key);
      if (arr) arr.push(entry);
      else byKey.set(key, [entry]);
    }

    for (const [key, entries] of byKey.entries()) {
      const types = key.split('+') as PokemonType[];
      challenges.push({
        types,
        answers: entries.map((e) => e.displayName).sort(),
      });
    }

    return { challenges, byKey, nameToEntry };
  }, [index, range.min, range.max]);

  /** Devuelve un reto aleatorio resoluble (o null si el índice aún no cargó). */
  const randomChallenge = (): TypeChallenge | null => {
    if (challenges.length === 0) return null;
    return shuffle(challenges)[0];
  };

  /**
   * Valida la respuesta escrita contra el reto.
   * Reglas: el nombre debe existir en la generación y sus tipos deben coincidir
   * EXACTAMENTE con los pedidos (mismos tipos, sin sobrar ni faltar).
   */
  const validate = (
    raw: string,
    challenge: TypeChallenge
  ): { ok: boolean; matched?: TypeIndexEntry; reason?: 'unknown' | 'wrong-types' } => {
    const entry = nameToEntry.get(normalize(raw));
    if (!entry) return { ok: false, reason: 'unknown' };
    if (typeKey(entry.types) !== typeKey(challenge.types))
      return { ok: false, matched: entry, reason: 'wrong-types' };
    return { ok: true, matched: entry };
  };

  return { challenges, byKey, isLoading, randomChallenge, validate };
}
