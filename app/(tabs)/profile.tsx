import { View, Text, StyleSheet, ScrollView, Pressable, Platform } from 'react-native';
import { Image } from 'expo-image';
import { Link, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Settings, Heart, MessageSquare, Home, LogOut, Crown, BarChart3, User, Mail, Lock } from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';
import { useOwnerProfile } from '@/hooks/useOwnerProfile';
import { useState, useEffect } from 'react';
import { getUserProfile } from '@/services/users';
import type { UserProfile } from '@/services/users';

const PROFILE_SECTIONS = [
  {
    icon: Heart,
    title: 'Saved Properties',
    subtitle: 'View your favorited properties',
    href: '/(tabs)/favorites',
  },
  {
    icon: MessageSquare,
    title: 'Messages',
    subtitle: 'Chat with agents and owners',
    href: '/(tabs)/messages',
  },
  {
    icon: Home,
    title: 'My Properties',
    subtitle: 'Manage your property listings',
    href: '/owner/properties',
  },
  {
    icon: Crown,
    title: 'Owner Dashboard',
    subtitle: 'Manage your business profile',
    href: '/owner/dashboard',
  },
  {
    icon: BarChart3,
    title: 'Analytics',
    subtitle: 'View performance metrics',
    href: '/owner/analytics',
  },
  {
    icon: Settings,
    title: 'Settings',
    subtitle: 'App preferences and account settings',
    href: '/settings',
  },
];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();
  const { profile } = useOwnerProfile();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchUserProfile = async () => {
    if (!user) return;
    
    try {
      const profile = await getUserProfile(user.id);
      setUserProfile(profile);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      setUserProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Show authentication interface if user is not logged in
  if (!user) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.authContainer}>
          <View style={styles.authHeader}>
            <View style={styles.authIcon}>
              <User size={48} color="#2563eb" />
            </View>
            <Text style={styles.authTitle}>Welcome to Real Estate App</Text>
            <Text style={styles.authSubtitle}>
              Sign in to access your profile, save properties, and connect with agents
            </Text>
          </View>

          <View style={styles.authActions}>
            <Link href="/auth/login" asChild>
              <Pressable style={styles.loginButton}>
                <Mail size={20} color="#fff" />
                <Text style={styles.loginButtonText}>Sign In</Text>
              </Pressable>
            </Link>

            <Link href="/auth/register" asChild>
              <Pressable style={styles.registerButton}>
                <Lock size={20} color="#2563eb" />
                <Text style={styles.registerButtonText}>Create Account</Text>
              </Pressable>
            </Link>
          </View>

          <View style={styles.authFeatures}>
            <Text style={styles.featuresTitle}>What you can do:</Text>
            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <Heart size={16} color="#2563eb" />
                <Text style={styles.featureText}>Save favorite properties</Text>
              </View>
              <View style={styles.featureItem}>
                <MessageSquare size={16} color="#2563eb" />
                <Text style={styles.featureText}>Message agents directly</Text>
              </View>
              <View style={styles.featureItem}>
                <Home size={16} color="#2563eb" />
                <Text style={styles.featureText}>List your own properties</Text>
              </View>
              <View style={styles.featureItem}>
                <BarChart3 size={16} color="#2563eb" />
                <Text style={styles.featureText}>Track property performance</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }

  // Show loading state while fetching user profile
  if (loading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </View>
    );
  }

  // Show authenticated user profile
  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View style={styles.profileInfo}>
          <Image
            source={{ 
              uri: userProfile?.avatarUrl || user?.user_metadata?.avatar_url || 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg'
            }}
            style={styles.avatar}
          />
          <View style={styles.nameContainer}>
            <Text style={styles.name}>
              {userProfile?.fullName || user?.user_metadata?.full_name || 'User'}
            </Text>
            <Text style={styles.email}>{user?.email}</Text>
            {userProfile?.phone && (
              <Text style={styles.phone}>{userProfile.phone}</Text>
            )}
            {userProfile?.bio && (
              <Text style={styles.bio} numberOfLines={2}>{userProfile.bio}</Text>
            )}
            <View style={styles.accountTypes}>
              {userProfile?.isAgent && (
                <View style={styles.typeBadge}>
                  <Text style={styles.typeBadgeText}>Agent</Text>
                </View>
              )}
              {userProfile?.isOwner && (
                <View style={styles.typeBadge}>
                  <Text style={styles.typeBadgeText}>Owner</Text>
                </View>
              )}
            </View>
            {profile?.subscriptionTier && (
              <View style={styles.subscriptionBadge}>
                <Crown size={14} color="#f59e0b" />
                <Text style={styles.subscriptionText}>
                  {profile.subscriptionTier.charAt(0).toUpperCase() + profile.subscriptionTier.slice(1)} Member
                </Text>
              </View>
            )}
          </View>
        </View>
        
        <Link href="/settings" asChild>
          <Pressable style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </Pressable>
        </Link>
      </View>

      <View style={styles.sections}>
        {PROFILE_SECTIONS.filter(section => {
          // Show owner-specific sections only for owners
          if (section.href.includes('/owner/') && !userProfile?.isOwner) {
            return false;
          }
          return true;
        }).map((section, index) => (
          <Link key={index} href={section.href} asChild>
            <Pressable style={styles.section}>
              <section.icon size={24} color="#1a1a1a" />
              <View style={styles.sectionContent}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                <Text style={styles.sectionSubtitle}>{section.subtitle}</Text>
              </View>
            </Pressable>
          </Link>
        ))}

        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={24} color="#ef4444" />
          <Text style={styles.logoutText}>Log Out</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  authContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  authHeader: {
    alignItems: 'center',
    marginBottom: 40,
  },
  authIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  authTitle: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 12,
  },
  authSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  authActions: {
    gap: 16,
    marginBottom: 40,
  },
  loginButton: {
    backgroundColor: '#2563eb',
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  registerButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#2563eb',
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  registerButtonText: {
    color: '#2563eb',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  authFeatures: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
  },
  featuresTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  featuresList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#374151',
  },
  header: {
    backgroundColor: '#fff',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  nameContainer: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1a1a1a',
  },
  email: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginTop: 4,
  },
  phone: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginTop: 2,
  },
  bio: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginTop: 4,
    lineHeight: 18,
  },
  accountTypes: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  typeBadge: {
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  typeBadgeText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#2563eb',
  },
  subscriptionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 8,
    alignSelf: 'flex-start',
    gap: 4,
  },
  subscriptionText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#92400e',
  },
  editButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  sections: {
    padding: 24,
    gap: 16,
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionContent: {
    marginLeft: 16,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1a1a1a',
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fef2f2',
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
  },
  logoutText: {
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ef4444',
  },
});