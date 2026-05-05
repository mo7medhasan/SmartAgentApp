import React, { useState } from 'react';
import {
  View, Text, StyleSheet,
  TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { COLORS, FONT_SIZES } from '@constants/index';
import { useAuthStore } from '@store/index';        // ← Zustand Store
import type { User } from '../../types';

type RootStackParamList = {
  Login: undefined;
  MainTabs: undefined;
};

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

const LoginScreen = ({ navigation }: Props): React.JSX.Element => {
  const [isLoading, setIsLoading] = useState(false);

  // ✅ جلب دالة login من Zustand
  const login = useAuthStore(state => state.login);

  const handleLogin = async () => {
    setIsLoading(true);

    // محاكاة طلب API (سيُستبدل بطلب حقيقي في المرحلة الخامسة)
    await new Promise(resolve => setTimeout(() => resolve(undefined), 1500));

    // بيانات وهمية للتجربة
    const mockUser: User = {
      id:    '1',
      name:  'محمد المندوب',
      email: 'agent@example.com',
      phone: '01012345678',
      role:  'agent',
    };

    // ✅ حفظ في Zustand + MMKV تلقائياً
    login(mockUser, 'mock-token-12345');

    setIsLoading(false);
    navigation.replace('MainTabs');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🤖</Text>
      <Text style={styles.title}>المندوب الذكي</Text>
      <Text style={styles.subtitle}>سجّل دخولك للمتابعة</Text>

      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={isLoading}>
        {isLoading ? (
          <ActivityIndicator color={COLORS.white} />
        ) : (
          <Text style={styles.buttonText}>تسجيل الدخول</Text>
        )}
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
  emoji: { fontSize: 64, marginBottom: 16 },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.gray,
    marginBottom: 48,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 12,
    minWidth: 200,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
  },
});

export default LoginScreen;