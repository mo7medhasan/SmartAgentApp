import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  FlatList, Image, Alert, ActivityIndicator,
  Dimensions,
} from 'react-native';
import { COLORS, FONT_SIZES } from '@constants/index';
import { useImagePicker, SelectedImage } from '@hooks/useImagePicker';

const { width } = Dimensions.get('window');
const IMAGE_SIZE = (width - 48) / 3; // 3 صور في الصف

const CameraScreen = (): React.JSX.Element => {
  const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(null);

  const {
    images,
    isLoading,
    openCamera,
    openGallery,
    removeImage,
    clearImages,
  } = useImagePicker();

  // ── خيارات الصورة عند الضغط عليها ───────────
  const handleImagePress = (image: SelectedImage) => {
    setSelectedImage(image);
    Alert.alert(
      '📸 خيارات الصورة',
      image.name,
      [
        {
          text: '🔍 عرض',
          onPress: () => setSelectedImage(image),
        },
        {
          text: '🗑️ حذف',
          style: 'destructive',
          onPress: () => {
            removeImage(image.uri);
            if (selectedImage?.uri === image.uri) {
              setSelectedImage(null);
            }
          },
        },
        { text: 'إلغاء', style: 'cancel' },
      ],
    );
  };

  // ── عنصر الصورة في القائمة ───────────────────
  const renderImage = ({ item }: { item: SelectedImage }) => (
    <TouchableOpacity
      style={styles.imageThumbnail}
      onPress={() => handleImagePress(item)}
      activeOpacity={0.8}>

      <Image
        source={{ uri: item.uri }}
        style={styles.thumbnailImg}
        resizeMode="cover"
      />

      {/* زر حذف سريع */}
      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={() => removeImage(item.uri)}>
        <Text style={styles.deleteBtnText}>✕</Text>
      </TouchableOpacity>

    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>

      {/* ── عرض الصورة الكاملة ─────────────── */}
      {selectedImage ? (
        <View style={styles.previewContainer}>
          <Image
            source={{ uri: selectedImage.uri }}
            style={styles.previewImage}
            resizeMode="contain"
          />

          {/* معلومات الصورة */}
          <View style={styles.imageInfo}>
            <Text style={styles.imageInfoText}>
              📐 {selectedImage.width} × {selectedImage.height}
            </Text>
            <Text style={styles.imageInfoText}>
              💾 {(selectedImage.fileSize / 1024).toFixed(1)} KB
            </Text>
          </View>

          {/* زر إغلاق المعاينة */}
          <TouchableOpacity
            style={styles.closePreview}
            onPress={() => setSelectedImage(null)}>
            <Text style={styles.closePreviewText}>✕</Text>
          </TouchableOpacity>
        </View>

      ) : (

        // ── الشاشة الرئيسية ────────────────────
        <>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>📷 الكاميرا</Text>
            {images.length > 0 && (
              <TouchableOpacity onPress={clearImages}>
                <Text style={styles.clearText}>مسح الكل</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* قائمة الصور */}
          {images.length > 0 ? (
            <FlatList
              data={images}
              keyExtractor={(item) => item.uri}
              renderItem={renderImage}
              numColumns={3}             // 3 صور في الصف
              contentContainerStyle={styles.imagesList}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            // حالة لا توجد صور
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🖼️</Text>
              <Text style={styles.emptyTitle}>لا توجد صور</Text>
              <Text style={styles.emptySubtitle}>
                التقط صورة أو اختر من المعرض
              </Text>
            </View>
          )}
        </>
      )}

      {/* ── أزرار التحكم ──────────────────── */}
      {!selectedImage && (
        <View style={styles.controls}>

          {/* زر الكاميرا */}
          <TouchableOpacity
            style={[styles.btn, styles.cameraBtn]}
            onPress={openCamera}
            disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <>
                <Text style={styles.btnIcon}>📸</Text>
                <Text style={styles.btnText}>التقاط صورة</Text>
              </>
            )}
          </TouchableOpacity>

          {/* زر المعرض */}
          <TouchableOpacity
            style={[styles.btn, styles.galleryBtn]}
            onPress={openGallery}
            disabled={isLoading}>
            <Text style={styles.btnIcon}>🖼️</Text>
            <Text style={[styles.btnText, { color: COLORS.primary }]}>
              من المعرض
            </Text>
          </TouchableOpacity>

        </View>
      )}

      {/* عدد الصور */}
      {images.length > 0 && !selectedImage && (
        <Text style={styles.counter}>
          {images.length} صورة محفوظة
        </Text>
      )}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 48,
    backgroundColor: COLORS.white,
    elevation: 2,
  },
  title: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  clearText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.danger,
    fontWeight: 'bold',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyIcon:     { fontSize: 64, marginBottom: 16 },
  emptyTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.gray,
    textAlign: 'center',
  },
  imagesList: {
    padding: 12,
    gap: 4,
  },
  imageThumbnail: {
    width:        IMAGE_SIZE,
    height:       IMAGE_SIZE,
    margin:       2,
    borderRadius: 8,
    overflow:     'hidden',
  },
  thumbnailImg: {
    width:  '100%',
    height: '100%',
  },
  deleteBtn: {
    position:        'absolute',
    top:             4,
    right:           4,
    width:           20,
    height:          20,
    borderRadius:    10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent:  'center',
    alignItems:      'center',
  },
  deleteBtnText: {
    color:    COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  previewContainer: {
    flex: 1,
    backgroundColor: COLORS.black,
    justifyContent: 'center',
  },
  previewImage: {
    width:  '100%',
    height: '80%',
  },
  imageInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    padding: 12,
  },
  imageInfoText: {
    color:    COLORS.white,
    fontSize: FONT_SIZES.sm,
  },
  closePreview: {
    position:        'absolute',
    top:             48,
    right:           16,
    width:           36,
    height:          36,
    borderRadius:    18,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent:  'center',
    alignItems:      'center',
  },
  closePreviewText: {
    color:      COLORS.white,
    fontSize:   18,
    fontWeight: 'bold',
  },
  controls: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    backgroundColor: COLORS.white,
    elevation: 8,
  },
  btn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  cameraBtn: {
    backgroundColor: COLORS.primary,
  },
  galleryBtn: {
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  btnIcon: { fontSize: 20 },
  btnText: {
    color:      COLORS.white,
    fontSize:   FONT_SIZES.md,
    fontWeight: 'bold',
  },
  counter: {
    textAlign:       'center',
    padding:         8,
    fontSize:        FONT_SIZES.xs,
    color:           COLORS.gray,
    backgroundColor: COLORS.white,
  },
});

export default CameraScreen;