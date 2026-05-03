 
// ─────────────────────────────────────────
// 📦 ثوابت المشروع العامة
// ─────────────────────────────────────────

export const APP_NAME = 'تطبيق المندوب الذكي';
export const APP_VERSION = '1.0.0';

// مفاتيح التخزين المحلي — ستُستخدم مع MMKV لاحقاً
export const STORAGE_KEYS = {
  USER_TOKEN: 'user_token',
  USER_DATA:  'user_data',
  LANGUAGE:   'app_language',
  THEME:      'app_theme',
} as const;

// ألوان التطبيق الأساسية
export const COLORS = {
  primary:    '#2563EB',
  secondary:  '#10B981',
  danger:     '#EF4444',
  warning:    '#F59E0B',
  background: '#F9FAFB',
  white:      '#FFFFFF',
  black:      '#111827',
  gray:       '#6B7280',
} as const;

// أحجام الخط
export const FONT_SIZES = {
  xs:  10,
  sm:  12,
  md:  14,
  lg:  16,
  xl:  20,
  xxl: 24,
} as const;