import { cva, type VariantProps } from 'class-variance-authority';

export const buttonStyles = cva(
  'inline-flex items-center justify-center gap-2 font-ui font-semibold whitespace-nowrap select-none transition-[transform,background-color,box-shadow,border-color,opacity] duration-150 active:translate-y-px active:scale-[0.995] disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer',
  {
    variants: {
      variant: {
        primary:
          'bg-primary text-white border border-transparent shadow-[0_6px_16px_rgba(0,0,0,0.18)] hover:bg-primary-700 disabled:bg-muted-soft disabled:shadow-none',
        ghost:
          'bg-surface text-ink border border-line shadow-bingo-sm hover:border-ink/30 hover:bg-paper',
        quiet:
          'bg-transparent text-primary border border-transparent hover:bg-primary-tint',
        danger:
          'bg-transparent text-daub-deep border border-daub/30 hover:bg-daub-tint hover:border-daub/60',
      },
      size: {
        md: 'h-[52px] px-5 text-base rounded-[14px]',
        lg: 'h-[58px] px-6 text-[17px] rounded-2xl',
        sm: 'h-[42px] px-4 text-sm rounded-xl',
      },
      block: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      block: false,
    },
  },
);

export type ButtonVariants = VariantProps<typeof buttonStyles>;
