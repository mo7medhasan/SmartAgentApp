import { useState, useEffect, useCallback } from 'react';
import Geolocation from '@react-native-community/geolocation';
import { PermissionsAndroid, Platform, Alert } from 'react-native';
import type { Location } from '../types';

// ─────────────────────────────────────────────────
// 📘 نوع بيانات الـ Hook
// ─────────────────────────────────────────────────
interface UseLocationReturn {
  location:       Location | null;  // الموقع الحالي
  isLoading:      boolean;          // جاري تحديد الموقع؟
  error:          string | null;    // رسالة الخطأ
  getLocation:    () => void;       // جلب الموقع يدوياً
  watchLocation:  () => void;       // تتبع الموقع باستمرار
  stopWatching:   () => void;       // إيقاف التتبع
}

// ─────────────────────────────────────────────────
// 🗺️ Hook الموقع الجغرافي
// ─────────────────────────────────────────────────
export const useLocation = (): UseLocationReturn => {
  const [location,  setLocation]  = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error,     setError]     = useState<string | null>(null);
  const [watchId,   setWatchId]   = useState<number | null>(null);

  // ── طلب إذن الموقع من المستخدم ────────────────
  const requestPermission = async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title:   'إذن الموقع',
          message: 'التطبيق يحتاج إذن الوصول لموقعك',
          buttonPositive: 'موافق',
          buttonNegative: 'رفض',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true; // iOS يطلب الإذن تلقائياً
  };

  // ── جلب الموقع مرة واحدة ──────────────────────
  const getLocation = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const hasPermission = await requestPermission();
    if (!hasPermission) {
      setError('تم رفض إذن الموقع');
      setIsLoading(false);

      Alert.alert(
        'إذن مرفوض',
        'يرجى تفعيل إذن الموقع من إعدادات الهاتف',
        [{ text: 'حسناً' }],
      );
      return;
    }

    Geolocation.getCurrentPosition(
      (position) => {
        // ✅ نجح — حفظ الموقع
        setLocation({
          latitude:  position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy:  position.coords.accuracy,
          timestamp: position.timestamp,
        });
        setIsLoading(false);
      },
      (err) => {
        // ❌ فشل — حفظ الخطأ
        setError(`فشل تحديد الموقع: ${err.message}`);
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,  // دقة عالية (GPS)
        timeout:            15000, // 15 ثانية حد أقصى
        maximumAge:         10000, // قبول موقع محفوظ عمره 10 ثواني
      },
    );
  }, []);

  // ── تتبع الموقع باستمرار ───────────────────────
  const watchLocation = useCallback(async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    const id = Geolocation.watchPosition(
      (position) => {
        setLocation({
          latitude:  position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy:  position.coords.accuracy,
          timestamp: position.timestamp,
        });
        setError(null);
      },
      (err) => {
        setError(`خطأ في التتبع: ${err.message}`);
      },
      {
        enableHighAccuracy: true,
        distanceFilter:     10,   // تحديث كل 10 أمتار
        interval:           5000, // تحديث كل 5 ثواني
      },
    );

    setWatchId(id); // حفظ الـ ID لإيقاف التتبع لاحقاً
  }, []);

  // ── إيقاف التتبع ──────────────────────────────
  const stopWatching = useCallback(() => {
    if (watchId !== null) {
      Geolocation.clearWatch(watchId);
      setWatchId(null);
    }
  }, [watchId]);

  // ── تنظيف عند الخروج من الشاشة ───────────────
  useEffect(() => {
    return () => {
      if (watchId !== null) {
        Geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  return {
    location,
    isLoading,
    error,
    getLocation,
    watchLocation,
    stopWatching,
  };
};