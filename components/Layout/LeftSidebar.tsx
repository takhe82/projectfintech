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
  Activity,
  Plus,
  FileText,
  TrendingUp
} from 'lucide-react-native';
import { useAuth } from '../../contexts/AuthContext';
import { formatCurrency } from '../../constants/paymentMethods';

export const LeftSidebar: React.FC = () => {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const clientMenuItems = [
    { 
      id: 'dashboard', 
      title: 'Dashboard', 
      icon: LayoutDashboard, 
      route: '/(tabs)/client',
      color: '#3B82F6'
    },
    { 
      id: 'wallet', 
      title: 'Top Up Wallet', 
      icon: Plus, 
      route: '/(tabs)/client/top-up',
      color: '#10B981'
    },
    { 
      id: 'transactions', 
      title: 'Transactions', 
      icon: Activity, 
      route: '/(tabs)/client/transactions',
      color: '#8B5CF6'
    },
    { 
      id: 'pay-invoice', 
      title: 'Pay Invoice', 
      icon: FileText, 
      route: '/(tabs)/client/pay-invoice',
      color: '#F59E0B'
    },
    { 
      id: 'buy-products', 
      title: 'Buy Products', 
      icon: ShoppingCart, 
      route: '/(tabs)/client/pay-product',
      color: '#EF4444'
    },
  ];

  const merchantMenuItems = [
    { 
      id: 'dashboard', 
      title: 'Dashboard', 
      icon: LayoutDashboard, 
      route: '/(tabs)/merchant',
      color: '#3B82F6'
    },
    { 
      id: 'products', 
      title: 'Products', 
      icon: Package, 
      route: '/(tabs)/products',
      color: '#10B981'
    },
    { 
      id: 'inventory', 
      title: 'Inventory', 
      icon: BarChart3, 
      route: '/(tabs)/inventory',
      color: '#8B5CF6'
    },
    { 
      id: 'sales', 
      title: 'Sales', 
      icon: TrendingUp, 
      route: '/(tabs)/sales',
      color: '#F59E0B'
    },
    { 
      id: 'low-stock', 
      title: 'Low Stock', 
      icon: TrendingDown, 
      route: '/(tabs)/low-stock',
      color: '#EF4444'
    },
    { 
      id: 'orders', 
      title: 'Orders', 
      icon: ShoppingCart, 
      route: '/(tabs)/orders',
      color: '#06B6D4'
    },
    { 
      id: 'payments', 
      title: 'Payments', 
      icon: CreditCard, 
      route: '/(tabs)/merchant/transactions',
      color: '#84CC16'
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
          <Wallet size={32} color="#3B82F6" />
          <View style={styles.logoText}>
            <Text style={styles.appName}>PayFlow</Text>
            <Text style={styles.appTagline}>Eswatini Digital Wallet</Text>
          </View>
        </View>
      </View>

      {/* User Profile Section */}
      <View style={styles.userSection}>
        <View style={styles.userAvatar}>
          <User size={24} color="#3B82F6" />
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user?.displayName || 'User'}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>{user?.role?.toUpperCase()}</Text>
          </View>
        </View>
      </View>

      {/* Wallet Balance */}
      <View style={styles.balanceSection}>
        <View style={styles.balanceHeader}>
          <Wallet size={16} color="#10B981" />
          <Text style={styles.balanceLabel}>Wallet Balance</Text>
        </View>
        <Text style={styles.balanceAmount}>{formatCurrency(user?.walletBalance || 0)}</Text>
        <Text style={styles.balanceCurrency}>Emalangeni (SZL)</Text>
      </View>

      {/* Navigation Menu */}
      <ScrollView style={styles.menuContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.menuSection}>
          <Text style={styles.menuSectionTitle}>MAIN NAVIGATION</Text>
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
                <View style={[styles.menuIconContainer, { backgroundColor: active ? item.color + '20' : 'transparent' }]}>
                  <Icon 
                    size={20} 
                    color={active ? item.color : '#64748B'} 
                  />
                </View>
                <Text style={[
                  styles.menuItemText, 
                  active && { color: item.color }
                ]}>
                  {item.title}
                </Text>
                {active && <View style={[styles.activeIndicator, { backgroundColor: item.color }]} />}
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
            <View style={styles.menuIconContainer}>
              <Settings size={20} color="#64748B" />
            </View>
            <Text style={styles.menuItemText}>Profile & Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleSignOut}
          >
            <View style={styles.menuIconContainer}>
              <LogOut size={20} color="#EF4444" />
            </View>
            <Text style={[styles.menuItemText, { color: '#EF4444' }]}>
              Sign Out
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerContent}>
          <Text style={styles.footerText}>🇸🇿 Kingdom of Eswatini</Text>
          <Text style={styles.footerVersion}>PayFlow v1.0.0</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    width: 320,
    backgroundColor: '#1E293B',
    height: '100%',
    borderRightWidth: 1,
    borderRightColor: '#334155',
    flexDirection: 'column',
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  logoSection: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    marginLeft: 12,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F8FAFC',
  },
  appTagline: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#334155',
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 16,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1E293B',
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
    color: '#F8FAFC',
  },
  userEmail: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  roleBadge: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 6,
    alignSelf: 'flex-start',
  },
  roleText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  balanceSection: {
    backgroundColor: '#065F46',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  balanceLabel: {
    fontSize: 12,
    color: '#A7F3D0',
    marginLeft: 6,
    fontWeight: '500',
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  balanceCurrency: {
    fontSize: 11,
    color: '#6EE7B7',
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
    color: '#64748B',
    marginBottom: 12,
    marginLeft: 12,
    letterSpacing: 0.5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 12,
    marginVertical: 2,
    position: 'relative',
  },
  activeMenuItem: {
    backgroundColor: '#334155',
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '500',
    flex: 1,
  },
  activeIndicator: {
    position: 'absolute',
    right: 0,
    top: '50%',
    marginTop: -12,
    width: 3,
    height: 24,
    borderRadius: 2,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  footerContent: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },
  footerVersion: {
    fontSize: 10,
    color: '#475569',
    marginTop: 4,
  },
});