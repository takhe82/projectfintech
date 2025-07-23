import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { TriangleAlert as AlertTriangle, Package } from 'lucide-react-native';

interface LowStockItem {
  id: string;
  name: string;
  sku: string;
  currentStock: number;
  minStock: number;
}

interface AlertCardProps {
  title: string;
  items: LowStockItem[];
}

export const AlertCard: React.FC<AlertCardProps> = ({ title, items }) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <AlertTriangle size={20} color="#EF4444" />
        <Text style={styles.title}>{title}</Text>
      </View>
      
      <Text style={styles.description}>
        The following products are running low on stock:
      </Text>

      <ScrollView style={styles.itemsList} showsVerticalScrollIndicator={false}>
        {items.map((item) => (
          <View key={item.id} style={styles.item}>
            <View style={styles.itemIcon}>
              <Package size={16} color="#EF4444" />
            </View>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemSku}>SKU: {item.sku}</Text>
              <Text style={styles.itemStock}>
                Only {item.currentStock} left
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#7F1D1D',
    borderRadius: 16,
    padding: 20,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#DC2626',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FEF2F2',
    marginLeft: 8,
  },
  description: {
    fontSize: 14,
    color: '#FECACA',
    marginBottom: 16,
  },
  itemsList: {
    maxHeight: 200,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#991B1B',
    borderRadius: 8,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: '#DC2626',
  },
  itemIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#7F1D1D',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FEF2F2',
  },
  itemSku: {
    fontSize: 12,
    color: '#FECACA',
    marginTop: 2,
  },
  itemStock: {
    fontSize: 12,
    color: '#FCA5A5',
    marginTop: 2,
  },
});