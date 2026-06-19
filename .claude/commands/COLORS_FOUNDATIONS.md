**Objective:**
Modify `src/styles/foundations/colors.css` to generate a CSS file defining a color palette as CSS custom properties.

**Input:**
You will be provided with a list of colors. Each color definition will be in the format:
`[colorName] [intensity]: [hexValue]`
(e.g., `neutral 50: #fbf7f8`, `red 600: #ae5256`)

The input list will only contain color names, intensities, and their hex values. It will not include any other semantic hints like `(primary)` or `(secondary)`.

**Output Requirements:**

1. **CSS Custom Property Definitions:**
   - All generated CSS custom properties must be enclosed within a single `:root {}` selector block. Override any existing CSS variables already in the file.
   - For each color in the provided input list:
     - Create a CSS custom property.
     - The naming convention for the property MUST be `-[colorName]-[intensity]` (e.g., `-neutral-50`, `-red-600`). Ensure the color name and intensity are exactly as derived from the input.
     - Colors could contain the word `opacity` in the name, you must remove this word inside the custom property name, it MUST be `-[colorName]-[intensity]-[percentageValue]` (e.g., `-neutral-50-15`, `-red-600-6`). Don't include the percentage sign in the CSS custom property name.
     - The value of the custom property MUST be the exact oklch code provided in the input (e.g., `oklch(1.00 0.00 0)`).
   - Group related colors (e.g., all "neutral" colors, all "red" colors) together using CSS comments (e.g., `/* Neutral Colors */`).
   - Do not add any other comments next to the individual color variable definitions (such as hints about primary or secondary usage).

**Example of Desired Output Structure:**

```css
:root {
  /* Neutral Colors */
  --neutral-50: #fbf7f8;
  --neutral-100: #f0e9ea;
  /* ... more neutral colors ... */
  --neutral-900: #170103;

  /* Red Colors */
  --red-50: #fdf0f1;
  --red-100: #f9d8da;
  /* ... more red colors ... */
  --red-900: #4e1a1d;
  --red-900-6: oklch(0.3 0.0785 19.75 / 0.06);

  /* Mango Colors */
  --mango-50: #fef9f0;
  --mango-100: #fdf0d9;
  /* ... more mango colors ... */
  --mango-900: #784410;
  --mango-900-6: oklch(0.44 0.0948 59.73 / 0.06);
}
```

Task:
You will now be given a specific list of colors. Apply all the instructions above to that list and generate the complete CSS output. Ensure the output is well-formatted, directly usable, and strictly adheres to the structure shown in the example.

**List of colors to generate should be provided with this command**
