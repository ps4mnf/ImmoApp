import { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, Pressable, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search as SearchIcon, SlidersHorizontal, MapPin, Filter } from 'lucide-react-native';
import { PropertyCard } from '@/components/PropertyCard';

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
  {
    id: '3',
    title: 'Cozy Mountain Cabin',
    price: 425000,
    location: 'Aspen, CO',
    images: ['https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg'],
    bedrooms: 3,
    bathrooms: 2,
    area: 1800,
    type: 'sale' as const,
    isPremiumListing: false,
  },
];

const FILTER_TYPES = ['All', 'For Sale', 'For Rent'];
const PRICE_RANGES = ['Any Price', '$0 - $500K', '$500K - $1M', '$1M+'];

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedPrice, setSelectedPrice] = useState('Any Price');
  const [showFilters, setShowFilters] = useState(false);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Find Your Perfect Home</Text>
        <Text style={styles.subtitle}>Search from thousands of properties</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <SearchIcon size={20} color="#666" />
          <TextInput
            style={styles.input}
            placeholder="Search by property name or keyword"
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.locationBar}>
          <MapPin size={20} color="#666" />
          <TextInput
            style={styles.input}
            placeholder="Enter location (city, neighborhood, zip)"
            value={location}
            onChangeText={setLocation}
            placeholderTextColor="#999"
          />
        </View>

        <Pressable 
          style={styles.filtersButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Filter size={20} color="#fff" />
          <Text style={styles.filtersButtonText}>Filters</Text>
        </Pressable>
      </View>

      {showFilters && (
        <View style={styles.filtersContainer}>
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Property Type</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
              {FILTER_TYPES.map((type) => (
                <Pressable
                  key={type}
                  style={[
                    styles.filterChip,
                    selectedType === type && styles.filterChipSelected
                  ]}
                  onPress={() => setSelectedType(type)}
                >
                  <Text style={[
                    styles.filterChipText,
                    selectedType === type && styles.filterChipTextSelected
                  ]}>
                    {type}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Price Range</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
              {PRICE_RANGES.map((range) => (
                <Pressable
                  key={range}
                  style={[
                    styles.filterChip,
                    selectedPrice === range && styles.filterChipSelected
                  ]}
                  onPress={() => setSelectedPrice(range)}
                >
                  <Text style={[
                    styles.filterChipText,
                    selectedPrice === range && styles.filterChipTextSelected
                  ]}>
                    {range}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      )}

      <ScrollView style={styles.results} contentContainerStyle={styles.resultsContent}>
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsCount}>{SAMPLE_PROPERTIES.length} properties found</Text>
        </View>
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
  searchContainer: {
    backgroundColor: '#fff',
    padding: 24,
    gap: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  locationBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 16,
    gap: 12,
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
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
  filtersButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  filtersContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  filterSection: {
    marginBottom: 20,
  },
  filterTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  filterScroll: {
    flexDirection: 'row',
  },
  filterChip: {
    backgroundColor: '#f8fafc',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
  },
  filterChipSelected: {
    backgroundColor: '#2563eb',
  },
  filterChipText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  filterChipTextSelected: {
    color: '#fff',
  },
  results: {
    flex: 1,
  },
  resultsContent: {
    padding: 24,
  },
  resultsHeader: {
    marginBottom: 20,
  },
  resultsCount: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1a1a1a',
  },
});