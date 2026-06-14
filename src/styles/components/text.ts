import { cva } from 'class-variance-authority';

const commonClassnames = ['text-black-500'];

export const textVariants = cva(commonClassnames, {
  variants: {
    variant: {
      'subtitle.1': 'text-4 lg:text-4 leading-[22px] lg:leading-[22px]',
      'subtitle.2': 'text-3.5 lg:text-3.5 leading-[16px] lg:leading-[16px]',
      'body.1': 'text-6 lg:text-6 leading-[36px] lg:leading-[36px]',
      'body.2': 'text-5 lg:text-5 leading-[32px] lg:leading-[32px]',
      'body.3': 'text-4 lg:text-4 leading-[24px] lg:leading-[24px]',
      'button.1': 'text-4 lg:text-4 leading-[22px] lg:leading-[22px]',
      eyebrow: 'text-4 lg:text-4 leading-[18px] lg:leading-[18px]',
      'detail.1': 'text-4 lg:text-4 leading-[18px] lg:leading-[18px]',
      'detail.2': 'text-3.5 lg:text-3.5 leading-[18px] lg:leading-[16px]',
    },
  },
  defaultVariants: {
    variant: 'body.1',
  },
});
