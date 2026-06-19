/**
 * Token store — keyed by the URL short code (not the UUID).
 *
 * Rationale: on a hard refresh of `/room/<CODE>` the client only has the
 * short code; the UUID arrives later (in the snapshot). The token must be
 * retrievable by the code at (re)connect time, before any server message.
 */

function key(code: string): string {
  return `bingo:token:${code.toUpperCase()}`;
}

export function getToken(code: string): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(key(code));
  } catch {
    return null;
  }
}

export function setToken(code: string, token: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key(code), token);
  } catch {
    // ignore — private mode / quota
  }
}

export function clearToken(code: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(key(code));
  } catch {
    // ignore
  }
}
