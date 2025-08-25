import axios from 'axios';

export const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || '').replace(/\/$/, '');

export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: false
});

export const tokenStore = {
  get access() { try { return localStorage.getItem('access_token') || null; } catch { return null; } },
  set access(v: string | null) { try { v ? localStorage.setItem('access_token', v) : localStorage.removeItem('access_token'); } catch {} },
  get refresh() { try { return localStorage.getItem('refresh_token') || null; } catch { return null; } },
  set refresh(v: string | null) { try { v ? localStorage.setItem('refresh_token', v) : localStorage.removeItem('refresh_token'); } catch {} },
};

api.interceptors.request.use((config) => {
  const t = tokenStore.access;
  if (t) {
    config.headers = config.headers || {};
    (config.headers as any)['Authorization'] = `Bearer ${t}`;
  }
  
  if (!config.headers['Content-Type']) {
      (config.headers as any)['Content-Type'] = 'application/json';
  }
  
  return config;
});

let refreshing: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  if (!tokenStore.refresh) return null;
  if (!refreshing) {
    refreshing = axios.post(`${API_BASE.replace(/\/$/,'')}/token/refresh/`, { refresh: tokenStore.refresh })
      .then((res) => {
        const newAccess = res.data?.access;
        if (newAccess) tokenStore.access = newAccess;
        return newAccess || null;
      })
      .catch(() => null)
      .finally(() => { refreshing = null; });
  }
  return refreshing;
}

api.interceptors.response.use(
  (resp) => resp,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const newAccess = await refreshAccessToken();
      if (newAccess) {
        original.headers = original.headers || {};
        original.headers['Authorization'] = `Bearer ${newAccess}`;
        return api(original);
      } else {
        tokenStore.access = null;
        tokenStore.refresh = null;
      }
    }
    return Promise.reject(error);
  }
);

export async function signIn(usernameOrEmail: string, password: string) {
  const res = await axios.post(`${API_BASE}/token/`, { username: usernameOrEmail, password }, { headers: { 'Content-Type': 'application/json' } });
  const { access, refresh } = res.data;
  tokenStore.access = access;
  tokenStore.refresh = refresh;
  return { access, refresh };
}

export function signOut() {
  tokenStore.access = null;
  tokenStore.refresh = null;
}

export async function getMe() {
  try {
    // --- CORRECTION : Ajout d'un paramètre pour éviter la mise en cache ---
    const res = await api.get(`/client/me/?_=${new Date().getTime()}`);
    return res.data || null;
  } catch {
    return null;
  }
}

export async function createAffiliate(clientId: number) {
  const res = await api.post('/affilies/create/', { client_id: clientId });
  return res.data;
}