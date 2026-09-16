import { User } from './authSlice';

const AUTH_KEY = 'sellora_auth';

export interface StoredAuth {
  user: User;
  accessToken: string;
}

export function saveAuth(auth: StoredAuth) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
}

export function getAuth(): StoredAuth | null {
  const data = localStorage.getItem(AUTH_KEY);

  if (!data) {
    return null;
  }

  return JSON.parse(data);
}

export function clearAuth() {
  localStorage.removeItem(AUTH_KEY);
}