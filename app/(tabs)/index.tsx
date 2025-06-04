import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import FeaturedCarousel from '@/components/FeaturedCarousel';
import PropertyCard from '@/components/PropertyCard';

const FEATURED_PROPERTIES = [
  {
    id: '1',
    title: 'Luxury Villa with Ocean View',
    price: 1200000,
    location: 'Miami Beach, FL',
    images: ['https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg'],
    bedrooms: 4,
    bathrooms: 3,
    area: 3500,
    type: 'sale',
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
    type: 'rent',
    isPremiumListing: true,
  },
];

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
    type: 'sale',
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
    type: 'rent',
    isPremiumListing: false,
  },
];

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Featured Properties</Text>
        <Text style={styles.subtitle}>Discover our premium listings</Text>
      </View>

      <FeaturedCarousel properties={FEATURED_PROPERTIES} />

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
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
});