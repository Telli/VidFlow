import { create } from 'zustand';

export interface User {
  id: string;
  email: string;
  name: string;
  plan: 'free' | 'pro' | 'team' | 'enterprise';
}

interface UserState {
  user: User | null;
  accessToken: string | null;
  setAuth: (user: User, token: string) => void;
  clear: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  accessToken: null,
  setAuth: (user, token) => {
    localStorage.setItem('vf_access_token', token);
    set({ user, accessToken: token });
  },
  clear: () => {
    localStorage.removeItem('vf_access_token');
    set({ user: null, accessToken: null });
  },
}));
