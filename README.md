# ¿Quién es este Pokémon?

App web del clásico segmento del anime. Adivina la silueta antes de que termine la cuenta regresiva. Datos e imágenes oficiales desde [PokéAPI](https://pokeapi.co).

## Stack
React 18 · TypeScript · Vite · Tailwind CSS · Framer Motion · Zustand · React Query · React Router · LocalStorage.

## Ejecutar
```bash
npm install
npm run dev
```
Abre la URL que muestra Vite (por defecto http://localhost:5173).

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
