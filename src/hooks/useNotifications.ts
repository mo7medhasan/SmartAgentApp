import { useState, useEffect } from 'react';
import {
  requestNotificationPermission,
  getFCMToken,
  onForegroundMessage,
  onBackgroundMessage,
  getInitialNotification,
  NotificationData,
} from '@services/notificationService';
import { storage } from '@store/storage';

export const useNotifications = () => {
  const [fcmToken,         setFcmToken]         = useState<string | null>(null);
  const [hasPermission,    setHasPermission]    = useState(false);
  const [notifications,    setNotifications]    = useState<NotificationData[]>([]);
  const [lastNotification, setLastNotification] = useState<NotificationData | null>(null);
  const [isInitialized,    setIsInitialized]    = useState(false);

  useEffect(() => {
    initNotifications();

    const unsubscribe = onForegroundMessage((notification) => {
      setLastNotification(notification);
      setNotifications(prev => [notification, ...prev]);
    });

    onBackgroundMessage();

    return () => unsubscribe();
  }, []);

  const initNotifications = async () => {
    try {
      console.log('🔔 بدء تهيئة الإشعارات...');

      // ✅ طلب الإذن أولاً
      const permitted = await requestNotificationPermission();
      console.log('Permission granted:', permitted);
      setHasPermission(permitted);

      if (!permitted) {
        console.log('❌ الإذن مرفوض');
        setIsInitialized(true);
        return;
      }

      // ✅ جلب الـ Token
      const token = await getFCMToken();
      if (token) {
        setFcmToken(token);
        storage.set('fcm_token', token);
        console.log('✅ Token محفوظ');
      }

      // ✅ إشعار فتح التطبيق
      const initial = await getInitialNotification();
      if (initial) {
        setLastNotification(initial);
      }

      setIsInitialized(true);
      console.log('✅ تهيئة الإشعارات اكتملت');

    } catch (error) {
      console.error('❌ خطأ في تهيئة الإشعارات:', error);
      setIsInitialized(true);
    }
  };

  const clearNotifications = () => setNotifications([]);

  return {
    fcmToken,
    hasPermission,
    notifications,
    lastNotification,
    isInitialized,
    clearNotifications,
  };
};