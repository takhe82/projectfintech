import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { User, Wallet, Shield, LogOut, MapPin, Phone } from 'lucide-react-native';
import { AppLayout } from '../../components/Layout/AppLayout';
import { ContentContainer } from '../../components/Layout/ContentContainer';
import { ContentGrid } from '../../components/UI/ContentGrid';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { StatusIndicator } from '../../components/StatusIndicator';
import { useAuth } from '../../contexts/AuthContext';
import { formatCurrency } from '../../constants/paymentMethods';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await signOut();
            } catch (error) {
              console.error('Sign out error:', error);
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <AppLayout title="Profile & Settings" subtitle="Manage your account and preferences">
      <ContentContainer>
        <ContentGrid>
          {/* Left Column - Profile Info */}
          <View style={styles.leftColumn}>
            {/* User Info Card */}
            <Card>
              <View style={styles.profileHeader}>
                <View style={styles.avatar}>
                  <User size={32} color="#3B82F6" />
                </View>
                <View style={styles.profileInfo}>
                  <Text style={styles.displayName}>{user?.displayName || 'User'}</Text>
                  <Text style={styles.email}>{user?.email}</Text>
                  <View style={styles.locationInfo}>
                    <MapPin size={12} color="#64748B" />
                    <Text style={styles.location}>Eswatini</Text>
                  </View>
                  <View style={styles.roleBadge}>
                    <Text style={styles.roleText}>{user?.role?.toUpperCase()}</Text>
                  </View>
                </View>
              </View>
            </Card>

            {/* Wallet Info */}
            <Card title="Wallet Information">
              <View style={styles.walletInfo}>
                <View style={styles.walletIconContainer}>
                  <Wallet size={20} color="#10B981" />
                </View>
                <Text style={styles.walletLabel}>Current Balance</Text>
              </View>
              <Text style={styles.walletBalance}>{formatCurrency(user?.walletBalance || 0)}</Text>
              <Text style={styles.walletCurrency}>Emalangeni (SZL)</Text>
              <Text style={styles.walletNote}>
                🔒 Bank-level security • Real-time updates
              </Text>
            </Card>
          </View>

          {/* Right Column - Account Details & Security */}
          <View style={styles.rightColumn}>
            {/* Account Details */}
            <Card title="Account Details">
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Account Type</Text>
                <Text style={styles.detailValue}>
                  {user?.role === 'client' ? '👤 Personal Wallet' : '🏢 Business Account'}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Country</Text>
                <Text style={styles.detailValue}>🇸🇿 Kingdom of Eswatini</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Currency</Text>
                <Text style={styles.detailValue}>Emalangeni (SZL)</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Member Since</Text>
                <Text style={styles.detailValue}>
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Account Status</Text>
                <View style={styles.statusBadge}>
                  <View style={styles.statusDot} />
                  <Text style={styles.statusText}>Active</Text>
                </View>
              </View>
            </Card>

            {/* Security */}
            <Card title="Security & Privacy">
              <View style={styles.securityItem}>
                <Shield size={16} color="#10B981" />
                <Text style={styles.securityText}>Firebase Authentication & Encryption</Text>
              </View>
              <View style={styles.securityItem}>
                <Shield size={16} color="#10B981" />
                <Text style={styles.securityText}>End-to-end payment encryption</Text>
              </View>
              <View style={styles.securityItem}>
                <Shield size={16} color="#10B981" />
                <Text style={styles.securityText}>24/7 fraud monitoring & alerts</Text>
              </View>
              <View style={styles.securityItem}>
                <Shield size={16} color="#10B981" />
                <Text style={styles.securityText}>Compliant with Eswatini banking regulations</Text>
              </View>
            </Card>

            {/* Actions */}
            <Card title="Account Actions">
              <Text style={styles.disclaimer}>
                PayFlow Eswatini - Secure digital wallet for the Kingdom of Eswatini. 
                Integrated with local banks and mobile money providers.
              </Text>
              
              <Button
                title={loading ? 'Signing Out...' : 'Sign Out'}
                onPress={handleSignOut}
                variant="danger"
                disabled={loading}
                style={styles.signOutButton}
              />
            </Card>
          </View>
        </ContentGrid>
      </ContentContainer>
    </AppLayout>
  );
}

const styles = StyleSheet.create({
  leftColumn: {
    flex: 1,
    gap: 24,
  },
  rightColumn: {
    flex: 1,
    gap: 24,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  displayName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F8FAFC',
  },
  email: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  location: {
    fontSize: 12,
    color: '#64748B',
    marginLeft: 4,
  },
  roleBadge: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  roleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  walletInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  walletIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#065F46',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  walletLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#F8FAFC',
  },
  walletBalance: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#10B981',
    marginBottom: 4,
  },
  walletCurrency: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 12,
  },
  walletNote: {
    fontSize: 13,
    color: '#A7F3D0',
    textAlign: 'center',
    backgroundColor: '#065F46',
    padding: 8,
    borderRadius: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  detailLabel: {
    fontSize: 14,
    color: '#64748B',
  },
  detailValue: {
    fontSize: 14,
    color: '#F8FAFC',
    fontWeight: '500',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '500',
  },
  securityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  securityText: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 8,
    flex: 1,
  },
  disclaimer: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 20,
    fontStyle: 'italic',
    lineHeight: 18,
  },
  signOutButton: {
    marginTop: 10,
  },
});

            </View>
            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>{user?.role?.toUpperCase()}</Text>
            </View>
          </View>
        </View>
      </Card>

      {/* Wallet Info */}
      <Card title="Wallet Information">
        <View style={styles.walletInfo}>
          <View style={styles.walletIconContainer}>
            <Wallet size={20} color="#10B981" />
          </View>
          <Text style={styles.walletLabel}>Current Balance</Text>
        </View>
        <Text style={styles.walletBalance}>{formatCurrency(user?.walletBalance || 0)}</Text>
        <Text style={styles.walletCurrency}>Emalangeni (SZL)</Text>
        <Text style={styles.walletNote}>
          🔒 Bank-level security • Real-time updates
        </Text>
      </Card>

      {/* Account Details */}
      <Card title="Account Details">
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Account Type</Text>
          <Text style={styles.detailValue}>
            {user?.role === 'client' ? '👤 Personal Wallet' : '🏢 Business Account'}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Country</Text>
          <Text style={styles.detailValue}>🇸🇿 Kingdom of Eswatini</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Currency</Text>
          <Text style={styles.detailValue}>Emalangeni (SZL)</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Member Since</Text>
          <Text style={styles.detailValue}>
            {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Account Status</Text>
          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Active</Text>
          </View>
        </View>
      </Card>

      {/* Security */}
      <Card title="Security & Privacy">
        <View style={styles.securityItem}>
          <Shield size={16} color="#10B981" />
          <Text style={styles.securityText}>Firebase Authentication & Encryption</Text>
        </View>
        <View style={styles.securityItem}>
          <Shield size={16} color="#10B981" />
          <Text style={styles.securityText}>End-to-end payment encryption</Text>
        </View>
        <View style={styles.securityItem}>
          <Shield size={16} color="#10B981" />
          <Text style={styles.securityText}>24/7 fraud monitoring & alerts</Text>
        </View>
        <View style={styles.securityItem}>
          <Shield size={16} color="#10B981" />
          <Text style={styles.securityText}>Compliant with Eswatini banking regulations</Text>
        </View>
      </Card>

      {/* Actions */}
      <Card title="Account Actions">
        <Text style={styles.disclaimer}>
          PayFlow Eswatini - Secure digital wallet for the Kingdom of Eswatini. 
          Integrated with local banks and mobile money providers.
        </Text>
        
        <Button
          title={loading ? 'Signing Out...' : 'Sign Out'}
          onPress={handleSignOut}
          variant="danger"
          disabled={loading}
          style={styles.signOutButton}
        />
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F9FAFB',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#374151',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  displayName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F9FAFB',
  },
  email: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  location: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 4,
  },
  roleBadge: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  roleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  walletInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  walletIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#065F46',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  walletLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#F9FAFB',
  },
  walletBalance: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#10B981',
    marginBottom: 4,
  },
  walletCurrency: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  walletNote: {
    fontSize: 13,
    color: '#A7F3D0',
    textAlign: 'center',
    backgroundColor: '#065F46',
    padding: 8,
    borderRadius: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  detailLabel: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  detailValue: {
    fontSize: 14,
    color: '#F9FAFB',
    fontWeight: '500',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '500',
  },
  securityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  securityText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginLeft: 8,
    flex: 1,
  },
  disclaimer: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 20,
    fontStyle: 'italic',
    lineHeight: 18,
  },
  signOutButton: {
    marginTop: 10,
  },
});