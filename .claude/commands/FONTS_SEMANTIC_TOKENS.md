**Project Context & Assumptions:**

- You are working with a project structure that includes:
  - `src/styles/foundations/fonts.ts`: This file is assumed to export font configurations. It's expected that these are set up using a library like `@next/font` (or a similar utility).
  - For each exported font, `(e.g., export const HelveticaNeue = ...;, export const NeuePlakCompBold = ...;)`, it's assumed:
    1.  The exported constant name (e.g., `HelveticaNeue`, `NeuePlakCompBold`) will be referred to as the `<fontKey>`.
    2.  Each font object `<fontKey>` has a `.variable` property (e.g., `HelveticaNeue.variable`). This property holds a string value that is both a CSS class name and the name of a CSS custom property defined by the font loader (e.g., `'--font-helvetica'`, `'--font-neue'`). Applying this class makes the corresponding CSS variable available. Ensure is all lowercase.
- `src/app/layout.tsx`: This is the main layout file where global styles and font classes should be applied.
- `src/styles/semantic-tokens/fonts.css`: This file will define font tokens for Tailwind's `@theme` system.

**Your Tasks:**

You need to generate instructions or code modifications for two separate but related tasks:

**Task 1: Integrating Font Variables into `src/app/layout.tsx`**

- **Objective:** To ensure that the CSS custom properties defined by your font configurations in `fonts.ts` are applied globally in your application.
- **Instructions for LLM (or to perform):**
  1.  Identify all font configurations exported from `src/styles/foundations/fonts.ts`. For this case, the relevant` <fontKey>s` are `HelveticaNeue` and `NeuePlakCompBold`.
  2.  In the `src/app/layout.tsx` file:
      a. Import the exported font configurations from `src/styles/foundations/fonts.ts`.
      b. Locate the root element of your layout (typically `<html>` or `<body>`).
      c. Collect all the `.variable` properties from your imported font objects (e.g., `HelveticaNeue.variable`, `NeuePlakCompBold.variable`).
      d. Concatenate these values into a single string variable inside `const fonts` (e.g., `const fonts = \${HelveticaNeue.variable} ${NeuePlakCompBold.variable}`);
      e. Add this concatenated string of class names to the `className` attribute of the root layout element. For example:

      ```tsx
      // Example snippet for layout.tsx
      import { HelveticaNeue, NeuePlakCompBold } from '@/styles/foundations/fonts'; // Adjust path as needed

      export default function RootLayout({ children }: { children: React.ReactNode }) {
        const fonts = `${HelveticaNeue.variable} ${NeuePlakCompBold.variable}`; // Collect font variables

        return (
          <html lang="en" className={fonts}>
            {' '}
            {/* Apply font classes here */}
            <body>{children}</body>
          </html>
        );
      }
      ```

**Task 2: Defining Semantic Font Tokens in `src/styles/semantic-tokens/font.css`**

- **Objective:** To create semantic font tokens within Tailwind's `@theme` system, which reference the actual CSS font variables made available by the font configurations.
- **Instructions for LLM (or to perform):**
  1.  Identify all font configurations exported from `src/styles/foundations/fonts.ts`. Let each exported font configuration be identified by its export name, `<fontKey>` (e.g., `HelveticaNeue`, `NeuePlakCompBold`).
  2.  In the file `src/styles/semantic-tokens/fonts.css`, create or modify the `@theme {}` block.
  3.  For each `<fontKey>` identified:
      a. You will define a new CSS custom property (a semantic token).
      b. The name of this new token MUST follow the pattern: `--font-<fontKey.variable>`.
      c. The value of this token MUST be `var(--font-<fontKey.variable>), <default-font-stack>;`. This assumes that your font setup in `fonts.ts` (via `<fontKey>.variable`) ultimately defines a CSS variable named `--font-<fontKey>`.
      d. Replace `<default-font-stack>` with an appropriate generic font family fallback based on the nature of the font (e.g., `sans-serif` for Inter, `monospace` for Roboto Mono, `serif` for a serif font).
  4.  The resulting structure within `src/styles/semantic-tokens/fonts.css` should look like this:

      ```css
      /* src/styles/semantic-tokens/fonts.css */
      @theme {
        /* Example for a 'primary' font (likely sans-serif) */
        --font-primary: var(--font-primary), sans-serif;

        /* Example for a 'mono' font (monospace) */
        --font-mono: var(--font-mono), monospace;

        /* Add entries for all other <fontKey>s from your fonts.ts following this pattern */
      }
      ```
