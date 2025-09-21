import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => Promise<void>;
  loadStoredAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: true,

  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  setLoading: (loading) => set({ isLoading: loading }),

  logout: async () => {
    await AsyncStorage.multiRemove(['user', 'token']);
    set({ user: null, token: null });
  },

  loadStoredAuth: async () => {
    try {
      const [storedUser, storedToken] = await AsyncStorage.multiGet(['user', 'token']);
      if (storedUser[1] && storedToken[1]) {
        set({
          user: JSON.parse(storedUser[1]),
          token: storedToken[1],
        });
      }
    } catch (error) {
      console.error('Error loading stored auth:', error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
