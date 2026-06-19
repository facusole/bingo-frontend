---
name: custom_scroll_tracker
description: Scroll-driven animation pattern using Context + Motion Values to centralize scroll tracking and isolate Client Components with composable API.
applyIntelligently: true
installation: pnpx @androbinco/library-cli add scroll-components scroll-tracker
---

# Cursor Rule — ScrollTrackerProvider (Scroll Context Pattern)

> This pattern defines a standardized way to create **scroll-driven** animations and logic using Context + Motion Values, allowing **Client Component isolation**, avoiding duplicate state, and maintaining a clean and composable API.

---

## Rule Objective

The `ScrollTrackerProvider` establishes a reusable **scroll scope** that:

- Centralizes the use of `useScroll` from `motion/react`
- Exposes only a shared `MotionValue` (`scrollYProgress`)
- Allows child components to react to scroll **without reinitializing listeners**
- Isolates `use client` components within a clear boundary

This pattern avoids:

- Multiple `useScroll` instances for the same section
- Duplicate state between animated components
- Direct coupling between layout and animation logic

---

## General Architecture

```
ScrollTrackerProvider
└── Sticky Layout Wrapper
    └── Children (Scroll-driven components)

ScrollTrackerContext
└── scrollYProgress (MotionValue<number>)
```

### Separation of Responsibilities

| Layer     | Responsibility                                                                |
| --------- | ----------------------------------------------------------------------------- |
| Provider  | Defines scroll area and creates `MotionValue` with `useScroll`                |
| Context   | Exposes only necessary value (`scrollYProgress`)                              |
| Consumers | Transform that value into animations (`useTransform`, styles, variants, etc.) |

---

## Provider Behavior

### 1. Scroll Scope

The `ScrollTrackerProvider` defines a container that acts as **scroll target**:

```ts
const ref = useRef<HTMLDivElement>(null);
const { scrollYProgress } = useScroll({ target: ref, offset });
```

This means:

- Progress is calculated **only within this block**
- Does not depend on document's global scroll
- Can be reused multiple times on same page

---

### 2. Height Control (animation timeline)

The provider creates a "tall" section that defines how much scroll exists for animation:

```tsx
style={{
  '--tracker-height': `${height}vh`,
  '--tracker-mobile-height': `${mobileHeight ?? height}vh`,
}}
```

And applies it with Tailwind:

```html
h-[var(--tracker-mobile-height)] lg:h-[var(--tracker-height)]
```

This converts height into:

> **The physical duration of the animation timeline**

More height = more space to interpolate values

---

### 3. Sticky Layout

Internally renders:

```html
<div class="sticky top-0 h-screen">{children}</div>
```

This generates the pattern:

- Content stays fixed on screen
- User actually "scrolls the parent container"
- `scrollYProgress` advances while layout remains visible

This pattern is ideal for:

- Scroll storytelling
- Sequential animations
- Parallax and progressive reveals

---

## Exposed Context

### Minimal API

```ts
type ScrollTrackerContextType = {
  scrollYProgress: MotionValue<number>;
};
```

### Rule

> Context only exposes **scroll-derived values**, never layout logic or provider props.

This maintains:

- Low coupling
- High reusability
- Stable API for animations

---

## Client Component Isolation Rule

This pattern allows:

- Keeping Provider as **only mandatory `use client` point**
- Allowing children to only use Motion hooks (`useTransform`) without handling scroll directly

### Benefit

This creates an **explicit Client Boundary**:

```
[ Server / Layout / Section ]
        ↓
[ ScrollTrackerProvider ]  ← use client
        ↓
[ Animated Components ]   ← only consume context
```

This:

- Facilitates RSC migrations
- Reduces hydration surface
- Isolates `motion/react` dependencies

---

## Consumption Rule

Any component that needs to react to scroll must:

```ts
const { scrollYProgress } = useScrollTrackerContext();
```

And derive values with:

```ts
const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
```

### Prohibited

- Using `useScroll` outside the Provider
- Recalculating scroll locally in child components
- Passing `scrollYProgress` through props

Context is the only source of scroll tracking within its section.

---

## Canonical Usage (Example)

This example represents the **official and valid** way to consume the pattern:

```tsx
<ScrollTrackerProvider height={200} offset={['0 0', '1 1']}>
  <ScrollSection />
</ScrollTrackerProvider>
```

### Meaning

| Prop     | Function                              |
| -------- | ------------------------------------- |
| `height` | Defines scroll duration (in vh)       |
| `offset` | Defines when tracking starts and ends |

---

## Consumer Example

```ts
const { scrollYProgress } = useScrollTrackerContext();

const showImage = useTransform(scrollYProgress, [0.3, 0.9], [0, 1]);
const rotateImage = useTransform(scrollYProgress, [0.3, 0.9], [0, 360]);
```

### Rule

> Consumer components **should not know about layout**, only normalized progress (0 → 1)

This allows:

- Reusing animation in other containers
- Changing heights without rewriting logic
- Maintaining pure and declarative animations

---

## Offset as Animation Contract

The `offset` defines the contract:

```ts
offset = ['0 0', '1 1'];
```

Means:

| Value | Behavior                                           |
| ----- | -------------------------------------------------- |
| `0 0` | Starts when container top touches viewport top     |
| `1 1` | Ends when container bottom touches viewport bottom |

### Rule

> Offset is considered part of interaction design, not internal animation

Therefore:

- Defined in Provider
- Not in consumer components

---

## Extensibility Rule

If more values need to be added to context:

- Must be **scroll-derived**
- Never layout props

Valid examples:

- `direction`
- `velocity`
- `isInView`

Invalid examples:

- `height`
- `className`
- `options`

---

## Common Mistakes

### ❌ Repeating `useScroll`

```ts
// WRONG
const { scrollYProgress } = useScroll();
```

### ❌ Passing MotionValues through props

```tsx
// WRONG
<AnimatedText progress={scrollYProgress} />
```

---

## Rule Summary

The `ScrollTrackerProvider` defines:

- An **isolated scroll scope**
- A **shared MotionValue via Context**
- A **clear Client Boundary**
- A **declarative and composable** animation pattern
- Provides a way for layout to define timeline and components to define behavior
- Allows rendering most of it server-side while maintaining client-side flexibility

Every animated component:

> Consumes progress, does not control scroll

This keeps the system:

- Scalable
- Reusable
- Easy to audit
- Compatible with Server Components

---
