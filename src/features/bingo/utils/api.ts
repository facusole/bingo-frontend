import { apiBase } from '@/common/utils/config';

export interface CreateRoomResponse {
  id: string;
  shortCode: string;
  adminToken: string;
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

export async function createRoom(adminName: string): Promise<CreateRoomResponse> {
  const res = await fetch(`${apiBase()}/rooms`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ adminName }),
  });

  const body = (await res.json().catch(() => null)) as {
    id?: string;
    shortCode?: string;
    adminToken?: string;
    error?: string;
  } | null;

  if (!res.ok) {
    throw new ApiError(body?.error ?? `HTTP ${res.status}`, res.status);
  }
  if (!body?.id || !body.adminToken || !body.shortCode) {
    throw new ApiError('Malformed response from backend', 500);
  }

  return { id: body.id, shortCode: body.shortCode, adminToken: body.adminToken };
}
