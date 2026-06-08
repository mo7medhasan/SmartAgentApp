import messaging from '@react-native-firebase/messaging';
import { Alert, Platform } from 'react-native';

export interface NotificationData {
  title: string;
  body:  string;
  data?: Record<string, string>;
}

// ─────────────────────────────────────────────────
// 🔔 طلب الإذن — محسّن
// ─────────────────────────────────────────────────
export const requestNotificationPermission =
  async (): Promise<boolean> => {

  // Android 13+ (API 33+) يحتاج إذن صريح
  if (Platform.OS === 'android') {
    const { PermissionsAndroid } = require('react-native');

    if (Platform.Version >= 33) {
      const granted = await PermissionsAndroid.request(
        'android.permission.POST_NOTIFICATIONS',
        {
          title:          '🔔 إذن الإشعارات',
          message:        'هل توافق على استقبال الإشعارات؟',
          buttonPositive: 'موافق',
          buttonNegative: 'رفض',
        },
      );

      console.log('Android Permission Result:', granted);

      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert(
          'الإشعارات مغلقة',
          'يمكنك تفعيلها من إعدادات التطبيق',
          [{ text: 'حسناً' }],
        );
        return false;
      }
    }
  }

  // طلب إذن Firebase
  const authStatus = await messaging().requestPermission({
    alert:         true,
    announcement:  false,
    badge:         true,
    carPlay:       false,
    criticalAlert: false,
    provisional:   false,
    sound:         true,
  });

  console.log('Firebase Auth Status:', authStatus);

  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  return enabled;
};

// ─────────────────────────────────────────────────
// 🔑 جلب FCM Token
// ─────────────────────────────────────────────────
export const getFCMToken = async (): Promise<string | null> => {
  try {
    const hasPermission = await requestNotificationPermission();
    if (!hasPermission) return null;

    await messaging().registerDeviceForRemoteMessages();
    const token = await messaging().getToken();

    console.log('✅ FCM Token:', token);
    return token;

  } catch (error) {
    console.error('❌ FCM Token Error:', error);
    return null;
  }
};

// ─────────────────────────────────────────────────
// 📱 إشعارات المقدمة
// ─────────────────────────────────────────────────
export const onForegroundMessage = (
  callback: (notification: NotificationData) => void,
) => {
  return messaging().onMessage(async (remoteMessage) => {
    console.log('📩 Foreground Message:', remoteMessage);

    const notification: NotificationData = {
      title: remoteMessage.notification?.title ?? 'إشعار جديد',
      body:  remoteMessage.notification?.body  ?? '',
      data:  remoteMessage.data as Record<string, string>,
    };

    callback(notification);

    Alert.alert(
      notification.title,
      notification.body,
      [{ text: 'حسناً' }],
    );
  });
};

// ─────────────────────────────────────────────────
// 🔄 إشعارات الخلفية
// ─────────────────────────────────────────────────
export const onBackgroundMessage = () => {
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log('📩 Background Message:', remoteMessage);
  });
};

export const getInitialNotification = async () => {
  const remoteMessage = await messaging().getInitialNotification();
  if (remoteMessage) {
    return {
      title: remoteMessage.notification?.title ?? '',
      body:  remoteMessage.notification?.body  ?? '',
      data:  remoteMessage.data,
    };
  }
  return null;
};