import localFont from 'next/font/local';

export const HelveticaNeue = localFont({
  src: [
    {
      path: '../../../public/fonts/HelveticaNeue.woff2',
      weight: '400',
    },

    {
      path: '../../../public/fonts/HelveticaNeue-Medium.woff2',
      weight: '500',
    },

    {
      path: '../../../public/fonts/HelveticaNeue-Bold.woff2',
      weight: '700',
    },
  ],
  variable: '--font-primary',
});

export const NeuePlakCompBold = localFont({
  src: '../../../public/fonts/NeuePlakCompBold.woff2',
  display: 'swap',
  variable: '--font-secondary',
});
