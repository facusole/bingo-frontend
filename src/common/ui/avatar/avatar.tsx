import { avatarColor, initials } from '@/features/bingo/utils/avatar-color';

interface Props {
  name: string;
  size?: 'md' | 'lg';
}

export function Avatar({ name, size = 'md' }: Props) {
  return (
    <div
      className={`avatar${size === 'lg' ? ' avatar--lg' : ''}`}
      style={{ background: avatarColor(name) }}
    >
      {initials(name)}
    </div>
  );
}
