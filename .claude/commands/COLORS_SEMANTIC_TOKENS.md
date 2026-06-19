**Objective:**
Modify `src/styles/semantic-tokens/colors.css` to generate CSS custom properties within an `@theme {}` block, designed for Tailwind CSS theming. These new properties will serve as semantic tokens that reference a base set of color variables.

**Input Context:**
Assume that a base set of CSS custom color variables has already been defined in the `:root`. These base variables follow the pattern `--[colorName]-[intensity]` (e.g., `--neutral-50`, `--red-100`, `--mango-500`).

The color families and their intensities to be processed are the `[colorName]` part of the pattern inside the `:root` variables already set.
**Output Requirements:**

1.  **`@theme` Block:**
    - All generated CSS custom properties MUST be enclosed within a single `@theme {}` block.

2.  **CSS Custom Property Definitions (Color Tokens):**
    - Override any existing CSS variables already in the file. You can erase them.
    - CSS variables will be defined in a single `:root {}` selector block in `src/styles/foundations/colors.css`. These are the variables that you need to reference in the new CSS custom properties.
    - For each color and intensity specified in the "Input Context":
      - Create a new CSS custom property.
      - The naming convention for this new property MUST be `--color-[colorName]-[intensity]` (e.g., `--color-neutral-50`, `--color-red-100`, `--color-mango-500`) or `--color-[colorName]-[intensity]-[percentageValue]` (e.g., `--color-neutral-50-6`, `--color-red-100-15`, `--color-mango-500-6`).
      - The value of this new custom property MUST be a `var()` function referencing the corresponding base color variable. For example, `--color-neutral-50` should have the value `var(--neutral-50)` or `--color-neutral-50-6` should have the value `var(--neutral-50-6)`.
    - Group related color tokens (e.g., all "neutral" color tokens, all "red" color tokens) together using CSS comments (e.g., `/* Neutral Color Tokens */`).

**Example of Desired Output Structure (Conceptual):**

all the colors and their intensities are examples, you only need to use the ones in the foundations/colors.css file

```css
@theme {
  /* Neutral Color Tokens */
  --color-neutral-50: var(--neutral-50);
  --color-neutral-100: var(--neutral-100);
  /* ... more neutral color tokens ... */
  --color-neutral-900: var(--neutral-900);

  /* Red Color Tokens */
  --color-red-50: var(--red-50);
  --color-red-100: var(--red-100);
  /* ... more red color tokens ... */
  --color-red-900: var(--red-900);

  /* Mango Color Tokens */
  --color-mango-50: var(--mango-50);
  --color-mango-100: var(--mango-100);
  /* ... more mango color tokens ... */
  --color-mango-900: var(--mango-900);
}
```

Task:
Generate the complete CSS output for the @theme block according to all the instructions above, covering all specified neutral, red, and mango colors and their intensities. Ensure the output is well-formatted and directly usable.
