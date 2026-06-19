'use client';

import { useEffect, useState } from 'react';

import {
  DEFAULT_PALETTE,
  PALETTES,
  PALETTE_COOKIE,
  PALETTE_STORAGE_KEY,
  PALETTE_SWATCHES,
  isPalette,
  type Palette,
} from '@/common/utils/palettes';

interface Props {
  initial?: Palette;
}

/** Renders a row of 5 palette swatches. Selecting one:
 *  - mutates <html data-palette="..."> so the new tokens take effect immediately
 *  - persists to localStorage (client-side memory)
 *  - writes a year-long cookie so the next SSR render picks the same palette
 *    (avoids a flash of the default palette on hard refresh). */
export function PaletteSwitcher({ initial = DEFAULT_PALETTE }: Props) {
  const [palette, setPalette] = useState<Palette>(initial);

  useEffect(() => {
    const stored = window.localStorage.getItem(PALETTE_STORAGE_KEY);
    if (isPalette(stored) && stored !== palette) {
      apply(stored);
      setPalette(stored);
    }
    // run on mount only — initial comes from SSR cookie
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function apply(next: Palette) {
    document.documentElement.dataset.palette = next;
    window.localStorage.setItem(PALETTE_STORAGE_KEY, next);
    document.cookie = `${PALETTE_COOKIE}=${next}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
  }

  function select(next: Palette) {
    apply(next);
    setPalette(next);
  }

  return (
    <div className="inline-flex items-center gap-1.5">
      {PALETTES.map((p) => {
        const isActive = p === palette;
        const swatch = PALETTE_SWATCHES[p];
        return (
          <button
            key={p}
            aria-label={`Color ${p}`}
            aria-pressed={isActive}
            className="grid h-7 w-7 cursor-pointer place-items-center rounded-full border transition-transform hover:scale-110"
            style={{
              borderColor: isActive ? 'var(--ink)' : 'var(--line)',
              borderWidth: isActive ? 2 : 1,
              background: `conic-gradient(${swatch.primary} 0 50%, ${swatch.daub} 50% 100%)`,
            }}
            type="button"
            onClick={() => select(p)}
          />
        );
      })}
    </div>
  );
}
