import { View, Text, StyleSheet, ScrollView, Platform, RefreshControl } from 'react-native';
import { useState, useCallback, useEffect } from 'react';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FeaturedCarousel from '@/components/FeaturedCarousel';
import PropertyCard from '@/components/PropertyCard';
import { getFeaturedProperties } from '@/services/owners';
import { getProperties } from '@/services/properties';
import { useAuth } from '@/hooks/useAuth';
import { getUserProfile } from '@/services/users';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [featuredProperties, setFeaturedProperties] = useState<any[]>([]);
  const [recentProperties, setRecentProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    fetchData();
    if (user) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async () => {
    if (!user) return;
    
    try {
      const profile = await getUserProfile(user.id);
      setUserProfile(profile);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      setUserProfile(null);
    }
  };
  
  const fetchData = async () => {
    try {
      // Fetch featured properties
      const featured = await getFeaturedProperties('homepage_hero');
      const transformedFeatured = featured
        .filter(fp => fp.properties)
        .map(fp => ({
          id: fp.properties.id,
          title: fp.properties.title,
          price: fp.properties.price,
          location: fp.properties.location,
          images: fp.properties.images,
          bedrooms: fp.properties.bedrooms,
          bathrooms: fp.properties.bathrooms,
          area: fp.properties.area,
          type: fp.properties.type,
          isPremiumListing: true,
        }));
      setFeaturedProperties(transformedFeatured);

      // Fetch recent properties
      const recent = await getProperties();
      setRecentProperties(recent.slice(0, 4)); // Show only first 4
      
    } catch (error) {
      console.error('Failed to fetch data:', error);
      // Set empty arrays to show empty state
      setFeaturedProperties([]);
      setRecentProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData().finally(() => {
      setRefreshing(false);
    });
  }, []);

  return (
    <ScrollView 
      style={[styles.container, { paddingTop: insets.top }]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>
          Welcome{userProfile?.fullName ? `, ${userProfile.fullName}` : ''}!
        </Text>
        <Text style={styles.subtitle}>Discover your dream home</Text>
      </View>

      {featuredProperties.length > 0 && (
        <FeaturedCarousel properties={featuredProperties} />
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Listings</Text>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading properties...</Text>
          </View>
        ) : recentProperties.length > 0 ? (
          <View style={styles.propertiesGrid}>
            {recentProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No properties available yet</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#fff',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#1a1a1a',
    lineHeight: 40,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginTop: 8,
    lineHeight: 24,
  },
  section: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontFamily: 'Inter-SemiBold',
    color: '#1a1a1a',
    marginBottom: 20,
  },
  propertiesGrid: {
    gap: 16,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666',
    textAlign: 'center',
  },
});