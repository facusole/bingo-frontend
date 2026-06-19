# Bingo 90 — frontend

Next.js 16 (App Router) frontend for a 90-ball online bingo game. Speaks to the
Go backend over HTTP (`POST /rooms`) and WebSocket (everything else) per
`../FRONT_SCOPE.md`.

## Stack

- **Next.js 16** + React 19 + React Compiler (native, top-level config)
- **Tailwind v4** for utility classes, design tokens via `@theme`
- **next-intl** with App Router routed locales (`/en`, `/es`, `/ja`)
- **Motion**, **sonner**, **Radix Slot**, **CVA** for primitives

## Run locally

```bash
cp .env.example .env.local         # then edit if your backend isn't on :8080
pnpm install
pnpm dev                           # http://localhost:3000
```

The Go backend lives in `../backend`. Start it on `:8080` (the default), or
point `NEXT_PUBLIC_API_BASE` somewhere else. Remember to set `CORS_ORIGIN` on
the backend to the frontend origin (`http://localhost:3000` in dev, your
Vercel URL in prod) — it governs both CORS and the WebSocket origin check.

## Useful URLs (dev)

- `/en` `/es` `/ja` — home (create/join)
- `/<locale>/room/<5-char-code>` — the room
- `/<locale>/dev/tokens` — design-token + palette playground
- `/<locale>/dev/components` — every primitive in one place
- `/<locale>/dev/socket` — `useRoom` hook tester (raw `RoomState` JSON)

The `dev/*` routes are dev-only and should be removed before public release.

## Adding a palette

1. In `src/styles/foundations/bingo-tokens.css`, add a new
   `[data-palette="<name>"] { … }` block overriding `--primary*`, `--daub*`,
   `--shadow-ball`.
2. Append the key to `PALETTES` and the swatch colors to `PALETTE_SWATCHES`
   in `src/common/utils/palettes.ts`.
3. Add a translated label in every `messages/<locale>.json` under
   `palettes.<name>`.

## Adding a language

1. Add `messages/<locale>.json` with every key from the existing files.
2. Append the locale code to `routing.locales` in `src/i18n/routing.ts`.
3. Add the display label under `locales.<code>` in every catalogue.

## Architecture in one paragraph

`src/common/` holds reusable UI (Button, Icon, Avatar, Panel, Banner, TopBar)
and utilities (palette types, env config). `src/features/bingo/` holds
everything specific to the game: components (Ball, BingoCard, screens),
the `useRoom` hook, the wire-format types, the token store. Locale-aware
routing lives under `src/app/[locale]/`. The root `app/layout.tsx` is a
near-passthrough; the real `<html>`/`<body>` + i18n provider live in
`app/[locale]/layout.tsx`.

## Deploy

`pnpm build` produces a static-friendly build with `/<locale>` pages
server-rendered (they read the palette cookie). Drop on Vercel; set
`NEXT_PUBLIC_API_BASE` and `CORS_ORIGIN` (on the backend) to match.
