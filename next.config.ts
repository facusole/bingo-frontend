import type { NextConfig } from 'next';

import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Hosts/IPs the dev server trusts for HMR + RSC + Server-Action requests.
  // Next 16 blocks anything outside this list in dev mode, which is why a
  // browser hitting `192.168.0.10:3000` without this would fail to hydrate.
  // This option is dev-only — `next build`/`next start` ignore it.
  allowedDevOrigins: ['localhost', '127.0.0.1', '192.168.0.10'],
};

export default withNextIntl(nextConfig);
