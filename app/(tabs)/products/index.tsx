+import React from 'react';
+import { View, Text, StyleSheet } from 'react-native';
+import { DashboardLayout } from '../../../components/DashboardLayout';
+
+export default function ProductsScreen() {
+  return (
+    <DashboardLayout title="Products" subtitle="Manage your product catalog">
+      <View style={styles.container}>
+        <Text style={styles.text}>Products management coming soon</Text>
+      </View>
+    </DashboardLayout>
+  );
+}
+
+const styles = StyleSheet.create({
+  container: {
+    flex: 1,
+    justifyContent: 'center',
+    alignItems: 'center',
+  },
+  text: {
+    color: '#9CA3AF',
+    fontSize: 16,
+  },
+});
+