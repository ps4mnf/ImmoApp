import { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, Pressable, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search as SearchIcon, SlidersHorizontal, MapPin } from 'lucide-react-native';
import PropertyCard from '@/components/PropertyCard';

const SAMPLE_PROPERTIES = [
  {
    id: '1',
    title: 'Modern Downtown Loft',
    price: 750000,
    location: 'Seattle, WA',
    images: ['https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg'],
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    type: 'sale' as const,
    isPremiumListing: true,
  },
  {
    id: '2',
    title: 'Waterfront Villa',
    price: 3500,
    location: 'Miami Beach, FL',
    images: ['https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg'],
    bedrooms: 4,
    bathrooms: 3,
    area: 2800,
    type: 'rent' as const,
    isPremiumListing: true,
  },
];

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Find Your Dream Home</Text>
        <Text style={styles.subtitle}>Search properties for sale and rent</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <SearchIcon size={20} color="#666" />
          <TextInput
            style={styles.input}
            placeholder="Search by property name"
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.locationBar}>
          <MapPin size={20} color="#666" />
          <TextInput
            style={styles.input}
            placeholder="Location"
            value={location}
            onChangeText={setLocation}
            placeholderTextColor="#999"
          />
        </View>

        <Pressable style={styles.filtersButton}>
          <SlidersHorizontal size={20} color="#fff" />
          <Text style={styles.filtersButtonText}>Filters</Text>
        </Pressable>
      </View>

      <ScrollView style={styles.results} contentContainerStyle={styles.resultsContent}>
        {SAMPLE_PROPERTIES.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </ScrollView>
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
  searchContainer: {
    padding: 20,
    gap: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f4f4f5',
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  locationBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f4f4f5',
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1a1a1a',
  },
  filtersButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563eb',
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  filtersButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  results: {
    flex: 1,
  },
  resultsContent: {
    padding: 20,
    gap: 16,
  },
});