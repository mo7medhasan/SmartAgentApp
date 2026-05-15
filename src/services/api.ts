import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { storage } from '@store/storage';
import { STORAGE_KEYS } from '@constants/index';

// ─────────────────────────────────────────────────
// 🌐 إنشاء Axios Instance مع الإعدادات الأساسية
// ─────────────────────────────────────────────────
export const api = axios.create({
  baseURL: 'http://jsonplaceholder.typicode.com', // API تجريبي مجاني
  timeout: 10000,                                  // 10 ثواني حد أقصى
  headers: {
    'Content-Type': 'application/json',
    'Accept':       'application/json',
  },
});

// ─────────────────────────────────────────────────
// 📤 Request Interceptor
// يُضاف تلقائياً قبل كل طلب
// ─────────────────────────────────────────────────
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // جلب التوكن من MMKV وإضافته لكل طلب
    const token = storage.getString(STORAGE_KEYS.USER_TOKEN);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

// ─────────────────────────────────────────────────
// 📥 Response Interceptor
// يُعالج الاستجابة أو الخطأ تلقائياً
// ─────────────────────────────────────────────────
api.interceptors.response.use(
  (response: AxiosResponse) => response, // استجابة ناجحة — أرجعها كما هي

  (error: AxiosError) => {
    // معالجة أخطاء محددة
    if (error.response?.status === 401) {
      // توكن منتهي → امسح البيانات
      storage.remove(STORAGE_KEYS.USER_TOKEN);
      storage.remove(STORAGE_KEYS.USER_DATA);
    }

    if (error.response?.status === 500) {
      console.error('Server Error:', error.message);
    }

    return Promise.reject(error);
  },
);