 
// ─────────────────────────────────────────
// 📘 الأنواع العامة المشتركة
// ─────────────────────────────────────────

export interface User {
    id:      string;
    name:    string;
    email:   string;
    phone?:  string;
    avatar?: string;
    role:    'agent' | 'manager' | 'admin';
  }
  
  export interface Location {
    latitude:   number;
    longitude:  number;
    accuracy?:  number;
    timestamp?: number;
  }
  
  export interface ApiResponse<T> {
    data:       T;
    message:    string;
    success:    boolean;
    statusCode: number;
  }
  
  export interface ApiError {
    message:    string;
    statusCode: number;
    errors?:    Record<string, string[]>;
  }
  
  export type AppLanguage = 'ar' | 'en';
  export type AppTheme    = 'light' | 'dark';