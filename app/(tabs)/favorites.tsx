import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Heart, Star } from 'lucide-react-native';
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
  {
    id: '3',
    title: 'Mountain Retreat',
    price: 850000,
    location: 'Aspen, CO',
    images: ['https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg'],
    bedrooms: 4,
    bathrooms: 3,
    area: 3200,
    type: 'sale' as const,
    isPremiumListing: true,
  },
];

export default function FavoritesScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Favorites</Text>
        <Text style={styles.subtitle}>Properties you've saved for later</Text>
      </View>

      {FAVORITE_PROPERTIES.length > 0 ? (
        <ScrollView 
          style={styles.propertiesList}
          contentContainerStyle={styles.propertiesContent}
        >
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Heart size={24} color="#ef4444" />
              <Text style={styles.statNumber}>{FAVORITE_PROPERTIES.length}</Text>
              <Text style={styles.statLabel}>Saved Properties</Text>
            </View>
            <View style={styles.statCard}>
              <Star size={24} color="#f59e0b" />
              <Text style={styles.statNumber}>
                {FAVORITE_PROPERTIES.filter(p => p.isPremiumListing).length}
              </Text>
              <Text style={styles.statLabel}>Premium Listings</Text>
            </View>
          </View>

          {FAVORITE_PROPERTIES.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </ScrollView>
      ) : (
        <View style={styles.emptyState}>
          <Heart size={64} color="#e5e7eb" />
          <Text style={styles.emptyStateTitle}>No Favorites Yet</Text>
          <Text style={styles.emptyStateSubtitle}>
            Start exploring properties and save the ones you love by tapping the heart icon
          </Text>
        </View>
      )}
    </View>
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
  propertiesList: {
    flex: 1,
  },
  propertiesContent: {
    padding: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  statNumber: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1a1a1a',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontFamily: 'Inter-SemiBold',
    color: '#1a1a1a',
    marginTop: 24,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginTop: 12,
    textAlign: 'center',
    lineHeight: 24,
  },
});