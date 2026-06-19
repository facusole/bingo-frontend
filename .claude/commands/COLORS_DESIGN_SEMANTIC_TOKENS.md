# Standardized Prompt for Generating Tailwind Semantic Color Tokens from CSS tokens list

**Objective:**
To take a list of semantic color token declarations in CSS format and generate the complete content for the `src/styles/semantic-tokens/colors.css` file, ensuring all properties are correctly formatted within an `@theme` block.

**LLM Task:**

You will be provided with a list of CSS custom properties (semantic tokens). Your sole task is to take this list and format it for use in a CSS file. The main objective is the correct structuring and formatting of the provided code, not modifying the variable names or values.

**Detailed Instructions:**

Input: You will receive a plain text list with CSS variable declarations. Each line will contain a complete declaration, for example: `--text-primary: var(--color-grey-950);.`

**Processing:**

- You must add `--color-` prefix before the variable names (`e.g., --color-text-primary`).

- You must map to the correct color inside `/styles/foundations/colors.css` `:root{}` block and alter the assigned var() values (e.g., `var(--color-neongreen-900)` to `var(--neon-green-900)`).

- Your only task is to wrap the entire list of declarations within a `@theme { ... }` block.

**Output Format:**

- The final result should be the complete content for the `src/styles/semantic-tokens/colors.css` file.

- All provided CSS declarations must be inside a single `@theme { ... }` block.

- Each declaration must be on its own line.

- Each declaration within the `@theme` block should be indented (for example, with two spaces) to improve readability.

**Execution Example:**

**Given the following plain text input:**

```css
--text-primary: var(--color-grey-950);
--bg-primary-inverse: var(--color-grey-900);
--stroke-interactive-brand-primary: var(--color-neongreen-500);
```

**The generated result should be:**

```css
@theme {
  --color-text-primary: var(--grey-950);
  --color-bg-primary-inverse: var(--grey-900);
  --color-stroke-interactive-brand-primary: var(--neongreen-500);
}
```
