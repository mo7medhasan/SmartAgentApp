import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // ✅
import AppNavigator from '@navigation/index';
import { useAppStore } from '@store/index';
import './src/locales/index';

// ✅ إنشاء QueryClient واحد للتطبيق كله
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry:     2,              // إعادة المحاولة مرتين
      staleTime: 3 * 60 * 1000, // البيانات صالحة 3 دقائق
    },
  },
});

const App = (): React.JSX.Element => {
  const isRTL     = useAppStore(state => state.isRTL);
  const fadeAnim  = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0, duration: 200, useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: isRTL ? 60 : -60, duration: 200, useNativeDriver: true,
      }),
    ]).start(() => {
      slideAnim.setValue(isRTL ? -60 : 60);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1, duration: 300, useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0, duration: 300, useNativeDriver: true,
        }),
      ]).start();
    });
  }, [fadeAnim, isRTL, slideAnim]);

  return (
    // ✅ QueryClientProvider يغلف كل التطبيق
    <QueryClientProvider client={queryClient}>
      <Animated.View
        style={[
          styles.root,
          // eslint-disable-next-line react-native/no-inline-styles
          {
            direction:  isRTL ? 'rtl' : 'ltr',
            opacity:    fadeAnim,
            transform: [{ translateX: slideAnim }],
          },
        ]}>
        <AppNavigator />
      </Animated.View>
    </QueryClientProvider>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1 },
});

export default App;