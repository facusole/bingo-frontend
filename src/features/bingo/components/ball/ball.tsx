'use client';

import { useEffect, useRef } from 'react';

import { useTranslations } from 'next-intl';

/**
 * Ball — the signature visual of the game.
 *
 * Design contract:
 * - At rest the ball is visible (no opacity-0 baseline). The weighty drop
 *   animation only plays on a *new* number — never on first mount or on
 *   screen navigation. This is enforced via the `first` ref + reflow-restart
 *   pattern from the original prototype.
 * - Colors come from CSS custom properties (`--primary-*`, `--shadow-ball`)
 *   defined in `foundations/bingo-tokens.css`. Switching the `data-palette`
 *   attribute on `<html>` recolors the ball instantly without re-rendering.
 * - The component is self-contained — easy to tweak size/animation/color
 *   without touching the rest of the app.
 */
interface Props {
  number: number | null;
  index?: number;
  total?: number;
  /** Pixel size of the outer ball. Defaults to 168 (the design's "stage" size). */
  size?: number;
  /** Hide the "Ball X of Y" meta line. Useful for hero placements. */
  hideMeta?: boolean;
}

export function Ball({ number, index = 0, total = 90, size, hideMeta = false }: Props) {
  const t = useTranslations('common');
  const ref = useRef<HTMLDivElement>(null);
  // Tracks the previously-rendered number so we can tell apart:
  //  - true mount (prev === undefined): suppress animation; this is either
  //    a fresh game (number=null) or a reconnect-mid-game (number already set).
  //  - subsequent transitions (prev !== number): play the weighty drop.
  const prevNumberRef = useRef<number | null | undefined>(undefined);

  useEffect(() => {
    const prev = prevNumberRef.current;

    prevNumberRef.current = number;
    if (number == null) return;
    if (prev === undefined) return; // first render with an existing number → no anim
    if (prev === number) return; // identical re-render (shouldn't happen, but harmless)

    const el = ref.current;

    if (!el) return;
    el.classList.remove('is-drop-weighty');
    void el.offsetWidth; // force reflow → restart the keyframe
    el.classList.add('is-drop-weighty');
    function done() {
      el?.classList.remove('is-drop-weighty');
      el?.removeEventListener('animationend', done);
    }
    el.addEventListener('animationend', done);

    return () => el.removeEventListener('animationend', done);
  }, [number]);

  const outerStyle = size ? { width: size, height: size } : undefined;
  const innerSize = size ? Math.round(size * (104 / 168)) : undefined;
  const innerStyle = innerSize ? { width: innerSize, height: innerSize } : undefined;
  const fontSize = size ? Math.round(size * (52 / 168)) : undefined;

  if (number == null) {
    return (
      <div className="ball-stage">
        <div className="ball-empty" style={outerStyle}>
          {t('waitingForFirstBall')}
        </div>
        {!hideMeta && <div className="ball-meta">{t('ballOf', { index: 0, total })}</div>}
      </div>
    );
  }

  return (
    <div className="ball-stage">
      <div className="ball-wrap">
        <div ref={ref} className="ball" style={outerStyle}>
          <div className="ball__inner" style={innerStyle}>
            <span className="ball__num tnum" style={fontSize ? { fontSize } : undefined}>
              {number}
            </span>
          </div>
        </div>
      </div>
      {!hideMeta && <div className="ball-meta">{t('ballOf', { index, total })}</div>}
    </div>
  );
}
