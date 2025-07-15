import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { Link } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { 
  Home, 
  Star, 
  TrendingUp, 
  Eye, 
  MessageSquare, 
  Settings,
  Plus,
  Crown,
  BarChart3
} from 'lucide-react-native';
import { useOwnerProfile } from '@/hooks/useOwnerProfile';
import { useAuth } from '@/hooks/useAuth';
import { getPropertiesByAgent } from '@/services/properties';

const DASHBOARD_STATS = [
  {
    title: 'Total Properties',
    value: '0',
    change: '+0 this month',
    icon: Home,
    color: '#2563eb',
  },
  {
    title: 'Average Rating',
    value: '4.8',
    change: '+0.2 this month',
    icon: Star,
    color: '#f59e0b',
  },
  {
    title: 'Total Views',
    value: '1,234',
    change: '+15% this week',
    icon: Eye,
    color: '#10b981',
  },
  {
    title: 'Messages',
    value: '8',
    change: '3 unread',
    icon: MessageSquare,
    color: '#8b5cf6',
  },
];

const QUICK_ACTIONS = [
  {
    title: 'Add Property',
    subtitle: 'List a new property',
    icon: Plus,
    href: '/owner/create-property',
    color: '#2563eb',
  },
  {
    title: 'Featured Listings',
    subtitle: 'Promote your properties',
    icon: Crown,
    href: '/owner/featured',
    color: '#f59e0b',
  },
  {
    title: 'Analytics',
    subtitle: 'View performance',
    icon: BarChart3,
    href: '/owner/analytics',
    color: '#10b981',
  },
  {
    title: 'Profile Settings',
    subtitle: 'Update your profile',
    icon: Settings,
    href: '/owner/profile',
    color: '#8b5cf6',
  },
];

export default function OwnerDashboard() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { profile, loading, error } = useOwnerProfile();
  const [propertyCount, setPropertyCount] = useState(0);

  useEffect(() => {
    if (user) {
      fetchPropertyCount();
    }
  }, [user]);

  const fetchPropertyCount = async () => {
    try {
      if (user) {
        const properties = await getPropertiesByAgent(user.id);
        setPropertyCount(properties.length);
        // Update the stats
        DASHBOARD_STATS[0].value = properties.length.toString();
      }
    } catch (error) {
      console.error('Failed to fetch property count:', error);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading dashboard...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load dashboard</Text>
          <Text style={styles.errorSubtext}>{error.message}</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.welcomeSection}>
          <Image
            source={{ 
              uri: profile?.businessLogo || user?.user_metadata?.avatar_url || 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg'
            }}
            style={styles.avatar}
          />
          <View style={styles.welcomeText}>
            <Text style={styles.welcomeTitle}>
              Welcome back, {profile?.businessName || user?.user_metadata?.full_name || 'Owner'}!
            </Text>
            <Text style={styles.welcomeSubtitle}>
              {profile?.subscriptionTier === 'premium' ? '⭐ Premium Member' : 'Basic Member'}
            </Text>
          </View>
        </View>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>Overview</Text>
        <View style={styles.statsGrid}>
          {DASHBOARD_STATS.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: `${stat.color}20` }]}>
                <stat.icon size={24} color={stat.color} />
              </View>
              <Text style={styles.statValue}>
                {index === 0 ? propertyCount : stat.value}
              </Text>
              <Text style={styles.statTitle}>{stat.title}</Text>
              <Text style={styles.statChange}>{stat.change}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsContainer}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          {QUICK_ACTIONS.map((action, index) => (
            <Link key={index} href={action.href} asChild>
              <Pressable style={styles.actionCard}>
                <View style={[styles.actionIcon, { backgroundColor: `${action.color}20` }]}>
                  <action.icon size={24} color={action.color} />
                </View>
                <Text style={styles.actionTitle}>{action.title}</Text>
                <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
              </Pressable>
            </Link>
          ))}
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.activityContainer}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityList}>
          <View style={styles.activityItem}>
            <View style={styles.activityIcon}>
              <Eye size={16} color="#666" />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityText}>Your property "Luxury Villa" received 15 new views</Text>
              <Text style={styles.activityTime}>2 hours ago</Text>
            </View>
          </View>
          <View style={styles.activityItem}>
            <View style={styles.activityIcon}>
              <MessageSquare size={16} color="#666" />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityText}>New message from potential buyer</Text>
              <Text style={styles.activityTime}>4 hours ago</Text>
            </View>
          </View>
          <View style={styles.activityItem}>
            <View style={styles.activityIcon}>
              <Star size={16} color="#666" />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityText}>You received a 5-star review</Text>
              <Text style={styles.activityTime}>1 day ago</Text>
            </View>
          </View>
        </View>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#ef4444',
    textAlign: 'center',
  },
  errorSubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  welcomeSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  welcomeText: {
    flex: 1,
  },
  welcomeTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1a1a1a',
  },
  welcomeSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginTop: 4,
  },
  statsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1a1a1a',
  },
  statTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
  },
  statChange: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#10b981',
    marginTop: 4,
  },
  actionsContainer: {
    padding: 20,
    paddingTop: 0,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1a1a1a',
    textAlign: 'center',
  },
  actionSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
  },
  activityContainer: {
    padding: 20,
    paddingTop: 0,
  },
  activityList: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#1a1a1a',
  },
  activityTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginTop: 4,
  },
});