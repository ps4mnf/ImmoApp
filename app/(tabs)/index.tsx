import { View, Text, StyleSheet, ScrollView, Platform, RefreshControl } from 'react-native';
import { useState, useCallback, useEffect } from 'react';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FeaturedCarousel from '@/components/FeaturedCarousel';
import PropertyCard from '@/components/PropertyCard';
import { getFeaturedProperties } from '@/services/owners';

const RECENT_PROPERTIES = [
  {
    id: '3',
    title: 'Cozy Suburban Home',
    price: 450000,
    location: 'Austin, TX',
    images: ['https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg'],
    bedrooms: 3,
    bathrooms: 2,
    area: 2200,
    type: 'sale' as const,
    isPremiumListing: false,
  },
  {
    id: '4',
    title: 'Studio in Arts District',
    price: 1800,
    location: 'Los Angeles, CA',
    images: ['https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg'],
    bedrooms: 1,
    bathrooms: 1,
    area: 800,
    type: 'rent' as const,
    isPremiumListing: false,
  },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const [featuredProperties, setFeaturedProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProperties();
  }, []);

  const fetchFeaturedProperties = async () => {
    try {
      setLoading(true);
      const featured = await getFeaturedProperties('homepage_hero');
      // Transform the data to match our Property type
      const transformedProperties = featured.map(fp => ({
        id: fp.properties.id,
        title: fp.properties.title,
        price: fp.properties.price,
        location: fp.properties.location,
        images: fp.properties.images,
        bedrooms: fp.properties.bedrooms,
        bathrooms: fp.properties.bathrooms,
        area: fp.properties.area,
        type: fp.properties.type,
        isPremiumListing: true, // Featured properties are premium by default
      }));
      setFeaturedProperties(transformedProperties);
    } catch (error) {
      console.error('Failed to fetch featured properties:', error);
      // Fallback to default properties
      setFeaturedProperties([
        {
          id: '1',
          title: 'Luxury Villa with Ocean View',
          price: 1200000,
          location: 'Miami Beach, FL',
          images: ['https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg'],
          bedrooms: 4,
          bathrooms: 3,
          area: 3500,
          type: 'sale' as const,
          isPremiumListing: true,
        },
        {
          id: '2',
          title: 'Modern Downtown Apartment',
          price: 2500,
          location: 'New York, NY',
          images: ['https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg'],
          bedrooms: 2,
          bathrooms: 2,
          area: 1200,
          type: 'rent' as const,
          isPremiumListing: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchFeaturedProperties().finally(() => {
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
        <Text style={styles.title}>Featured Properties</Text>
        <Text style={styles.subtitle}>Discover our premium listings</Text>
      </View>

      {!loading && featuredProperties.length > 0 && (
        <FeaturedCarousel properties={featuredProperties} />
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Listings</Text>
        <View style={styles.propertiesGrid}>
          {RECENT_PROPERTIES.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginTop: 4,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: 'Inter-SemiBold',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  propertiesGrid: {
    gap: 16,
  },
});