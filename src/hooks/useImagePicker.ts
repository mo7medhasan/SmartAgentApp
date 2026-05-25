import { useState } from 'react';
import {
  launchCamera,
  launchImageLibrary,
  ImagePickerResponse,
  Asset,
} from 'react-native-image-picker';
import { Alert, PermissionsAndroid, Platform } from 'react-native';

// ─────────────────────────────────────────────────
// 📘 نوع بيانات الصورة المختارة
// ─────────────────────────────────────────────────
export interface SelectedImage {
  uri:      string;   // مسار الصورة
  name:     string;   // اسم الملف
  type:     string;   // نوع الملف (image/jpeg)
  fileSize: number;   // حجم الملف بالبايت
  width:    number;   // عرض الصورة
  height:   number;   // ارتفاع الصورة
}

// ─────────────────────────────────────────────────
// 📸 Hook الكاميرا وصور المعرض
// ─────────────────────────────────────────────────
export const useImagePicker = () => {
  const [images,    setImages]    = useState<SelectedImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // ── طلب إذن الكاميرا ──────────────────────────
  const requestCameraPermission = async (): Promise<boolean> => {
    if (Platform.OS !== 'android') return true;

    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title:          'إذن الكاميرا',
        message:        'التطبيق يحتاج إذن الوصول للكاميرا',
        buttonPositive: 'موافق',
        buttonNegative: 'رفض',
      },
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  };

  // ── تحويل Asset لـ SelectedImage ──────────────
  const assetToImage = (asset: Asset): SelectedImage => ({
    uri:      asset.uri      ?? '',
    name:     asset.fileName ?? `photo_${Date.now()}.jpg`,
    type:     asset.type     ?? 'image/jpeg',
    fileSize: asset.fileSize ?? 0,
    width:    asset.width    ?? 0,
    height:   asset.height   ?? 0,
  });

  // ── معالجة الاستجابة ──────────────────────────
  const handleResponse = (response: ImagePickerResponse) => {
    setIsLoading(false);

    if (response.didCancel) return;      // المستخدم ألغى

    if (response.errorCode) {
      Alert.alert('خطأ', response.errorMessage ?? 'حدث خطأ');
      return;
    }

    if (response.assets && response.assets.length > 0) {
      const newImages = response.assets.map(assetToImage);
      setImages(prev => [...prev, ...newImages]); // ✅ إضافة للقائمة
    }
  };

  // ── فتح الكاميرا ──────────────────────────────
  const openCamera = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Alert.alert('إذن مرفوض', 'يرجى تفعيل إذن الكاميرا من الإعدادات');
      openCamera(); // إعادة المحاولة

      return;
    }

    setIsLoading(true);
    launchCamera(
      {
        mediaType:         'photo',
        quality:           0.8,    // جودة 80%
        saveToPhotos:      true,   // حفظ في المعرض
        includeBase64:     false,  // لا نحتاج Base64
        maxWidth:          1920,   // عرض أقصى
        maxHeight:         1080,   // ارتفاع أقصى
      },
      handleResponse,
    );
  };

  // ── فتح معرض الصور ────────────────────────────
  const openGallery = async () => {
    setIsLoading(true);
    launchImageLibrary(
      {
        mediaType:      'photo',
        quality:        0.8,
        selectionLimit: 5,         // أقصى 5 صور
        includeBase64:  false,
      },
      handleResponse,
    );
  };

  // ── حذف صورة ──────────────────────────────────
  const removeImage = (uri: string) => {
    setImages(prev => prev.filter(img => img.uri !== uri));
  };

  // ── مسح كل الصور ──────────────────────────────
  const clearImages = () => setImages([]);

  return {
    images,
    isLoading,
    openCamera,
    openGallery,
    removeImage,
    clearImages,
  };
};