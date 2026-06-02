import type { DiscordChannel } from '@/services/discord';

export interface BallTheme {
  channel: DiscordChannel;
  name: string;        // nombre de la pokéball
  label: string;       // qué hace el botón
  topColor: string;    // color de la mitad superior
  topShade: string;    // sombra/borde del color superior
  icon: string;        // emoji/símbolo decorativo
}

export const BALL_THEMES: BallTheme[] = [
  {
    channel: 'peticiones',
    name: 'Poké Ball',
    label: 'Peticiones',
    topColor: '#FF1F1F',
    topShade: '#B11414',
    icon: '✦',
  },
  {
    channel: 'reportes',
    name: 'Ultra Ball',
    label: 'Reportes',
    topColor: '#FFC60B',
    topShade: '#1A1A1A',
    icon: '⚠',
  },
  {
    channel: 'sugerencias',
    name: 'Great Ball',
    label: 'Sugerencias',
    topColor: '#2E78FF',
    topShade: '#16407F',
    icon: '✎',
  },
  {
    channel: 'contacto',
    name: 'Master Ball',
    label: 'Contacto',
    topColor: '#7A3CC4',
    topShade: '#3F1F66',
    icon: '✉',
  },
];

interface PokeballProps {
  theme: BallTheme;
  size?: number;
}

/**
 * Pokéball dibujada en SVG. La mitad superior usa el color del tema;
 * la Ultra Ball lleva además unas marcas negras características.
 */
export function Pokeball({ theme, size = 88 }: PokeballProps) {
  const isUltra = theme.channel === 'reportes';
  const isMaster = theme.channel === 'contacto';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className="drop-shadow-[0_4px_0_rgba(0,0,0,0.35)]"
      aria-hidden="true"
    >
      {/* mitad inferior (blanca) */}
      <path
        d="M5 50a45 45 0 0 0 90 0Z"
        fill="#F5F5F5"
        stroke="#0A0A14"
        strokeWidth="4"
      />
      {/* mitad superior (color del tema) */}
      <path
        d="M5 50a45 45 0 0 1 90 0Z"
        fill={theme.topColor}
        stroke="#0A0A14"
        strokeWidth="4"
      />
      {/* marcas de Ultra Ball */}
      {isUltra && (
        <>
          <path d="M14 32 L40 24" stroke={theme.topShade} strokeWidth="6" strokeLinecap="round" />
          <path d="M86 32 L60 24" stroke={theme.topShade} strokeWidth="6" strokeLinecap="round" />
        </>
      )}
      {/* "M" de Master Ball */}
      {isMaster && (
        <text
          x="50"
          y="34"
          textAnchor="middle"
          fill="#F0C0FF"
          fontSize="22"
          fontWeight="bold"
          fontFamily="monospace"
        >
          M
        </text>
      )}
      {/* banda central */}
      <rect x="3" y="46" width="94" height="8" fill="#0A0A14" />
      {/* botón central */}
      <circle cx="50" cy="50" r="14" fill="#0A0A14" />
      <circle cx="50" cy="50" r="9" fill="#F5F5F5" stroke="#0A0A14" strokeWidth="3" />
      <circle cx="50" cy="50" r="3.5" fill="#C9C9C9" />
    </svg>
  );
}
