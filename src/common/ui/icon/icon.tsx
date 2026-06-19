import type { ReactElement } from 'react';

export type IconName =
  | 'copy'
  | 'check'
  | 'play'
  | 'megaphone'
  | 'crown'
  | 'arrowRight'
  | 'exit'
  | 'refresh'
  | 'close'
  | 'plus'
  | 'users'
  | 'grid'
  | 'link'
  | 'clock'
  | 'menu';

interface Props {
  name: IconName;
  size?: number;
  stroke?: number;
  color?: string;
  className?: string;
}

export function Icon({ name, size = 20, stroke = 2, color = 'currentColor', className }: Props) {
  const p = {
    fill: 'none',
    stroke: color,
    strokeWidth: stroke,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  const paths: Record<IconName, ReactElement> = {
    copy: (
      <>
        <rect x="9" y="9" width="11" height="11" rx="2.5" {...p} />
        <path d="M5 15V6a2 2 0 0 1 2-2h8" {...p} />
      </>
    ),
    check: <path d="M4 12l5 5L20 6" {...p} />,
    play: (
      <path
        d="M7 5l11 7-11 7V5z"
        fill={color}
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    ),
    megaphone: (
      <>
        <path d="M4 10v4a1 1 0 0 0 1 1h2l5 4V5L7 9H5a1 1 0 0 0-1 1z" {...p} />
        <path d="M16 8.5a4 4 0 0 1 0 7" {...p} />
      </>
    ),
    crown: (
      <path
        d="M4 8l3.5 3L12 5l4.5 6L20 8l-1.5 9h-13L4 8z"
        fill={color}
        stroke={color}
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    ),
    arrowRight: <path d="M5 12h14M13 6l6 6-6 6" {...p} />,
    exit: (
      <>
        <path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4" {...p} />
        <path d="M9 12h11M16 8l4 4-4 4" {...p} />
      </>
    ),
    refresh: (
      <>
        <path d="M4 12a8 8 0 0 1 13.7-5.6L20 8" {...p} />
        <path d="M20 4v4h-4" {...p} />
        <path d="M20 12a8 8 0 0 1-13.7 5.6L4 16" {...p} />
        <path d="M4 20v-4h4" {...p} />
      </>
    ),
    close: <path d="M6 6l12 12M18 6L6 18" {...p} />,
    plus: <path d="M12 5v14M5 12h14" {...p} />,
    users: (
      <>
        <circle cx="9" cy="8" r="3" {...p} />
        <path d="M3 19a6 6 0 0 1 12 0" {...p} />
        <path d="M16 6a3 3 0 0 1 0 6M15 19a6 6 0 0 1 6-6" {...p} />
      </>
    ),
    grid: (
      <>
        <rect x="4" y="4" width="6" height="6" rx="1.4" {...p} />
        <rect x="14" y="4" width="6" height="6" rx="1.4" {...p} />
        <rect x="4" y="14" width="6" height="6" rx="1.4" {...p} />
        <rect x="14" y="14" width="6" height="6" rx="1.4" {...p} />
      </>
    ),
    link: (
      <>
        <path d="M9 15l6-6" {...p} />
        <path d="M11 7l1-1a4 4 0 0 1 6 6l-1 1" {...p} />
        <path d="M13 17l-1 1a4 4 0 0 1-6-6l1-1" {...p} />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="8" {...p} />
        <path d="M12 8v4l3 2" {...p} />
      </>
    ),
    menu: (
      <>
        <path d="M4 7h16" {...p} />
        <path d="M4 12h16" {...p} />
        <path d="M4 17h16" {...p} />
      </>
    ),
  };

  return (
    <svg
      aria-hidden="true"
      className={className}
      height={size}
      style={{ display: 'block', flexShrink: 0 }}
      viewBox="0 0 24 24"
      width={size}
    >
      {paths[name]}
    </svg>
  );
}
