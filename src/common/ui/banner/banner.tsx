import type { ReactNode } from 'react';

import { Icon, type IconName } from '@/common/ui/icon/icon';

interface Props {
  tone?: 'wait' | 'info' | 'error' | 'celebrate';
  icon?: IconName;
  children: ReactNode;
}

const TONE_TO_COLOR: Record<NonNullable<Props['tone']>, string> = {
  wait: 'var(--primary-800)',
  info: 'var(--ink)',
  error: 'var(--daub-deep)',
  celebrate: '#ffffff',
};

export function Banner({ tone = 'wait', icon, children }: Props) {
  return (
    <div className={`banner banner--${tone}`}>
      {icon ? <Icon color={TONE_TO_COLOR[tone]} name={icon} size={tone === 'celebrate' ? 22 : 17} /> : null}
      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  );
}
