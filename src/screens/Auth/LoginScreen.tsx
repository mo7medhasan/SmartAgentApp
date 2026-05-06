import React, { useState } from 'react';
import {
  View, Text, StyleSheet,
  TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';          // ✅ i18next
import { COLORS, FONT_SIZES } from '@constants/index';
import { useAuthStore } from '@store/index';
import { User } from '../../types';

type RootStackParamList = {
  Login: undefined;
  MainTabs: undefined;
};

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

const LoginScreen = ({ navigation }: Props): React.JSX.Element => {
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();                        // ✅ دالة الترجمة
  const login  = useAuthStore(state => state.login);

  const handleLogin = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(()=>resolve(undefined), 1500));

    const mockUser: User = {
      id:    '1',
      name:  'محمد المندوب',
      email: 'agent@example.com',
      phone: '01012345678',
      role:  'agent',
    };

    login(mockUser, 'mock-token-12345');
    setIsLoading(false);
    navigation.replace('MainTabs');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🤖</Text>

      {/* ✅ النصوص من ملف الترجمة */}
      <Text style={styles.title}>{t('common.appName')}</Text>
      <Text style={styles.subtitle}>{t('auth.subtitle')}</Text>

      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={isLoading}>
        {isLoading ? (
          <ActivityIndicator color={COLORS.white} />
        ) : (
          <Text style={styles.buttonText}>{t('auth.login')}</Text>
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
  emoji:    { fontSize: 64, marginBottom: 16 },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
    textAlign: 'center',
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
  buttonDisabled: { opacity: 0.6 },
  buttonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
  },
});

export default LoginScreen;