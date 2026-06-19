---
name: custom_carousel
description: Internal carousel component based on Embla with compound architecture, navigation, pagination variants, and responsive sizing via CSS variables.
applyIntelligently: true
installation: pnpx @androbinco/library-cli add carousel
---

### Note: When installed, component should be found at src/components/carousel. Check if it exists before running command.

## 1. General Architecture

Carousel component is based on Embla library and follows Compound Component architecture, exported via barrel.

### Base Hierarchy

```tsx
<Carousel.Root></Carousel.Root>
<Carousel.Slides></Carousel.Slides>
<Carousel.Slide></Carousel.Slide>
```

### Auxiliary Components

```tsx
<Carousel.Navigation></Carousel.Navigation>
<Carousel.PrevButton></Carousel.PrevButton>
<Carousel.NextButton></Carousel.NextButton>
<Carousel.Pagination></Carousel.Pagination>
```

---

## 2. Carousel.Root

### Responsibilities

- Functions as main carousel wrapper
- Provides CarouselProvider (context)
- Defines functional scope of all internal components
- Provides root div for layout

### Key Props

**`options`**:

- Passed directly to Embla (`EmblaOptionsType`)

**`className`**:

- Exclusive use for layout and wrapper spacing

📌 **Carousel.Root does not render Embla, only configures and encapsulates the carousel**

---

## 3. Carousel.Slides

### Responsibilities

- Renders Embla instance via `useEmblaCarousel`
- Only place where Embla is initialized
- Defines:
  - Container with `overflow-hidden`
  - Internal flex wrapper for slides
- Registers `emblaApi` in context via `setEmblaApi`

### Restrictions

Carousel.Slides is used exclusively as wrapper for:

- `Carousel.Slide`

**No arbitrary content allowed inside this component**

---

## 4. Carousel.Slide

### Responsibilities

- Represents individual carousel slide
- Defines slide size via `flex` property

### Size Rule (--view-size)

In Embla, slide size is defined using:

```css
flex: 0 0 <value>;
```

To simplify and standardize usage, Carousel defines CSS variable:

```css
--view-size
```

Internally, each slide uses:

```css
flex: 0 0 var(--view-size);
```

### Usage from Tailwind

Slide size is defined from consumer, for example:

```tsx
<Carousel.Slide className="[--view-size:50%]" />
```

Supports responsive definition:

```tsx
<Carousel.Slide className="max-lg:[--view-size:90%] lg:[--view-size:70%]" />
```

📌 **`--view-size` represents percentage of visible carousel container width, not internal wrapper containing slides**

---

## 5. Pagination (Carousel.Pagination)

### Function

Renders different pagination variants based on carousel state

### Variants (type)

**`"bullet"`**

**`"progress"`**

- Has optional `effect` prop, which defines two different behaviors for progress bar

**`"number"`**

- Renders textual pagination in format: `activeIndex / totalSlides`

📌 **Pagination components can be used multiple times within same carousel if design requires it**

### Data Source

Consumes from context:

- `selectedIndex`
- `scrollSnaps`
- `onDotButtonClick`

---

## 6. Navigation (Carousel.Navigation)

### Function

Provides prev/next navigation controls via:

- A div wrapper
- Two internal buttons

Buttons use Design System `Button` component

### Carousel.PrevButton and Carousel.NextButton

In addition to `Carousel.Navigation` wrapper, these are exposed:

- `Carousel.PrevButton`
- `Carousel.NextButton`

These allow:

- Custom navigation composition
- Button placement in non-standard layouts

### Navigation Data Source

Consumes from context:

- `prevBtnDisabled`
- `nextBtnDisabled`
- `onPrevButtonClick`
- `onNextButtonClick`

---

## 7. Context (CarouselProvider)

Lives inside `Carousel.Root`

### Exposed State and Utilities

```typescript
type CarouselContextType = {
  options: EmblaOptionsType;
  emblaApi: EmblaCarouselType | undefined;
  setEmblaApi: (emblaApi: EmblaCarouselType | undefined) => void;
} & PaginationProps &
  NavigationProps;
```

Includes:

- Carousel state
- Embla API
- Navigation state and handlers
- Pagination state and handlers

📌 **Every Carousel component**:

- Must consume context
- Must not manage duplicate state

---

## Valid Usage Example (Recap)

Carousel with:

- Loop active
- Center-aligned on desktop
- Start-aligned on mobile
- Responsive slide sizing
- Navigation buttons centered to slides on desktop
- Bullet-type pagination

### Canonical Example

```tsx
<Carousel.Root
  options={{
    loop: true,
    duration: 35,
    align: 'center',
    breakpoints: {
      '(max-width: 1024px)': {
        align: 'start',
      },
    },
  }}
>
  <div className="relative w-full">
    <Carousel.Slides className="w-full gap-8 px-8" containerClassName="px-2">
      {slides.map((_, index) => (
        <Carousel.Slide key={index} className="max-lg:[--view-size:90%] lg:[--view-size:70%]">
          <Card />
        </Carousel.Slide>
      ))}
    </Carousel.Slides>
    <Carousel.Navigation className="absolute top-1/2 flex w-full -translate-y-1/2 justify-between max-lg:hidden" />
  </div>
  <Carousel.Pagination type="bullet" />
</Carousel.Root>
```

**Note**: The `<Card/>` usage is for example purposes and does not represent any particular component. It can be any element you want to display in a carousel. Additionally, the carousel is used this way as an example, but layout representation may vary as needed.
