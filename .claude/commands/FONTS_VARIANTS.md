# Standardized Prompt for Updating CVA Typography Variants from CSS tokens list

**Part 1: Generating the tokens:**
**Objective:**
To process a plain text list containing semantic typography tokens for both Desktop and Mobile modes. The goal is to generate the complete CSS content for the src/styles/semantic-tokens/text.css file, placing all variables into a single :root block with device-specific suffixes (-dk for desktop, -mb for mobile).

**LLM Task:**

You will be provided with a plain text input that contains two lists of CSS custom properties, one for "Desktop" and one for "Mobile". Your task is to parse these lists, apply specific transformation rules to the properties, append the correct device suffix to each variable name, and format the final output into a single CSS file.

**Detailed Instructions:**

1. **Input Format**
   You will receive a plain text input containing two sections, identified by the headers Desktop and Mobile. Each section contains a single line of semicolon-separated CSS variable declarations.

Example Input Snippet:

- Desktop
  `--fontsize-title-1: var(--text-fontsizes-64);--lineheight-title-1: var(--text-fontsizes-64);`
- Mobile
  `--fontsize-title-1: var(--text-fontsizes-48);--lineheight-title-1: var(--text-fontsizes-48);`

2. Processing Rules
   For each variable in both the Desktop and Mobile lists, you must perform the following transformations:

a. Suffixes - For every variable from the Desktop list, append the suffix -dk to its name.

    - For every variable from the Mobile list, append the suffix -mb to its name.=

b. Font Size (--fontsize-\*) - Name: Rename the property by replacing --fontsize- with --text-. Then, append the device suffix (-dk or -mb).

    - Value: Take the numeric value from the var() function (e.g., 64 from var(--text-fontsizes-64)), divide it by 4, and create a new var() reference in the format var(--text-[result]).

    - Example (Desktop): `--fontsize-title-1: var(--text-fontsizes-64)`; becomes `--text-title-1-dk: var(--text-16);`.

    - Example (Mobile): `--fontsize-title-1: var(--text-fontsizes-48)`; becomes `--text-title-1-mb: var(--text-12);`.

c. Line Height (--lineheight-\*) - Name: Rename the property by replacing --lineheight with --leading. Then, append the device suffix (-dk or -mb).

    - Value: Replace the var() function with a direct pixel value. The numeric value is the one from the original var().

    - Example (Desktop): --lineheight-body-2: var(--text-fontsizes-20); becomes --leading-body-2-dk: 20px;.

3. Output Format
   The final result must be the complete content for the src/styles/semantic-tokens/text.css file, structured as follows:

All processed variables (both desktop and mobile) MUST be placed inside a single `@theme { ... }` block IN THE ROUTE `styles/semantic-tokens/font.css`. Don't override anything that's in there and you MUST group them by type, so text with texts and leading with leadings.

Each CSS declaration must be on its own line and properly indented.

Execution Example
Given the following input:

Desktop
--fontfamily-primary: "Inter";--fontsize-title-4: var(--text-fontsizes-32);--lineheight-title-4: var(--text-fontsizes-36);
Mobile
--fontsize-title-4: var(--text-fontsizes-28);--lineheight-title-4: var(--text-fontsizes-32);

The generated result should be:

```css
@theme {
  --text-title-4-dk: var(--text-8);
  --leading-title-4-dk: 36px;
  --text-title-4-mb: var(--text-7);
  --leading-title-4-mb: 32px;
}
```

**Part 2: Updating the CVA File (e.g., heading.ts)**
**Objective:**
To automatically update the Tailwind CSS classes for typography variants in a CVA file based on the tokens generated in Part 1.

1. Input for CVA Task
   The full content of the target CVA configuration file (e.g., heading.ts).

The full content of the src/styles/semantic-tokens/text.css file generated in Part 1.

2. Processing Rules for CVA File
   a. Identify Variants
   - Parse the text.css file and identify all unique variant identifiers. The identifier is the part of the variable name between the prefix (--text- or --leading-) and the suffix (-dk or -mb).

   - Example: From --text-title-1-dk and --leading-title-1-mb, the identifier is title-1.

b. Update variants.variant Object - For each unique variant identifier found:

    - Transform Key: Convert the identifier into the CVA key format by replacing hyphens (-) with dots (.). (e.g., `title-1` becomes `title.1`).

    - Construct Class String: Create a new mobile-first Tailwind CSS class string. The class names are derived directly from the CSS variable names by dropping the -- prefix.

    - Format: 'text-[identifier]-mb leading-[identifier]-mb lg:text-[identifier]-dk lg:leading-[identifier]-dk'

    - Example for title-1: 'text-title-1-mb leading-title-1-mb lg:text-title-1-dk lg:leading-title-1-dk'

**Update CVA File:**
In the `variants.variant` object of the CVA file, find the transformed key (`e.g., 'title.1'`). Completely overwrite its existing value with the newly constructed class string. If the key does not exist, add it.

c. Preserve File Structure
All other parts of the CVA file (imports, commonClassnames, defaultVariants, etc.) must be preserved.

Any variant key that exists in the CVA file but does not have a corresponding identifier in the text.css file must remain unchanged.

**TOKENS TO PROCESS SHOULD BE PROVIDED WITH THIS COMMAND**

**EXAMPLE TOKENS:**

```css
Desktop
--fontfamily-primary: "Farnham Headline";
--fontfamily-secondary: "Neue Haas Grotesk Display Pro";
--fontfamily-secondary-body: "Neue Haas Grotesk Text Pro";
--fontfamily-tertiary: "EngraversGothicBold";
--fontweight-regular: var(--text-fontweight&styles-regular-font-weight-regular);
--fontweight-55roman: var(--text-fontweight&styles-regular-font-weight-regular-roman);
--fontsize-display-display-large: var(--text-fontsizes-92);
--fontweight-bold: var(--text-fontweight&styles-regular-font-weight-regular-bold);
--fontsize-display-display-medium: var(--text-fontsizes-56);
--fontsize-display-display-small: var(--text-fontsizes-52);
--fontweight-light: var(--text-fontweight&styles-regular-font-weight-regular-light);
--fontweight-semilight: var(--text-fontweight&styles-regular-font-weight-regular-semilight);
--fontweight-italic: var(--text-fontweight&styles-italic-font-weight-italic-regular);
--fontweight-bold-italic: var(--text-fontweight&styles-italic-font-weight-italic-bold);
--fontweight-medium: var(--text-fontweight&styles-regular-font-weight-regular-medium);
--fontsize-h1-h1-large: var(--text-fontsizes-100);
--fontsize-h1-h1-medium: var(--text-fontsizes-64);
--fontsize-subtitle-subtitle-large: var(--text-fontsizes-44);
--fontsize-subtitle-subtitle-medium: var(--text-fontsizes-40);
--fontsize-subtitle-subtitle-small: var(--text-fontsizes-32);
--fontsize-subtitle-subtitle-xsmall: var(--text-fontsizes-20);
--fontsize-body-body-large: var(--text-fontsizes-20);
--fontsize-body-body-medium: var(--text-fontsizes-18);
--fontsize-body-body-small: var(--text-fontsizes-16);
--fontsize-body-body-xsmall: var(--text-fontsizes-14);
--fontsize-button-button-large: var(--text-fontsizes-20);
--fontsize-tag-tag-medium: var(--text-fontsizes-16);
--fontsize-tab-tab-large: var(--text-fontsizes-20);
--fontsize-button-button-medium: var(--text-fontsizes-18);
--fontsize-button-button-small: var(--text-fontsizes-16);
--lineheight-display-display-large: var(--text-fontsizes-96);
--lineheight-display-display-medium: var(--text-fontsizes-52);
--lineheight-display-display-small: var(--text-fontsizes-52);
--lineheight-h1-h1-large: var(--text-fontsizes-92);
--lineheight-h1-h1-medium: var(--text-fontsizes-68);
--lineheight-subtitle-subtitle-large: var(--text-fontsizes-48);
--lineheight-subtitle-subtitle-medium: var(--text-fontsizes-44);
--lineheight-subtitle-subtitle-small: var(--text-fontsizes-36);
--lineheight-subtitle-subtitle-xsmall: var(--text-fontsizes-24);
--lineheight-body-body-large: var(--text-fontsizes-28);
--lineheight-body-body-medium: var(--text-fontsizes-28);
--lineheight-body-body-medium2: var(--text-fontsizes-28);
--lineheight-body-body-small: var(--text-fontsizes-24);
--lineheight-body-body-xsmall: var(--text-fontsizes-16);
--lineheight-button-button-large: var(--text-fontsizes-24);
--lineheight-button-button-medium: var(--text-fontsizes-20);
--lineheight-button-button-small: var(--text-fontsizes-18);
--lineheight-tag-tag-medium: var(--text-fontsizes-20);
--lineheight-tab-tab-large: var(--text-fontsizes-24);
Mobile
--fontfamily-primary: "Farnham Headline";
--fontfamily-secondary: "Neue Haas Grotesk Display Pro";
--fontfamily-secondary-body: "Neue Haas Grotesk Text Pro";
--fontfamily-tertiary: "EngraversGothicBold";
--fontweight-regular: var(--text-fontweight&styles-regular-font-weight-regular);
--fontweight-55roman: var(--text-fontweight&styles-regular-font-weight-regular-roman);
--fontsize-display-display-large: var(--text-fontsizes-45);
--fontweight-bold: var(--text-fontweight&styles-regular-font-weight-regular-bold);
--fontsize-display-display-medium: var(--text-fontsizes-40);
--fontsize-display-display-small: var(--text-fontsizes-36);
--fontweight-light: var(--text-fontweight&styles-regular-font-weight-regular-light);
--fontweight-semilight: var(--text-fontweight&styles-regular-font-weight-regular-semilight);
--fontweight-italic: var(--text-fontweight&styles-italic-font-weight-italic-regular);
--fontweight-bold-italic: var(--text-fontweight&styles-italic-font-weight-italic-bold);
--fontweight-medium: var(--text-fontweight&styles-regular-font-weight-regular-medium);
--fontsize-h1-h1-large: var(--text-fontsizes-48);
--fontsize-h1-h1-medium: var(--text-fontsizes-40);
--fontsize-subtitle-subtitle-large: var(--text-fontsizes-32);
--fontsize-subtitle-subtitle-medium: var(--text-fontsizes-28);
--fontsize-subtitle-subtitle-small: var(--text-fontsizes-24);
--fontsize-subtitle-subtitle-xsmall: var(--text-fontsizes-18);
--fontsize-body-body-large: var(--text-fontsizes-18);
--fontsize-body-body-medium: var(--text-fontsizes-16);
--fontsize-body-body-small: var(--text-fontsizes-14);
--fontsize-body-body-xsmall: var(--text-fontsizes-12);
--fontsize-button-button-large: var(--text-fontsizes-20);
--fontsize-tag-tag-medium: var(--text-fontsizes-14);
--fontsize-tab-tab-large: var(--text-fontsizes-20);
--fontsize-button-button-medium: var(--text-fontsizes-18);
--fontsize-button-button-small: var(--text-fontsizes-16);
--lineheight-display-display-large: var(--text-fontsizes-48);
--lineheight-display-display-medium: var(--text-fontsizes-40);
--lineheight-display-display-small: var(--text-fontsizes-36);
--lineheight-h1-h1-large: var(--text-fontsizes-52);
--lineheight-h1-h1-medium: var(--text-fontsizes-40);


```
