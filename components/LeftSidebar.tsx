import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { 
  LayoutDashboard, 
  Package, 
  DollarSign, 
  TrendingDown, 
  ShoppingCart, 
  BarChart3, 
  Settings, 
  User, 
  LogOut,
  Wallet,
  Store,
  Receipt,
  CreditCard,
  Activity
} from 'lucide-react-native';
import { useAuth } from '../contexts/AuthContext';

export const LeftSidebar: React.FC = () => {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const clientMenuItems = [
    { 
      id: 'dashboard', 
      title: 'Dashboard', 
      icon: LayoutDashboard, 
      route: '/(tabs)/client' 
    },
    { 
      id: 'wallet', 
      title: 'Wallet', 
      icon: Wallet, 
      route: '/(tabs)/client/top-up' 
    },
    { 
      id: 'transactions', 
      title: 'Transactions', 
      icon: Activity, 
      route: '/(tabs)/client/transactions' 
    },
    { 
      id: 'pay-invoice', 
      title: 'Pay Invoice', 
      icon: Receipt, 
      route: '/(tabs)/client/pay-invoice' 
    },
    { 
      id: 'buy-products', 
      title: 'Buy Products', 
      icon: ShoppingCart, 
      route: '/(tabs)/client/pay-product' 
    },
  ];

  const merchantMenuItems = [
    { 
      id: 'dashboard', 
      title: 'Dashboard', 
      icon: LayoutDashboard, 
      route: '/(tabs)/merchant' 
    },
    { 
      id: 'products', 
      title: 'Products', 
      icon: Package, 
      route: '/(tabs)/products' 
    },
    { 
      id: 'inventory', 
      title: 'Inventory', 
      icon: BarChart3, 
      route: '/(tabs)/inventory' 
    },
    { 
      id: 'sales', 
      title: 'Sales', 
      icon: DollarSign, 
      route: '/(tabs)/sales' 
    },
    { 
      id: 'low-stock', 
      title: 'Low Stock', 
      icon: TrendingDown, 
      route: '/(tabs)/low-stock' 
    },
    { 
      id: 'orders', 
      title: 'Orders', 
      icon: ShoppingCart, 
      route: '/(tabs)/orders' 
    },
    { 
      id: 'transactions', 
      title: 'Payments', 
      icon: CreditCard, 
      route: '/(tabs)/merchant/transactions' 
    },
  ];

  const menuItems = user?.role === 'client' ? clientMenuItems : merchantMenuItems;

  const handleNavigation = (route: string) => {
    router.push(route as any);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const isActive = (route: string) => {
    return pathname === route || pathname.startsWith(route);
  };

  return (
    <View style={styles.sidebar}>
      {/* Logo Section */}
      <View style={styles.logoSection}>
        <View style={styles.logoContainer}>
          <Store size={28} color="#3B82F6" />
          <Text style={styles.logoText}>StockFlow</Text>
        </View>
        <Text style={styles.logoSubtext}>Inventory Management</Text>
      </View>

      {/* User Info */}
      <View style={styles.userSection}>
        <View style={styles.userAvatar}>
          <User size={20} color="#3B82F6" />
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user?.displayName || 'User'}</Text>
          <Text style={styles.userRole}>{user?.role?.toUpperCase()}</Text>
        </View>
      </View>

      {/* Navigation Menu */}
      <ScrollView style={styles.menuContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.menuSection}>
          <Text style={styles.menuSectionTitle}>MAIN MENU</Text>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.route);
            
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.menuItem, active && styles.activeMenuItem]}
                onPress={() => handleNavigation(item.route)}
                activeOpacity={0.7}
              >
                <Icon 
                  size={20} 
                  color={active ? '#3B82F6' : '#9CA3AF'} 
                />
                <Text style={[
                  styles.menuItemText, 
                  active && styles.activeMenuItemText
                ]}>
                  {item.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.menuSectionTitle}>ACCOUNT</Text>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleNavigation('/(tabs)/profile')}
          >
            <Settings size={20} color="#9CA3AF" />
            <Text style={styles.menuItemText}>Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleSignOut}
          >
            <LogOut size={20} color="#EF4444" />
            <Text style={[styles.menuItemText, { color: '#EF4444' }]}>
              Sign Out
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2025 StockFlow</Text>
        <Text style={styles.footerVersion}>v1.0.0</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    width: 280,
    backgroundColor: '#1F2937',
    height: '100%',
    borderRightWidth: 1,
    borderRightColor: '#374151',
    flexDirection: 'column',
  },
  logoSection: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F9FAFB',
    marginLeft: 12,
  },
  logoSubtext: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 40,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#374151',
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 12,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1F2937',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F9FAFB',
  },
  userRole: {
    fontSize: 12,
    color: '#3B82F6',
    marginTop: 2,
    fontWeight: '500',
  },
  menuContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  menuSection: {
    marginBottom: 32,
  },
  menuSectionTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 12,
    marginLeft: 12,
    letterSpacing: 0.5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginVertical: 2,
  },
  activeMenuItem: {
    backgroundColor: '#1E3A8A',
  },
  menuItemText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginLeft: 12,
    fontWeight: '500',
  },
  activeMenuItemText: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#374151',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#6B7280',
  },
  footerVersion: {
    fontSize: 10,
    color: '#4B5563',
    marginTop: 4,
  },
});