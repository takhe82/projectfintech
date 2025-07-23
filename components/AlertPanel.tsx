import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AlertTriangle, Package, ArrowRight } from 'lucide-react-native';

interface LowStockItem {
  id: string;
  name: string;
  sku: string;
  currentStock: number;
  minStock: number;
}

interface AlertPanelProps {
  items: LowStockItem[];
  onViewAll?: () => void;
}

export const AlertPanel: React.FC<AlertPanelProps> = ({ items, onViewAll }) => {
  return (
    <View style={styles.panel}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <AlertTriangle size={20} color="#EF4444" />
          <Text style={styles.title}>Low Stock Alert</Text>
        </View>
        <TouchableOpacity style={styles.viewAllButton} onPress={onViewAll}>
          <Text style={styles.viewAllText}>View All</Text>
          <ArrowRight size={16} color="#3B82F6" />
        </TouchableOpacity>
      </View>
      
      <Text style={styles.description}>
        {items.length} products need immediate attention
      </Text>

      <View style={styles.itemsList}>
        {items.slice(0, 3).map((item) => (
          <View key={item.id} style={styles.alertItem}>
            <View style={styles.itemIcon}>
              <Package size={16} color="#EF4444" />
            </View>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemSku}>SKU: {item.sku}</Text>
            </View>
            <View style={styles.stockInfo}>
              <Text style={styles.stockCount}>{item.currentStock}</Text>
              <Text style={styles.stockLabel}>left</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  panel: {
    backgroundColor: '#7F1D1D',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#DC2626',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FEF2F2',
    marginLeft: 8,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#991B1B',
    borderRadius: 8,
  },
  viewAllText: {
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: '600',
    marginRight: 4,
  },
  description: {
    fontSize: 14,
    color: '#FECACA',
    marginBottom: 16,
  },
  itemsList: {
    gap: 12,
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#991B1B',
    borderRadius: 12,
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
  stockInfo: {
    alignItems: 'center',
  },
  stockCount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FCA5A5',
  },
  stockLabel: {
    fontSize: 10,
    color: '#FECACA',
  },
});