# ¿Quién es este Pokémon?

App web del clásico segmento del anime. Adivina la silueta antes de que termine la cuenta regresiva. Datos e imágenes oficiales desde [PokéAPI](https://pokeapi.co).

## Stack
React 18 · TypeScript · Vite · Tailwind CSS · Framer Motion · Zustand · React Query · React Router · Supabase (Auth + Postgres + Edge Functions).

## Ejecutar
```bash
npm install
cp .env.example .env.local   # rellena tus credenciales de Supabase
npm run dev
```
Abre la URL que muestra Vite (por defecto http://localhost:5173).

## Backend (Supabase)
La app usa Supabase para login/registro, ranking global y envío de
formularios a Discord. Necesitas:

1. **Variables de entorno** (`.env.local`): `VITE_SUPABASE_URL` y
   `VITE_SUPABASE_ANON_KEY` (Settings → API en tu proyecto).
2. **Tablas**: ejecuta el SQL de `profiles` y `scores` con sus políticas RLS
   en el SQL Editor de Supabase.
3. **Edge Function `discord-relay`**: despliega `supabase/functions/discord-relay/`
   y configura los 4 secretos de webhook:
   `DISCORD_WEBHOOK_PETICIONES`, `DISCORD_WEBHOOK_REPORTES`,
   `DISCORD_WEBHOOK_SUGERENCIAS`, `DISCORD_WEBHOOK_CONTACTO`.

El frontend invoca la función con el SDK (envía la anon key automáticamente),
así que no hace falta desactivar "Verify JWT".

## Funciones
- **Jugar**: libre, sin necesidad de cuenta.
- **Registro / Login**: email + contraseña, vía Supabase Auth.
- **Ranking global**: las puntuaciones de usuarios logueados se guardan y se
  muestran en un ranking filtrable por modo.
- **Contacto (4 Poké Balls)**: peticiones, reportes, sugerencias y contacto;
  cada formulario llega a su canal de Discord mediante la Edge Function.

## Build de producción
```bash
npm run build
npm run preview
```

## Modos
- **Clásico**: 10 s con autocompletado.
- **Difícil**: 5 s, opción múltiple sin ayuda.
- **Experto**: 3 s, opción múltiple.
- **Infinito**: hasta el primer fallo.

## Notas
- La silueta se genera aplicando filtros CSS (`brightness(0)`) sobre el artwork oficial.
- El audio es sintetizado con la Web Audio API (sin assets con copyright) y es desactivable en Ajustes.
- Puntuación, mejor racha y estadísticas se guardan en LocalStorage.

Proyecto personal/educativo sin fines comerciales. Pokémon © Nintendo / Game Freak / The Pokémon Company.
