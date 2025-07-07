import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Heart } from 'lucide-react-native';
import PropertyCard from '@/components/PropertyCard';

const FAVORITE_PROPERTIES = [
  {
    id: '1',
    title: 'Luxury Penthouse',
    price: 2500000,
    location: 'Manhattan, NY',
    images: ['https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg'],
    bedrooms: 3,
    bathrooms: 3.5,
    area: 2800,
    type: 'sale' as const,
    isPremiumListing: true,
  },
  {
    id: '2',
    title: 'Beachfront Condo',
    price: 4500,
    location: 'Miami Beach, FL',
    images: ['https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg'],
    bedrooms: 2,
    bathrooms: 2,
    area: 1500,
    type: 'rent' as const,
    isPremiumListing: false,
  },
];

export default function FavoritesScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Favorites</Text>
        <Text style={styles.subtitle}>Your saved properties</Text>
      </View>

      {FAVORITE_PROPERTIES.length > 0 ? (
        <ScrollView 
          style={styles.propertiesList}
          contentContainerStyle={styles.propertiesContent}
        >
          {FAVORITE_PROPERTIES.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </ScrollView>
      ) : (
        <View style={styles.emptyState}>
          <Heart size={48} color="#666" />
          <Text style={styles.emptyStateTitle}>No Favorites Yet</Text>
          <Text style={styles.emptyStateSubtitle}>
            Save properties you like to view them later
          </Text>
        </View>
      )}
    </View>
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
  propertiesList: {
    flex: 1,
  },
  propertiesContent: {
    padding: 20,
    gap: 16,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1a1a1a',
    marginTop: 16,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
});