import React, { useEffect, useRef } from 'react';
import {
  Animated,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppNavigator            from '@navigation/index';
import { useAppStore }         from '@store/index';
import { onBackgroundMessage } from '@services/notificationService';
import { COLORS }              from '@constants/index';
import './src/locales/index';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry:     2,
      staleTime: 3 * 60 * 1000,
    },
  },
});

const App = (): React.JSX.Element => {
  const isRTL   = useAppStore(state => state.isRTL);
  const theme   = useAppStore(state => state.theme);
  const fadeAnim = useRef(new Animated.Value(1)).current; // ✅ Fade فقط

  useEffect(() => {
    onBackgroundMessage();
  }, []);

  useEffect(() => {
    // ── Fade Out ──────────────────────────────
    Animated.timing(fadeAnim, {
      toValue:         0,    // يختفي
      duration:        250,
      useNativeDriver: true,
    }).start(() => {
      // ── Fade In بعد الاختفاء ─────────────
      Animated.timing(fadeAnim, {
        toValue:         1,  // يظهر
        duration:        350,
        useNativeDriver: true,
      }).start();
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRTL]); // ✅ يعمل فقط عند تغيير اللغة

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <StatusBar
          barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
          backgroundColor={COLORS.primary}
          translucent={false}
        />

        {/* ✅ Fade فقط — بدون translateX */}
        <Animated.View
          style={[
            styles.root,
            {
              direction: isRTL ? 'rtl' : 'ltr',
              opacity:   fadeAnim,             // ✅ فقط
            },
          ]}>
          <AppNavigator />
        </Animated.View>

      </QueryClientProvider>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1 },
});

export default App;