import React from 'react';
import {
  View, Text, StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { COLORS, FONT_SIZES } from '@constants/index';
import { useAuthStore } from '@store/index';

const ProfileScreen = (): React.JSX.Element => {
  // ✅ قراءة بيانات المستخدم من Zustand
  const user   = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);

  return (
    <View style={styles.container}>
      <Text style={styles.avatar}>👤</Text>

      {/* عرض بيانات المستخدم من الـ Store */}
      <Text style={styles.name}>{user?.name ?? 'المستخدم'}</Text>
      <Text style={styles.email}>{user?.email ?? ''}</Text>
      <Text style={styles.role}>
        {user?.role === 'agent' ? '🏃 مندوب' :
         user?.role === 'manager' ? '👔 مدير' : '⚙️ مشرف'}
      </Text>

      {/* زر تسجيل الخروج */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={logout}>
        <Text style={styles.logoutText}>🚪 تسجيل الخروج</Text>
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
    marginBottom: 48,
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