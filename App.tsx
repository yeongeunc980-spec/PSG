import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { InputScreen } from './screens/InputScreen';
import { ListScreen } from './screens/ListScreen';
import { DetailScreen } from './screens/DetailScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { useStore } from './store/useStore';
import { initDatabase, getAllSales } from './services/database';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const ListStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animationEnabled: true,
      }}
    >
      <Stack.Screen name="ListMain" component={ListScreen} />
      <Stack.Screen
        name="Detail"
        component={DetailScreen}
        options={{
          animationEnabled: true,
        }}
      />
    </Stack.Navigator>
  );
};

const App: React.FC = () => {
  const setSales = useStore((state) => state.setSales);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      await initDatabase();
      const savedSales = await getAllSales();
      setSales(savedSales);
    } catch (error) {
      console.error('App initialization error:', error);
    }
  };

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#2563EB',
          tabBarInactiveTintColor: '#D1D5DB',
          tabBarStyle: {
            backgroundColor: '#FFFFFF',
            borderTopColor: '#E5E7EB',
            borderTopWidth: 1,
            paddingBottom: 5,
            height: 60,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
            marginTop: 4,
          },
        }}
      >
        <Tab.Screen
          name="Input"
          component={InputScreen}
          options={{
            tabBarLabel: '입력',
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>✏️</Text>,
          }}
        />
        <Tab.Screen
          name="List"
          component={ListStackNavigator}
          options={{
            tabBarLabel: '리스트',
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>📋</Text>,
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            tabBarLabel: '설정',
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>⚙️</Text>,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
