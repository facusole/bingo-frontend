---
name: custom_inview_grid
description: Explanation for custom In View Grid library
applyIntelligently: true
installation: pnpx @androbinco/library-cli add in-view grid
---

### Note: When installed, component should be found at src/components/in-view/in-view-grid.tsx. Check if it exists before running command.

**Declarative grid animations with spatial stagger**

## 1. Purpose

`GridInView` is a **layout + animation** wrapper for grids that:

- Renders a responsive CSS grid
- Wraps each child in a `motion.div`
- Applies animations on viewport entry
- Calculates `delay` in **spatial manner (by column or index)**

Its goal is to enable "wave/cascade" type animations without child components knowing anything about Motion, viewport, or timing.

---

## 2. Architectural Principle

> **Strict separation between structure, animation, and semantics**

- `GridInView`
  - Controls layout (grid, columns, responsive)
  - Controls animation (delay, effect, viewport)
- Children
  - Render pure UI
  - Contain no Motion or viewport logic

This allows:

- Massive reusability
- Client Component isolation
- Global animation changes without touching UI

---

## 3. Component Responsibilities

### Layout

- Defines CSS grid using variables:
  - `--columns`
  - `--columns-mobile`
- Uses `grid-template-columns` with `repeat()`
- Handles responsive via Tailwind + CSS variables

### Animation

- Applies variants from central registry:

```ts
IN_VIEW_ANIMATIONS;
```

This is the same registry used for the individual state InViewAnimation component

Controls:

- `initial` → hidden state
- `whileInView` → visible state
- `transition` → easing, duration, and delay

Uses `viewport={{` configuration

---

## 4. Delay Calculation

### Spatial Stagger

Delay is calculated based on:

- **Column position** (spatial delay)
- Or **index position** (sequential delay)

This creates cascade/wave effects where items animate progressively based on their position in the grid.

### Configuration

Delay behavior is controlled via props to enable different stagger patterns.

---

## 5. Usage Pattern

### Basic Implementation

```tsx

  {items.map((item) => (

  ))}

```

### Key Props

- `columns`: Desktop column count
- `columnsMobile`: Mobile column count
- `animation`: Animation variant from `IN_VIEW_ANIMATIONS`
- `staggerDelay`: Delay between each item animation

---

## 6. Integration with IN_VIEW_ANIMATIONS

GridInView consumes the same animation registry as individual InView components, ensuring:

- Consistent animation behavior across the app
- Centralized animation definitions
- Easy global animation updates

📌 **Children components remain animation-agnostic and fully reusable**
