import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { useTranslation } from 'react-i18next';         // ✅ i18next
import { COLORS } from '@constants/index';

import LoginScreen   from '@screens/Auth/LoginScreen';
import HomeScreen    from '@screens/Home/HomeScreen';
import MapScreen     from '@screens/Map/MapScreen';
import CameraScreen  from '@screens/Camera/CameraScreen';
import ProfileScreen from '@screens/Profile/ProfileScreen';

export type RootStackParamList = {
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

const MainTabs = (): React.JSX.Element => {
  const { t } = useTranslation();                       // ✅ ترجمة الـ Tabs

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
          tabBarLabel: t('tabs.home'),               // ✅ مترجم
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 22, color }}>🏠</Text>
          ),
        }}
      />

      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{
          tabBarLabel: t('tabs.map'),
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 22, color }}>🗺️</Text>
          ),
        }}
      />

      <Tab.Screen
        name="Camera"
        component={CameraScreen}
        options={{
          tabBarLabel: t('tabs.camera'),
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 22, color }}>📷</Text>
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: t('tabs.profile'),
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 22, color }}>👤</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = (): React.JSX.Element => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
          animation:   'slide_from_right',
        }}>
        <Stack.Screen name="Login"    component={LoginScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;