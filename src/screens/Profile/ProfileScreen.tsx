import React from 'react';
import {
  View, Text, StyleSheet,
  TouchableOpacity, Switch,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { COLORS, FONT_SIZES } from '@constants/index';
import { useAuthStore, useAppStore } from '@store/index';
import { storage } from '@store/storage';
import { STORAGE_KEYS } from '@constants/index';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = (): React.JSX.Element => {
  const { t, i18n } = useTranslation();
  const user        = useAuthStore(state => state.user);
  const logout      = useAuthStore(state => state.logout);
  const setLanguage = useAppStore(state => state.setLanguage);
  const navigation  = useNavigation<any>();

  const isArabic = i18n.language === 'ar';

  // ── تبديل اللغة فوراً ─────────────────────────
  const toggleLanguage = () => {
    const newLang  = isArabic ? 'en' : 'ar';

    // 1. حفظ في MMKV
    storage.set(STORAGE_KEYS.LANGUAGE, newLang);

    // 2. تحديث Zustand — يغير isRTL فوراً → App.tsx يعيد الرسم
    setLanguage(newLang);

    // 3. تحديث i18next — يغير النصوص فوراً
    i18n.changeLanguage(newLang);
  };

  // ── تسجيل الخروج ──────────────────────────────
  const handleLogout = () => {
    logout();
    navigation.reset({
      index:  0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <View style={styles.container}>

      <Text style={styles.avatar}>👤</Text>
      <Text style={styles.name}>{user?.name ?? t('common.loading')}</Text>
      <Text style={styles.email}>{user?.email ?? ''}</Text>
      <Text style={styles.role}>
        {user?.role ? t(`profile.roles.${user.role}`) : ''}
      </Text>

      {/* كارت تغيير اللغة */}
      <View style={styles.languageCard}>
        <Text style={styles.languageLabel}>{t('profile.language')}</Text>

        <View style={styles.languageRow}>
          <Text style={styles.languageValue}>
            {isArabic ? '🇸🇦 ' + t('profile.arabic') : '🇺🇸 ' + t('profile.english')}
          </Text>

          {/* ✅ تبديل فوري بدون restart */}
          <Switch
            value={!isArabic}
            onValueChange={toggleLanguage}
            trackColor={{
              false: COLORS.primary,
              true:  COLORS.secondary,
            }}
            thumbColor={COLORS.white}
          />
        </View>
      </View>

      {/* زر تسجيل الخروج */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}>
        <Text style={styles.logoutText}>🚪 {t('auth.logout')}</Text>
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  avatar: { fontSize: 80, marginBottom: 16 },
  name: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 4,
  },
  email: {
    fontSize: FONT_SIZES.md,
    color: COLORS.gray,
    marginBottom: 8,
  },
  role: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.white,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 32,
  },
  languageCard: {
    width: '100%',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    elevation: 2,
  },
  languageLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray,
    marginBottom: 8,
  },
  languageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  languageValue: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  logoutButton: {
    borderWidth: 2,
    borderColor: COLORS.danger,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  logoutText: {
    color: COLORS.danger,
    fontSize: FONT_SIZES.md,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;