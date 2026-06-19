export const PALETTES = ['indigo', 'forest', 'sunset', 'ocean', 'rose'] as const;

export type Palette = (typeof PALETTES)[number];

export const DEFAULT_PALETTE: Palette = 'indigo';

export const PALETTE_COOKIE = 'bingo-palette';
export const PALETTE_STORAGE_KEY = 'bingo:palette';

export function isPalette(value: unknown): value is Palette {
  return typeof value === 'string' && (PALETTES as readonly string[]).includes(value);
}

/** Indicative swatch colors for the palette switcher dots. Kept in sync
 *  with the `--primary` and `--daub` values in foundations/bingo-tokens.css. */
export const PALETTE_SWATCHES: Record<Palette, { primary: string; daub: string }> = {
  indigo: { primary: '#4338ca', daub: '#fb5e3b' },
  forest: { primary: '#0f766e', daub: '#f59e0b' },
  sunset: { primary: '#ea580c', daub: '#db2777' },
  ocean: { primary: '#1d4ed8', daub: '#06b6d4' },
  rose: { primary: '#be185d', daub: '#d97706' },
};
