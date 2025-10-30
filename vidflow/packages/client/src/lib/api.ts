import { useUserStore } from '../store/user';

const API_URL = import.meta.env.VITE_API_URL as string;

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = useUserStore.getState().accessToken || localStorage.getItem('vf_access_token');
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    credentials: 'include',
  });
  if (!res.ok) {
    const msg = await tryParseMessage(res);
    throw new Error(msg || `Request failed: ${res.status}`);
  }
  return res.json();
}

async function tryParseMessage(res: Response): Promise<string | null> {
  try {
    const body = await res.json();
    if (body?.message) return body.message as string;
  } catch {}
  return null;
}

export async function streamSSE(path: string, body: unknown, onMessage: (data: any) => void) {
  const token = useUserStore.getState().accessToken || localStorage.getItem('vf_access_token');
  const headers = new Headers({ 'Content-Type': 'application/json' });
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
    credentials: 'include',
  });
  if (!res.ok || !res.body) throw new Error(`Stream failed: ${res.status}`);

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const parts = buffer.split('\n\n');
    buffer = parts.pop() || '';
    for (const part of parts) {
      if (part.startsWith('data: ')) {
        const payload = part.slice(6);
        try {
          onMessage(JSON.parse(payload));
        } catch {}
      }
    }
  }
}
