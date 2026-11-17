import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

export interface GoldenParticlesHandle {
  burstAt: (x: number, y: number, count?: number) => void;
  launchConfettiCelebration: (count?: number) => void;
}

interface GoldenParticlesCanvasProps {
  confettiRainActive: boolean;
}

interface AmbientMote {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  twinkleSpeed: number;
  phase: number;
}

interface BurstParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  decay: number;
  gravity: number;
  color: string;
  isStar: boolean;
  rotation: number;
  spin: number;
}

interface ConfettiPiece {
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  wobblePhase: number;
  wobbleSpeed: number;
  persistent: boolean;
}

const GOLD_PALETTE = [
  '#FDE68A', // warm champagne
  '#F5D061', // bright gold
  '#D4AF37', // classic metallic gold
  '#FFF8E1', // ivory highlight
  '#EAB308', // rich amber gold
  '#C89B3C', // antique bronze gold
];

export const GoldenParticlesCanvas = forwardRef<
  GoldenParticlesHandle,
  GoldenParticlesCanvasProps
>(function GoldenParticlesCanvas({ confettiRainActive }, ref) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rainRef = useRef(confettiRainActive);
  const burstsRef = useRef<BurstParticle[]>([]);
  const confettiRef = useRef<ConfettiPiece[]>([]);
  const sizeRef = useRef({ width: 0, height: 0 });

  useEffect(() => {
    rainRef.current = confettiRainActive;
  }, [confettiRainActive]);

  const spawnBurst = (x: number, y: number, count = 65) => {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2.2 + Math.random() * 7.5;
      burstsRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.8,
        size: 2.2 + Math.random() * 4.2,
        alpha: 1,
        decay: 0.011 + Math.random() * 0.012,
        gravity: 0.11 + Math.random() * 0.06,
        color: GOLD_PALETTE[Math.floor(Math.random() * GOLD_PALETTE.length)],
        isStar: Math.random() > 0.55,
        rotation: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.16,
      });
    }
  };

  const spawnConfettiShower = (count = 85, persistent = false) => {
    const { width } = sizeRef.current;
    const effectiveWidth = width || window.innerWidth;
    for (let i = 0; i < count; i++) {
      confettiRef.current.push({
        x: Math.random() * effectiveWidth,
        y: -20 - Math.random() * 260,
        vx: (Math.random() - 0.5) * 2.1,
        vy: 1.9 + Math.random() * 2.8,
        width: 5 + Math.random() * 6,
        height: 8 + Math.random() * 8,
        color: GOLD_PALETTE[Math.floor(Math.random() * GOLD_PALETTE.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.12,
        wobblePhase: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.04 + Math.random() * 0.05,
        persistent,
      });
    }
  };

  useImperativeHandle(ref, () => ({
    burstAt(x: number, y: number, count = 70) {
      spawnBurst(x, y, count);
    },
    launchConfettiCelebration(count = 110) {
      const w = sizeRef.current.width || window.innerWidth;
      const h = sizeRef.current.height || window.innerHeight;
      spawnConfettiShower(count, false);
      spawnBurst(w * 0.25, h * 0.35, 48);
      spawnBurst(w * 0.75, h * 0.35, 48);
      spawnBurst(w * 0.5, h * 0.25, 60);
    },
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let animationFrameId = 0;

    const updateSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = window.innerWidth;
      const height = window.innerHeight;
      sizeRef.current = { width, height };
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    updateSize();
    window.addEventListener('resize', updateSize);

    // Lightweight ambient golden dust motes
    const moteCount = prefersReducedMotion ? 18 : window.innerWidth < 768 ? 36 : 58;
    const motes: AmbientMote[] = Array.from({ length: moteCount }, () => ({
      x: Math.random() * sizeRef.current.width,
      y: Math.random() * sizeRef.current.height,
      vx: (Math.random() - 0.5) * 0.28,
      vy: -(0.18 + Math.random() * 0.42),
      radius: 0.9 + Math.random() * 2.2,
      alpha: 0.2 + Math.random() * 0.55,
      twinkleSpeed: 0.015 + Math.random() * 0.025,
      phase: Math.random() * Math.PI * 2,
    }));

    let frameTick = 0;

    const render = () => {
      const { width, height } = sizeRef.current;
      ctx.clearRect(0, 0, width, height);
      frameTick += 1;

      // Ambient falling confetti trickle when active
      if (rainRef.current && !prefersReducedMotion) {
        const targetCount = window.innerWidth < 768 ? 28 : 46;
        const activePersistent = confettiRef.current.filter((c) => c.persistent).length;
        if (activePersistent < targetCount && frameTick % 5 === 0) {
          confettiRef.current.push({
            x: Math.random() * width,
            y: -16,
            vx: (Math.random() - 0.5) * 1.1,
            vy: 1.35 + Math.random() * 1.5,
            width: 5 + Math.random() * 5,
            height: 7 + Math.random() * 7,
            color: GOLD_PALETTE[Math.floor(Math.random() * GOLD_PALETTE.length)],
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.08,
            wobblePhase: Math.random() * Math.PI * 2,
            wobbleSpeed: 0.03 + Math.random() * 0.04,
            persistent: true,
          });
        }
      }

      // 1. Draw ambient floating golden motes
      for (let i = 0; i < motes.length; i++) {
        const m = motes[i];
        if (!prefersReducedMotion) {
          m.x += m.vx;
          m.y += m.vy;
          m.phase += m.twinkleSpeed;

          if (m.y < -12) {
            m.y = height + 12;
            m.x = Math.random() * width;
          }
          if (m.x < -12) m.x = width + 12;
          if (m.x > width + 12) m.x = -12;
        }

        const twinkle = 0.55 + 0.45 * Math.sin(m.phase);
        const alpha = m.alpha * twinkle;

        ctx.save();
        ctx.globalAlpha = alpha;
        const gradient = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.radius * 3.2);
        gradient.addColorStop(0, '#FFF6D6');
        gradient.addColorStop(0.4, '#F5CE62');
        gradient.addColorStop(1, 'rgba(212, 175, 55, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.radius * 3.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 2. Draw falling golden confetti
      for (let i = confettiRef.current.length - 1; i >= 0; i--) {
        const c = confettiRef.current[i];
        c.wobblePhase += c.wobbleSpeed;
        c.x += c.vx + Math.sin(c.wobblePhase) * 0.7;
        c.y += c.vy;
        c.rotation += c.rotationSpeed;

        if (c.y > height + 30) {
          if (c.persistent && rainRef.current && !prefersReducedMotion) {
            c.y = -20;
            c.x = Math.random() * width;
          } else {
            confettiRef.current.splice(i, 1);
          }
          continue;
        }

        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.rotate(c.rotation);
        // Simulate 3D ribbon flutter via scaleY
        const tilt = Math.cos(c.wobblePhase * 1.4);
        ctx.scale(1, Math.max(0.25, Math.abs(tilt)));
        ctx.globalAlpha = 0.88;
        ctx.fillStyle = c.color;
        ctx.fillRect(-c.width / 2, -c.height / 2, c.width, c.height);
        ctx.restore();
      }

      // 3. Draw radial burst sparks
      for (let i = burstsRef.current.length - 1; i >= 0; i--) {
        const p = burstsRef.current[i];
        p.vx *= 0.985;
        p.vy = p.vy * 0.985 + p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;
        p.rotation += p.spin;

        if (p.alpha <= 0.02) {
          burstsRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;

        if (p.isStar) {
          // 4-point golden sparkle diamond
          const r = p.size * 1.5;
          ctx.beginPath();
          ctx.moveTo(0, -r);
          ctx.quadraticCurveTo(0, 0, r, 0);
          ctx.quadraticCurveTo(0, 0, 0, r);
          ctx.quadraticCurveTo(0, 0, -r, 0);
          ctx.quadraticCurveTo(0, 0, 0, -r);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      animationFrameId = window.requestAnimationFrame(render);
    };

    animationFrameId = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', updateSize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-30 h-full w-full"
    />
  );
});
