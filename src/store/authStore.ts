import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '../types';
import { zustandMMKVStorage } from './storage';

interface AuthState {
  user:       User | null;
  token:      string | null;
  isLoggedIn: boolean;

  login:  (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  // ✅ persist = تخزين تلقائي مثل أسلوبك
  // ✅ zustandMMKVStorage = MMKV بدل AsyncStorage (أسرع + مشفّر)
  persist(
    (set, get) => ({
      user:       null,
      token:      null,
      isLoggedIn: false,

      login: (user: User, token: string) => {
        set({ user, token, isLoggedIn: true });
        // ✅ persist يحفظ تلقائياً — لا تحتاج setItem يدوي
      },

      logout: () => {
        set({ user: null, token: null, isLoggedIn: false });
        // ✅ persist يمسح تلقائياً
      },

      updateUser: (updatedFields: Partial<User>) => {
        const currentUser = get().user;
        if (!currentUser) return;
        set({ user: { ...currentUser, ...updatedFields } });
      },
    }),
    {
      name:    'auth-storage',           // اسم مفتاح التخزين
      storage: createJSONStorage(() => zustandMMKVStorage), // MMKV ⚡
    },
  ),
);