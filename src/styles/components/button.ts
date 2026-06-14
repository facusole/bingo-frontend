import { cva } from 'class-variance-authority';

const commonClassnames = [
  'px-4',
  'py-2',
  'inline-flex',
  'items-center',
  'justify-center',
  'hover:cursor-pointer',
  'rounded-md',
];

export const buttonVariants = cva(commonClassnames, {
  variants: {
    variant: {
      primary: 'bg-blue-700 text-white hover:bg-blue-900 disabled:bg-gray-400 ',
      secondary: 'border border-blue-700 bg-transparent text-blue-700 hover:bg-blue-50',
      ghost: 'bg-transparent p-0',
    },
    size: {
      sm: 'px-2.5 py-1.5 text-xs',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
      intrinsic: 'fit-content',
      fullWidth: 'w-full',
    },
    loading: {
      true: 'cursor-wait',
    },
  },
  compoundVariants: [
    {
      variant: 'primary',
      loading: true,
      className: 'bg-blue-700 hover:cursor-wait hover:bg-blue-700',
    },
    {
      variant: 'secondary',
      loading: true,
      className:
        "text-transparent before:absolute before:inset-0 before:flex before:animate-spin before:items-center before:justify-center before:rounded-full before:border-4 before:border-current before:border-t-transparent before:content-['']",
    },
  ],
  defaultVariants: {
    variant: 'primary',
    size: 'intrinsic',
    loading: false,
  },
});
