import { Slot } from '@radix-ui/react-slot';
import { forwardRef, type ButtonHTMLAttributes } from 'react';

import { cn } from '@/lib/utils';
import { Icon, type IconName } from '@/common/ui/icon/icon';

import { buttonStyles, type ButtonVariants } from './button.styles';

type Props = ButtonHTMLAttributes<HTMLButtonElement> &
  ButtonVariants & {
    asChild?: boolean;
    icon?: IconName;
    iconRight?: IconName;
  };

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { variant, size, block, asChild, icon, iconRight, children, className, ...rest },
  ref,
) {
  const Comp = asChild ? Slot : 'button';
  const iconSize = size === 'sm' ? 16 : 19;

  return (
    <Comp
      ref={ref}
      className={cn(buttonStyles({ variant, size, block }), className)}
      {...rest}
    >
      {icon ? <Icon name={icon} size={iconSize} /> : null}
      {children}
      {iconRight ? <Icon name={iconRight} size={iconSize} /> : null}
    </Comp>
  );
});
