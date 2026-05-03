 
// ─────────────────────────────────────────
// 🛠️ دوال مساعدة عامة
// ─────────────────────────────────────────

export const formatDate = (date: Date, locale: 'ar' | 'en' = 'ar'): string => {
    return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-EG' : 'en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
    }).format(date);
  };
  
  export const delay = (ms: number): Promise<void> =>
    new Promise(resolve => setTimeout(resolve, ms));
  
  export const isEmpty = (value: unknown): boolean => {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string') return value.trim().length === 0;
    if (Array.isArray(value)) return value.length === 0;
    return false;
  };