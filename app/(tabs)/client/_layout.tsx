import React from 'react';
import { Stack } from 'expo-router';

export default function ClientLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="top-up" />
      <Stack.Screen name="pay-invoice" />
      <Stack.Screen name="pay-product" />
      <Stack.Screen name="transactions" />
    </Stack>
  );
}