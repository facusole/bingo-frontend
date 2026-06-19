'use client';

import { useEffect, useRef } from 'react';

interface Props {
  run: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  g: number;
  s: number;
  rot: number;
  vr: number;
  c: string;
  life: number;
}

/** Sober confetti: short burst, derives colors from --primary / --daub so it
 *  matches whichever palette is active. Honors prefers-reduced-motion. */
export function Confetti({ run }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!run) return;
    const cv = ref.current;

    if (!cv) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduce) return;

    const ctx = cv.getContext('2d');

    if (!ctx) return;

    const rect = cv.getBoundingClientRect();
    const W = (cv.width = rect.width);
    const H = (cv.height = rect.height);

    const styles = getComputedStyle(document.documentElement);
    const primary = styles.getPropertyValue('--primary').trim() || '#4338ca';
    const daub = styles.getPropertyValue('--daub').trim() || '#fb5e3b';
    const gloss = styles.getPropertyValue('--primary-gloss').trim() || '#7a6fec';
    const colors = [primary, daub, gloss, '#8a8d9b', '#2fa56a'];
    const N = 90;

    const parts: Particle[] = Array.from({ length: N }, () => ({
      x: W / 2 + (Math.random() - 0.5) * 120,
      y: H * 0.34 + (Math.random() - 0.5) * 40,
      vx: (Math.random() - 0.5) * 7,
      vy: Math.random() * -8 - 3,
      g: 0.22 + Math.random() * 0.1,
      s: 5 + Math.random() * 5,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.3,
      c: colors[Math.floor(Math.random() * colors.length)],
      life: 0,
    }));

    let raf = 0;
    let t0 = performance.now();

    function tick(now: number) {
      if (!ctx) return;
      const dt = Math.min(2, (now - t0) / 16.6);

      t0 = now;
      ctx.clearRect(0, 0, W, H);
      let alive = false;

      parts.forEach((pp) => {
        pp.life += dt;
        pp.vy += pp.g * dt;
        pp.x += pp.vx * dt;
        pp.y += pp.vy * dt;
        pp.rot += pp.vr * dt;
        const fade = Math.max(0, 1 - pp.life / 150);

        if (pp.y < H + 20 && fade > 0) alive = true;
        ctx.save();
        ctx.translate(pp.x, pp.y);
        ctx.rotate(pp.rot);
        ctx.globalAlpha = fade;
        ctx.fillStyle = pp.c;
        ctx.fillRect(-pp.s / 2, -pp.s / 2, pp.s, pp.s * 0.6);
        ctx.restore();
      });
      if (alive) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, [run]);

  return <canvas ref={ref} aria-hidden="true" className="confetti-canvas" />;
}
