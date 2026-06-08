import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet,
  Animated, 
} from 'react-native';
import { COLORS, FONT_SIZES, APP_NAME, APP_VERSION } from '@constants/index';


const SplashScreen = (): React.JSX.Element => {
  const fadeAnim   = useRef(new Animated.Value(0)).current;
  const scaleAnim  = useRef(new Animated.Value(0.5)).current;
  const slideAnim  = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Animation تسلسلية
    Animated.sequence([

      // 1. ظهور الأيقونة مع تكبير
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue:         1,
          duration:        600,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue:         1,
          tension:         50,
          friction:        7,
          useNativeDriver: true,
        }),
      ]),

      // 2. ظهور النص من الأسفل
      Animated.timing(slideAnim, {
        toValue:         0,
        duration:        400,
        useNativeDriver: true,
      }),

    ]).start();
  }, [fadeAnim, scaleAnim, slideAnim]);

  return (
    <View style={styles.container}>

      {/* أيقونة التطبيق */}
      <Animated.View
        style={[
          styles.iconContainer,
          {
            opacity:   fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}>
        <Text style={styles.icon}>🤖</Text>
      </Animated.View>

      {/* اسم التطبيق */}
      <Animated.View
        style={{
          opacity:   fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}>
        <Text style={styles.appName}>{APP_NAME}</Text>
        <Text style={styles.tagline}>المندوب الذكي في جيبك</Text>
      </Animated.View>

      {/* رقم الإصدار */}
      <Animated.Text style={[styles.version, { opacity: fadeAnim }]}>
        v{APP_VERSION}
      </Animated.Text>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex:            1,
    backgroundColor: COLORS.primary,
    justifyContent:  'center',
    alignItems:      'center',
  },
  iconContainer: {
    width:           120,
    height:          120,
    backgroundColor: COLORS.white,
    borderRadius:    30,
    justifyContent:  'center',
    alignItems:      'center',
    marginBottom:    24,
    elevation:       8,
    shadowColor:     '#000',
    shadowOpacity:   0.2,
    shadowRadius:    10,
  },
  icon: {
    fontSize: 64,
  },
  appName: {
    fontSize:   FONT_SIZES.xxl,
    fontWeight: 'bold',
    color:      COLORS.white,
    textAlign:  'center',
    marginBottom: 8,
  },
  tagline: {
    fontSize:  FONT_SIZES.md,
    color:     COLORS.white,
    opacity:   0.8,
    textAlign: 'center',
  },
  version: {
    position: 'absolute',
    bottom:   32,
    fontSize: FONT_SIZES.xs,
    color:    COLORS.white,
    opacity:  0.6,
  },
});

export default SplashScreen;