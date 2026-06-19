import type { ReactNode } from 'react';

import { Icon, type IconName } from '@/common/ui/icon/icon';

interface Props {
  title?: ReactNode;
  icon?: IconName;
  live?: boolean;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function Panel({ title, icon, live, action, children, className }: Props) {
  return (
    <section className={`surface p-4 ${className ?? ''}`.trim()}>
      {(title || action) && (
        <div className="mb-3 flex items-center justify-between">
          <div className="text-muted flex items-center gap-2 whitespace-nowrap text-xs font-semibold uppercase tracking-wide">
            {live ? (
              <span className="pulse-live" />
            ) : icon ? (
              <Icon color="var(--muted)" name={icon} size={15} />
            ) : null}
            {title}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}
