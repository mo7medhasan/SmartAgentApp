import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet,
  TouchableOpacity, ActivityIndicator,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Circle } from 'react-native-maps';
import { COLORS, FONT_SIZES } from '@constants/index';
import { useLocation } from '@hooks/useLocation';

const MapScreen = (): React.JSX.Element => {
  const mapRef = useRef<MapView>(null);
  const [isTracking, setIsTracking] = useState(false);

  const {
    location,
    isLoading,
    error,
    getLocation,
    watchLocation,
    stopWatching,
  } = useLocation();

  // جلب الموقع عند فتح الشاشة
  useEffect(() => {
    getLocation();
  }, [getLocation]);

  // ── التحريك للموقع الحالي ─────────────────────
  const moveToLocation = () => {
    if (!location || !mapRef.current) return;
    mapRef.current.animateToRegion({
      latitude:       location.latitude,
      longitude:      location.longitude,
      latitudeDelta:  0.005, // مستوى التقريب
      longitudeDelta: 0.005,
    }, 1000); // مدة الـ animation بالمللي ثانية
  };

  // ── تبديل تتبع الموقع ─────────────────────────
  const toggleTracking = () => {
    if (isTracking) {
      stopWatching();
    } else {
      watchLocation();
    }
    setIsTracking(!isTracking);
  };
  // ── شاشة التحميل ──────────────────────────────
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>جاري تحديد موقعك...</Text>
      </View>
    );
  }

  // ── شاشة الخطأ ────────────────────────────────
  if (error && !location) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorIcon}>📍</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={getLocation}>
          <Text style={styles.retryText}>إعادة المحاولة</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      {/* ── الخريطة ─────────────────────────── */}
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}    // استخدام Google Maps
        showsUserLocation={true}      // نقطة الموقع الزرقاء
        showsMyLocationButton={false} // نخفي الزر الافتراضي
        initialRegion={
          location
            ? {
                latitude:       location.latitude,
                longitude:      location.longitude,
                latitudeDelta:  0.01,
                longitudeDelta: 0.01,
              }
            : {
                // القاهرة كموقع افتراضي
                latitude:       30.0444,
                longitude:      31.2357,
                latitudeDelta:  0.05,
                longitudeDelta: 0.05,
              }
        }>

        {/* ── Marker موقعك الحالي ───────────── */}
        {location && (
          <Marker
            coordinate={{
              latitude:  location.latitude,
              longitude: location.longitude,
            }}
            title="موقعك الحالي"
            description={`دقة: ${location.accuracy?.toFixed(0)} متر`}
            pinColor={COLORS.primary}>
          </Marker>
        )}

        {/* ── دائرة حول موقعك ──────────────── */}
        {location && (
          <Circle
            center={{
              latitude:  location.latitude,
              longitude: location.longitude,
            }}
            radius={location.accuracy ?? 50}
            fillColor="rgba(37, 99, 235, 0.1)"
            strokeColor="rgba(37, 99, 235, 0.3)"
            strokeWidth={1}
          />
        )}

      </MapView>

      {/* ── معلومات الموقع ────────────────── */}
      {location && (
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>📍 موقعك الحالي</Text>
          <Text style={styles.infoText}>
            خط العرض:  {location.latitude.toFixed(6)}
          </Text>
          <Text style={styles.infoText}>
            خط الطول:  {location.longitude.toFixed(6)}
          </Text>
          <Text style={styles.infoAccuracy}>
            الدقة: {location.accuracy?.toFixed(0)} متر
          </Text>
        </View>
      )}

      {/* ── أزرار التحكم ─────────────────── */}
      <View style={styles.controls}>

        {/* زر موقعي */}
        <TouchableOpacity
          style={styles.controlBtn}
          onPress={moveToLocation}>
          <Text style={styles.controlIcon}>🎯</Text>
        </TouchableOpacity>

        {/* زر التتبع */}
        <TouchableOpacity
          style={[
            styles.controlBtn,
            isTracking && styles.trackingActive,
          ]}
          onPress={toggleTracking}>
          <Text style={styles.controlIcon}>
            {isTracking ? '⏹️' : '▶️'}
          </Text>
        </TouchableOpacity>

        {/* زر تحديث */}
        <TouchableOpacity
          style={styles.controlBtn}
          onPress={getLocation}>
          <Text style={styles.controlIcon}>🔄</Text>
        </TouchableOpacity>

      </View>

      {/* مؤشر التتبع */}
      {isTracking && (
        <View style={styles.trackingBadge}>
          <View style={styles.trackingDot} />
          <Text style={styles.trackingText}>جاري التتبع...</Text>
        </View>
      )}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,                          // الخريطة تملأ الشاشة
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    color: COLORS.gray,
    fontSize: FONT_SIZES.md,
  },
  errorIcon: { fontSize: 48, marginBottom: 12 },
  errorText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.danger,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  infoCard: {
    position: 'absolute',       // فوق الخريطة
    top: 16,
    left: 16,
    right: 16,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 12,
    elevation: 4,
  },
  infoTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  infoText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.black,
  },
  infoAccuracy: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray,
    marginTop: 4,
  },
  controls: {
    position: 'absolute',       // فوق الخريطة يمين
    right: 16,
    bottom: 100,
    gap: 8,
  },
  controlBtn: {
    width: 48,
    height: 48,
    backgroundColor: COLORS.white,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  trackingActive: {
    backgroundColor: COLORS.primary,
  },
  controlIcon: {
    fontSize: 20,
  },
  trackingBadge: {
    position: 'absolute',
    bottom: 24,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
    elevation: 4,
  },
  trackingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.white,
  },
  trackingText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.sm,
    fontWeight: 'bold',
  },
});

export default MapScreen;