// ✅ V4: استخدم createMMKV بدل new MMKV
import { createMMKV } from 'react-native-mmkv';
import { StateStorage } from 'zustand/middleware';

// ─────────────────────────────────────────────────
// ⚡ إنشاء MMKV Instance — V4 API الجديد
// ─────────────────────────────────────────────────
export const storage = createMMKV({
  id:            'smart-agent-storage',
  encryptionKey: 'smart-agent-key',   // ✅ تشفير
});

// ─────────────────────────────────────────────────
// 🔌 Zustand Storage Adapter
// يجعل MMKV يعمل مع persist middleware
// ─────────────────────────────────────────────────
export const zustandMMKVStorage: StateStorage = {
  getItem: (key: string): string | null => {
    return storage.getString(key) ?? null;
  },
  setItem: (key: string, value: string): void => {
    storage.set(key, value);
  },
  removeItem: (key: string): void => {
    storage.remove(key);
  },
};