import { cva } from 'class-variance-authority';

const commonClassnames = ['text-black-500'];

export const headingVariants = cva(commonClassnames, {
  variants: {
    variant: {
      'title.1': 'text-20 lg:text-45 leading-[68px] lg:leading-[140px]',
      'title.2': 'text-20 lg:text-30 leading-[68px] lg:leading-[120px]',
      'title.3': 'text-16 lg:text-25 leading-[56px] lg:leading-[80px]',
      'title.4': 'text-15 lg:text-20 leading-[52px] lg:leading-[64px]',
      'title.5': 'text-15 lg:text-16 leading-[52px] lg:leading-[52px]',
      'title.6': 'text-10 lg:text-10 leading-[36px] lg:leading-[32px]',
    },
  },
  defaultVariants: {
    variant: 'title.1',
  },
});
