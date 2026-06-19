import type { ReactNode } from 'react';

import './globals.css';

/** Pass-through. The real <html>/<body>/fonts/locale-provider live in
 *  app/[locale]/layout.tsx, where the locale is resolved by next-intl. */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
