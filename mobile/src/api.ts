const API_BASE = 'http://10.0.2.2:5000';

type ApiRequestOptions = {
  method?: string;
  token?: string;
  body?: unknown;
};

export async function apiRequest(path: string, { method = 'GET', token, body }: ApiRequestOptions = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    ...(body ? { body: JSON.stringify(body) } : {})
  });

  if (response.status === 204) {
    return null;
  }

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
}
