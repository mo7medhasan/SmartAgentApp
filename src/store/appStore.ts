import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandMMKVStorage } from './storage';
import type { AppLanguage, AppTheme } from '../types';

interface AppState {
  language: AppLanguage;
  theme:    AppTheme;
  isRTL:    boolean;

  setLanguage: (lang: AppLanguage) => void;
  setTheme:    (theme: AppTheme) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      language: 'ar',
      theme:    'light',
      isRTL:    true,

      setLanguage: (lang: AppLanguage) => {
        set({ language: lang, isRTL: lang === 'ar' });
      },

      setTheme: (theme: AppTheme) => {
        set({ theme });
      },
    }),
    {
      name:    'app-storage',
      storage: createJSONStorage(() => zustandMMKVStorage),
    },
  ),
);