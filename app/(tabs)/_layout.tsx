import React from 'react';
import { Tabs } from 'expo-router';
import { Wallet, Store, User } from 'lucide-react-native';
import { useAuth } from '../../contexts/AuthContext';
import { Redirect } from 'expo-router';

export default function TabLayout() {
  const { user } = useAuth();

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  const isClient = user.role === 'client';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1F2937',
          borderTopColor: '#374151',
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: '#9CA3AF',
      }}
    >
      {isClient ? (
        <>
          <Tabs.Screen
            name="client"
            options={{
              title: 'Wallet',
              tabBarIcon: ({ size, color }) => (
                <Wallet size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              title: 'Profile',
              tabBarIcon: ({ size, color }) => (
                <User size={size} color={color} />
              ),
            }}
          />
        </>
      ) : (
        <>
          <Tabs.Screen
            name="merchant"
            options={{
              title: 'Business',
              tabBarIcon: ({ size, color }) => (
                <Store size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              title: 'Profile',
              tabBarIcon: ({ size, color }) => (
                <User size={size} color={color} />
              ),
            }}
          />
        </>
      )}
      
      {/* Hide tabs that don't match the user's role */}
      <Tabs.Screen
        name={isClient ? 'merchant' : 'client'}
        options={{
          href: null, // This hides the tab
        }}
      />
    </Tabs>
  );
}