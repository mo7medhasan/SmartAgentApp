import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { I18nManager } from 'react-native';

// ── استيراد ملفات الترجمة ─────────────────────
import ar from './ar.json';
import en from './en.json';

// ── استيراد التخزين ───────────────────────────
import { storage } from '@store/storage';
import { STORAGE_KEYS } from '@constants/index';

// ─────────────────────────────────────────────────
// 📖 قراءة اللغة المحفوظة من MMKV
// ─────────────────────────────────────────────────
const savedLanguage = storage.getString(STORAGE_KEYS.LANGUAGE) ?? 'ar';

// ─────────────────────────────────────────────────
// ⚙️ إعداد i18next
// ─────────────────────────────────────────────────
i18n
  .use(initReactI18next) // ربط i18next مع React
  .init({
    // ملفات الترجمة
    resources: {
      ar: { translation: ar },
      en: { translation: en },
    },

    // اللغة الافتراضية من التخزين أو العربية
    lng: savedLanguage,

    // اللغة الاحتياطية إذا لم توجد ترجمة
    fallbackLng: 'ar',

    // تعطيل interpolation escaping (آمن في React Native)
    interpolation: {
      escapeValue: false,
    },

    // تفعيل التوافق مع React
    compatibilityJSON: 'v4',
  });

// ─────────────────────────────────────────────────
// 🔄 تطبيق RTL/LTR عند تغيير اللغة
// ─────────────────────────────────────────────────
i18n.on('languageChanged', (lang: string) => {
  const isRTL = lang === 'ar';

  // تحديث اتجاه التطبيق
  if (I18nManager.isRTL !== isRTL) {
    I18nManager.forceRTL(isRTL);
  }
});

export default i18n;