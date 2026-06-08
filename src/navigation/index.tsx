/* eslint-disable react/no-unstable-nested-components */
import React, { useEffect, useState } from 'react';
import { NavigationContainer }         from '@react-navigation/native';
import { createNativeStackNavigator }  from '@react-navigation/native-stack';
import { createBottomTabNavigator }    from '@react-navigation/bottom-tabs';
import { Text} from 'react-native';
import { useTranslation }              from 'react-i18next';
import { COLORS }                      from '@constants/index';
import { useAuthStore }                from '@store/index';

// ── استيراد الشاشات ───────────────────────────────
import SplashScreen  from '@screens/Splash/SplashScreen';
import LoginScreen   from '@screens/Auth/LoginScreen';
import HomeScreen    from '@screens/Home/HomeScreen';
import MapScreen     from '@screens/Map/MapScreen';
import CameraScreen  from '@screens/Camera/CameraScreen';
import ProfileScreen from '@screens/Profile/ProfileScreen';

// ── أنواع المسارات ────────────────────────────────
export type RootStackParamList = {
  Splash:   undefined;
  Login:    undefined;
  MainTabs: undefined;
};

export type MainTabParamList = {
  Home:    undefined;
  Map:     undefined;
  Camera:  undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab   = createBottomTabNavigator<MainTabParamList>();
const HomeIcon = ({ color }: { color: string }) => (
  <Text style={{ fontSize: 22, color }}>🏠</Text>
);

const MapIcon = ({ color }: { color: string }) => (
  <Text style={{ fontSize: 22, color }}>🗺️</Text>
);

const CameraIcon = ({ color }: { color: string }) => (
  <Text style={{ fontSize: 22, color }}>📷</Text>
);

const ProfileIcon = ({ color }: { color: string }) => (
  <Text style={{ fontSize: 22, color }}>👤</Text>
);
// ── Bottom Tabs ───────────────────────────────────
const MainTabs = (): React.JSX.Element => {
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor:   COLORS.primary,
        tabBarInactiveTintColor: COLORS.gray,
        
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopWidth:  1,
          borderTopColor:  '#E5E7EB',
          paddingBottom:   8,
          paddingTop:      8,
          height:          64,
        },
        headerShown: false,
      }}>

      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: t('tabs.home'),
          tabBarIcon: ({ color }) => (
            <HomeIcon color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{
          tabBarLabel: t('tabs.map'),
          tabBarIcon: ({ color }) => (
            <MapIcon color={color} />
          ),
        
        }}
      />
      <Tab.Screen
        name="Camera"
        component={CameraScreen}
        options={{
          tabBarLabel: t('tabs.camera'),
          tabBarIcon: ({ color }) => (
            <CameraIcon color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: t('tabs.profile'),
          tabBarIcon: ({ color }) => (
            <ProfileIcon color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// ── Root Navigator ────────────────────────────────
const AppNavigator = (): React.JSX.Element => {

  const [isHydrated, setIsHydrated] = useState(false);
  // ✅ قراءة حالة تسجيل الدخول من Zustand
  const isLoggedIn       = useAuthStore(state => state.isLoggedIn);


useEffect(() => {
  const unsubscribe =
    useAuthStore.persist.onFinishHydration(() => {
      setIsHydrated(true);
    });

  if (useAuthStore.persist.hasHydrated()) {
    setIsHydrated(true);
  }

  return unsubscribe;
}, []);
  // ── Loading أثناء التهيئة ─────────────────────

  if (!isHydrated) {
  return <SplashScreen />;
}

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation:   'fade',
        }}>

        {/* ✅ منطق Auth تلقائي */}
        {isLoggedIn ? (
          // مسجل دخول → الشاشة الرئيسية
          <Stack.Screen name="MainTabs" component={MainTabs} />
        ) : (
          // غير مسجل → شاشة الدخول
          <Stack.Screen name="Login" component={LoginScreen} />
        )}

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;