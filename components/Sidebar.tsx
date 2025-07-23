import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { 
  Home, 
  Package, 
  DollarSign, 
  TrendingDown, 
  ShoppingCart, 
  BarChart3, 
  Settings, 
  User,
  LogOut,
  X
} from 'lucide-react-native';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { 
      id: 'dashboard', 
      title: 'Dashboard', 
      icon: Home, 
      route: user?.role === 'client' ? '/(tabs)/client' : '/(tabs)/merchant' 
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
  ];

  const handleNavigation = (route: string) => {
    router.push(route as any);
    onClose();
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      onClose();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <View style={styles.overlay}>
      <TouchableOpacity style={styles.backdrop} onPress={onClose} />
      <View style={styles.sidebar}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.logo}>
              <Package size={24} color="#3B82F6" />
              <Text style={styles.logoText}>StockFlow</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.menuContainer}>
          <View style={styles.userInfo}>
            <View style={styles.userAvatar}>
              <User size={20} color="#3B82F6" />
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{user?.displayName || 'User'}</Text>
              <Text style={styles.userRole}>{user?.role?.toUpperCase()}</Text>
            </View>
          </View>

          <View style={styles.menuItems}>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.includes(item.route);
              
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.menuItem, isActive && styles.activeMenuItem]}
                  onPress={() => handleNavigation(item.route)}
                >
                  <Icon 
                    size={20} 
                    color={isActive ? '#3B82F6' : '#9CA3AF'} 
                  />
                  <Text style={[
                    styles.menuItemText, 
                    isActive && styles.activeMenuItemText
                  ]}>
                    {item.title}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.bottomMenu}>
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
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    flexDirection: 'row',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sidebar: {
    width: 280,
    backgroundColor: '#1F2937',
    height: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F9FAFB',
    marginLeft: 8,
  },
  closeButton: {
    padding: 4,
  },
  menuContainer: {
    flex: 1,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#374151',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F9FAFB',
  },
  userRole: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  menuItems: {
    paddingVertical: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginHorizontal: 12,
    borderRadius: 8,
  },
  activeMenuItem: {
    backgroundColor: '#1E3A8A',
  },
  menuItemText: {
    fontSize: 16,
    color: '#9CA3AF',
    marginLeft: 12,
    fontWeight: '500',
  },
  activeMenuItemText: {
    color: '#3B82F6',
  },
  bottomMenu: {
    borderTopWidth: 1,
    borderTopColor: '#374151',
    paddingVertical: 20,
  },
});