function rawApiBase(): string {
  const fromEnv = process.env.NEXT_PUBLIC_API_BASE;
  if (fromEnv && fromEnv.length > 0) {
    return fromEnv.replace(/\/+$/, '');
  }
  return 'http://localhost:8080';
}

export function apiBase(): string {
  return rawApiBase();
}

export function wsBase(): string {
  const base = rawApiBase();
  if (base.startsWith('https://')) return 'wss://' + base.slice('https://'.length);
  if (base.startsWith('http://')) return 'ws://' + base.slice('http://'.length);
  return base;
}
