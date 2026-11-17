import { useState } from 'react';
import { motion } from 'motion/react';

interface FloatingBalloonsProps {
  onBalloonTap?: (x: number, y: number) => void;
}

interface BalloonConfig {
  id: string;
  palette: 'gold' | 'champagne' | 'obsidian';
  className: string;
  animClass: string;
  delay: number;
  scale: number;
}

const BALLOONS: BalloonConfig[] = [
  {
    id: 'b-left-top',
    palette: 'gold',
    className: 'left-[3%] top-14 sm:left-[6%] sm:top-16 md:left-[8%]',
    animClass: 'animate-balloon-a',
    delay: 0.15,
    scale: 1,
  },
  {
    id: 'b-left-mid',
    palette: 'obsidian',
    className: 'hidden md:block left-[4%] top-[44%] lg:left-[7%]',
    animClass: 'animate-balloon-b',
    delay: 0.45,
    scale: 0.85,
  },
  {
    id: 'b-right-top',
    palette: 'champagne',
    className: 'right-[3%] top-20 sm:right-[6%] sm:top-14 md:right-[9%]',
    animClass: 'animate-balloon-b',
    delay: 0.25,
    scale: 0.96,
  },
  {
    id: 'b-right-mid',
    palette: 'gold',
    className: 'hidden md:block right-[4%] top-[48%] lg:right-[7%]',
    animClass: 'animate-balloon-a',
    delay: 0.6,
    scale: 0.88,
  },
];

function BalloonSVG({ palette }: { palette: BalloonConfig['palette'] }) {
  const gradId = `balloon-grad-${palette}`;

  const stops =
    palette === 'gold'
      ? { highlight: '#FFF6CC', mid: '#E3B94B', edge: '#7A5410', knot: '#9E7119' }
      : palette === 'champagne'
        ? { highlight: '#FFFDF5', mid: '#E7D1A4', edge: '#8C7042', knot: '#A38654' }
        : { highlight: '#5B4B36', mid: '#211C16', edge: '#090806', knot: '#D4AF37' };

  return (
    <svg
      viewBox="0 0 110 190"
      className="h-32 w-20 sm:h-40 sm:w-24 md:h-48 md:w-28 drop-shadow-[0_18px_28px_rgba(212,175,55,0.16)]"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={gradId} cx="32%" cy="28%" r="70%">
          <stop offset="0%" stopColor={stops.highlight} />
          <stop offset="45%" stopColor={stops.mid} />
          <stop offset="100%" stopColor={stops.edge} />
        </radialGradient>
        <linearGradient id={`string-${palette}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E6C76B" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.08" />
        </linearGradient>
      </defs>

      {/* Curly golden ribbon */}
      <path
        d="M55 117 C48 134, 64 148, 53 166 C45 178, 57 186, 54 190"
        stroke={`url(#string-${palette})`}
        strokeWidth="1.4"
        strokeLinecap="round"
      />

      {/* Balloon body (3D tear-drop silhouette) */}
      <path
        d="M55 8 C26 8 11 30 11 58 C11 86 34 106 55 112 C76 106 99 86 99 58 C99 30 84 8 55 8 Z"
        fill={`url(#${gradId})`}
      />

      {/* Rim glow */}
      <path
        d="M55 8 C26 8 11 30 11 58 C11 86 34 106 55 112 C76 106 99 86 99 58 C99 30 84 8 55 8 Z"
        stroke="rgba(253, 230, 138, 0.35)"
        strokeWidth="1"
      />

      {/* Specular 3D gloss crescent */}
      <path
        d="M36 24 C26 32, 22 47, 25 60"
        stroke="rgba(255, 252, 240, 0.58)"
        strokeWidth="4.2"
        strokeLinecap="round"
      />
      <circle cx="30" cy="70" r="2.2" fill="rgba(255, 252, 240, 0.48)" />

      {/* Tied balloon knot */}
      <path d="M51 112 L59 112 L56.5 117 L53.5 117 Z" fill={stops.knot} />
    </svg>
  );
}

export function FloatingBalloons({ onBalloonTap }: FloatingBalloonsProps) {
  const [nudgeMap, setNudgeMap] = useState<Record<string, number>>({});

  const handleTap = (id: string, e: React.MouseEvent<HTMLButtonElement>) => {
    setNudgeMap((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    if (onBalloonTap) {
      onBalloonTap(e.clientX, e.clientY);
    }
  };

  return (
    <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
      {BALLOONS.map((balloon) => (
        <motion.div
          key={balloon.id}
          initial={{ opacity: 0, y: 120, scale: 0.7 }}
          animate={{ opacity: 0.92, y: 0, scale: balloon.scale }}
          transition={{
            duration: 1.4,
            delay: balloon.delay,
            ease: [0.16, 1, 0.3, 1],
          }}
          className={`absolute ${balloon.className}`}
        >
          <div className={balloon.animClass}>
            <motion.button
              type="button"
              aria-label="Tap floating birthday balloon"
              onClick={(e) => handleTap(balloon.id, e)}
              animate={
                nudgeMap[balloon.id]
                  ? {
                      y: [0, -24, 4, 0],
                      scale: [1, 1.12, 0.96, 1],
                    }
                  : undefined
              }
              transition={{ duration: 0.55, ease: 'easeOut' }}
              className="pointer-events-auto cursor-pointer rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5D061]/60"
            >
              <BalloonSVG palette={balloon.palette} />
            </motion.button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
