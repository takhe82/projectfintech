import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';

export default function Index() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Loading PayFlow...</Text>
      </View>
    );
  }

  if (user) {
    // Redirect to appropriate dashboard based on user role
    if (user.role === 'client') {
      return <Redirect href="/(tabs)/client" />;
    } else {
      return <Redirect href="/(tabs)/merchant" />;
    }
  }

  return <Redirect href="/(auth)/login" />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#111827',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#F9FAFB',
    fontSize: 16,
    marginTop: 16,
  },
});