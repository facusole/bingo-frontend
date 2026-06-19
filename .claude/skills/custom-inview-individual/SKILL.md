---
name: custom_inview_individual
description: Individual viewport animation components (InViewAnimation, InViewStrokeLine, InViewHiddenText) for scroll-triggered effects with Motion.
applyIntelligently: true
installation: pnpx @androbinco/library-cli add in-view individual
---

### Note: When installed, components should be found at src/components/in-view with their respective files (in-view-animation, in-view-stroke-line, in-view-hidden-text). Check if they exist before running command.

## InViewAnimation

Utility component to apply animations on viewport entry, based on Framer Motion (motion/react) and the whileInView API.

Allows:

- Using predefined effects
- Defining custom animations
- Controlling execution, repetition, viewport margins, and transitions
- Maintaining a simple and reusable API

### Objective

Encapsulate on-scroll animation logic in a single component, avoiding repetition of:

- `initial`
- `whileInView`
- `viewport`
- `transition`

And standardizing visual effects used in the project.

### Basic Usage

```tsx
<InViewAnimation>
  <p>Animated content</p>
</InViewAnimation>
```

**By default**:

- Uses `fadeInUp` effect
- Executes only once
- Triggers when element partially enters viewport

---

### Component API

#### Main Props

| Prop           | Type                       | Default      | Description                             |
| -------------- | -------------------------- | ------------ | --------------------------------------- |
| `effect`       | `keyof IN_VIEW_ANIMATIONS` | `'fadeInUp'` | Predefined effect to use                |
| `customEffect` | `{ hidden, visible }`      | `undefined`  | Allows defining custom animations       |
| `transition`   | `Transition`               | `{}`         | Partial transition override             |
| `margin`       | `string`                   | `'-10% 0%'`  | Viewport margin (Intersection Observer) |
| `once`         | `boolean`                  | `true`       | Execute animation only once             |
| `execute`      | `boolean`                  | `true`       | Enable or disable animation             |
| `className`    | `string`                   | —            | CSS class                               |
| `style`        | `CSSProperties`            | —            | Inline styles                           |
| `children`     | `ReactNode`                | —            | Animated content                        |

Component extends `MotionProps` and `HTMLAttributes<HTMLDivElement>`, so it accepts any valid `motion.div` prop.

---

### Default Transition

```ts
const transitionsDefault = {
  duration: 0.6,
  delay: 0,
  ease: 'easeInOut',
};
```

The `transition` prop merges over this configuration, allowing partial overrides:

```tsx
<InViewAnimation transition={{ delay: 0.2 }}>
```

---

### Predefined Effects (IN_VIEW_ANIMATIONS)

Effects are defined as a dictionary of variants:

```ts
{
  hidden: TargetAndTransition;
  visible: TargetAndTransition;
}
```

**Included effects**:

- `fadeInUp`
- `fadeInLeft`
- `fadeInRight`
- `fadeInDown`
- `opacity`
- `imgBlur`
- `scaleX`
- `strokeLine`
- `slideInUp`
- `slideInLeftFull`
- `fadeInRightFull`

**Internal example**:

```ts
fadeInUp: {
  hidden: { y: '100px', opacity: 0 },
  visible: { y: '0%', opacity: 1 },
}
```

---

### Custom Animations

If `customEffect` is passed, it takes priority over predefined effect:

```tsx
<InViewAnimation
  customEffect={{
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
  }}
>
  Custom animation
</InViewAnimation>
```

---

### Execution Control

**`execute = false`**

Completely disables `whileInView` behavior, useful for:

- Feature flags
- Externally controlled animations
- Debugging

```tsx
<InViewAnimation execute={false}>
```

**Internally**:

- `viewport` is not set
- `whileInView` is not applied

---

### Viewport and Visibility

Uses Framer Motion API:

```ts
viewport={{
  once,
  margin,
}}
```

- `once`: prevents re-animations on scroll
- `margin`: allows triggering before or after actual viewport

---

### Component Design

✅ Stateless  
✅ Declarative  
✅ No internal hooks  
✅ Composable  
✅ Easy to extend by adding new effects

Designed as animation wrapper, not as layout or state logic.

---

### When to Use

✔ Entry animations  
✔ Landing page sections  
✔ Elements appearing on scroll  
✔ Repeatable and consistent animations

❌ Animations controlled by complex state  
❌ Choreographed sequences (use Variants directly)

---

## InViewStrokeLine

High-level component based on `InViewAnimation`, designed to render an animated separator line that draws horizontally on viewport entry.

Internally reuses the `strokeLine` effect, simulating stroke expansion behavior in X axis.

### Objective

Encapsulate a common pattern:

- Visual separators
- Animated dividing lines
- Horizontal "strokes" that draw on scroll

Avoiding repetition of:

- The `strokeLine` effect
- Accessibility roles
- Base layout classes
- Transition configuration

---

### Basic Usage

```tsx
<InViewStrokeLine />
```

Renders a horizontal line (`h-px w-full`) that:

- Starts with `scaleX: 0`
- Animates to `scaleX: 1`
- Uses `transform-origin: left center`
- Executes on viewport entry

---

### API

`InViewStrokeLine` fully extends `InViewAnimationProps`.

#### Notable Props

| Prop         | Type                   | Description                                 |
| ------------ | ---------------------- | ------------------------------------------- |
| `className`  | `string`               | Allows customizing color, height, or layout |
| `transition` | `Transition`           | Partial transition override                 |
| `...props`   | `InViewAnimationProps` | Any base component prop                     |

**Example**:

```tsx
<InViewStrokeLine className="bg-neutral-300" once={false} />
```

---

### Base Styles

```
'h-px w-full bg-red-950'
```

⚠️ **Important**

`bg-red-950` is just a placeholder example.

This background-color:

- Visually functions as a stroke
- Must be replaced by actual design color (e.g., `bg-border`, `bg-neutral-*`, `bg-accent`, etc.)

**Recommended example**:

```tsx
<InViewStrokeLine className="bg-border" />
```

---

### Applied Animation

Internally forces the effect:

```ts
effect = 'strokeLine';
```

Defined as:

```ts
hidden: {
  scaleX: 0,
  transformOrigin: 'left center',
},
visible: {
  scaleX: 1,
  transformOrigin: 'left center',
}
```

This simulates progressive stroke drawing from left to right.

---

### Transition

Base component transition:

```ts
{
  duration: 0.6,
  ease: 'easeInOut',
}
```

Any `transition` passed via props merges over this:

```tsx
<InViewStrokeLine transition={{ duration: 1 }} />
```

---

### Accessibility

Component explicitly defines:

```tsx
role="separator"
aria-label="separator"
aria-roledescription="separator"
```

Ensuring:

- Correct semantics
- Better screen reader accessibility
- Proper use as content divider

---

### Component Design

✅ Semantic wrapper  
✅ Specialization of InViewAnimation  
✅ No own animation logic  
✅ Easy to reuse and standardize

This component doesn't replace `InViewAnimation`, but acts as a frequent-use abstraction.

---

### When to Use

✔ Separators between sections  
✔ Animated dividers in landings  
✔ Decorative lines with visual intent

❌ Purely structural lines without animation  
❌ Cases where layout is not horizontal

---

## InViewHiddenText

Specialized component based on `InViewAnimation`, designed to animate text that "emerges" from below, simulating a reveal hidden by mask.

The animation combines:

- Vertical displacement
- Opacity
- Slight rotation

Achieving a text effect that reveals on viewport entry.

### Objective

Solve a common text animation pattern:

- Headlines
- Featured paragraphs
- Labels or key phrases

Where text:

- Starts hidden
- Moves upward
- Appears smoothly from container with `overflow: hidden`

---

### Recommended Usage

```tsx
<InViewHiddenText>
  <Text as="h2">Animated title</Text>
</InViewHiddenText>
```

**Design Note**

Although component accepts any `ReactNode` as children, its ideal use is with text content, preferably through the `Text` component.

Supporting any element:

- Is a versatility decision
- Does not represent the main use case

---

### API

#### Props

| Prop         | Type                   | Default                              | Description                              |
| ------------ | ---------------------- | ------------------------------------ | ---------------------------------------- |
| `children`   | `ReactNode`            | —                                    | Content to animate (ideally text)        |
| `className`  | `string`               | —                                    | Classes for wrapper and animated element |
| `transition` | `Transition`           | `{ duration: 0.6, ease: 'easeOut' }` | Animation transition                     |
| `...props`   | `InViewAnimationProps` | —                                    | Props inherited from base component      |

---

### Internal Structure

```tsx
<div className="overflow-hidden">
  <InViewAnimation />
</div>
```

**Why this wrapper?**

The outer `div` with `overflow-hidden`:

- Functions as mask
- Prevents content from being visible outside its area
- Reinforces reveal effect from below

---

### Applied Animation

Uses `customEffect`, ignoring predefined effects:

```ts
hidden: {
  y: '99%',
  opacity: 0,
  rotate: 5,
},
visible: {
  y: 0,
  opacity: 1,
  rotate: 0,
}
```

**Effect characteristics**:

- `y: '99%'` keeps content almost completely hidden
- `rotate` adds slight organic gesture
- `opacity` accompanies reveal without being main focus

---

### Viewport

```ts
margin = '0%';
```

Animation triggers exactly when element enters viewport, without artificial advances or delays.

---

### Transition

By default:

```ts
{
  duration: 0.6,
  ease: 'easeOut',
}
```

Can be overridden:

```tsx
<InViewHiddenText transition={{ duration: 0.9 }} />
```

---

### Classes and Layout

**Outer wrapper**:

```
overflow-hidden
```

**Animated element**:

```
origin-left overflow-hidden
```

These classes:

- Reinforce hiding effect
- Ensure rotation and displacement don't break layout

---

### Component Design

✅ Clear specialization of InViewAnimation  
✅ Designed for text  
✅ No duplicated logic  
✅ Declarative and reusable

Doesn't try to be a generic animation wrapper, but a concrete visual pattern.

---

### When to Use

✔ Titles and subtitles  
✔ Featured phrases  
✔ Textual content with narrative intent

❌ Complex interactive elements  
❌ Layout animations  
❌ Cases where text shouldn't be initially hidden

---

### Final Note

This component prioritizes visual consistency over absolute flexibility.

Although technically accepts any children, its intended use is clear:

**Text first, generic elements only if there's a concrete reason.**

#### Important: Use only when user requests it and do not infer that everything needs entry animations
