const AVATAR_COLORS = [
  '#4338ca',
  '#5b52c9',
  '#6e63e6',
  '#3f51b5',
  '#5c6bc0',
  '#574b90',
  '#4a4e69',
  '#6d597a',
  '#2d2688',
  '#7a6fec',
] as const;

export function avatarColor(name: string): string {
  let h = 0;

  for (let i = 0; i < name.length; i++) {
    h = (h * 31 + name.charCodeAt(i)) >>> 0;
  }

  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/);

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
