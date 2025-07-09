import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { Image } from 'react-native';
import { Link } from 'expo-router';
import { Bed, Bath, Square, MapPin } from 'lucide-react-native';
import type { Property } from '@/types';
import PremiumBadge from './PremiumBadge';

type PropertyCardProps = {
  property: Property;
};

export default function PropertyCard({ property }: PropertyCardProps) {
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(property.price);

  return (
    <Link href={`/property/${property.id}`} asChild>
      <Pressable style={styles.container}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: property.images[0] }}
            style={styles.image}
            resizeMode="cover"
          />
          {property.isPremiumListing && (
            <View style={styles.badgeContainer}>
              <PremiumBadge />
            </View>
          )}
        </View>
        
        <View style={styles.content}>
          <Text style={styles.price}>
            {formattedPrice}
            {property.type === 'rent' && <Text style={styles.rentPeriod}>/mo</Text>}
          </Text>
          <Text style={styles.title} numberOfLines={1}>{property.title}</Text>
          
          <View style={styles.location}>
            <MapPin size={16} color="#666" />
            <Text style={styles.locationText} numberOfLines={1}>{property.location}</Text>
          </View>

          <View style={styles.features}>
            <View style={styles.feature}>
              <Bed size={16} color="#666" />
              <Text style={styles.featureText}>{property.bedrooms}</Text>
            </View>
            <View style={styles.feature}>
              <Bath size={16} color="#666" />
              <Text style={styles.featureText}>{property.bathrooms}</Text>
            </View>
            <View style={styles.feature}>
              <Square size={16} color="#666" />
              <Text style={styles.featureText}>{property.area} sq ft</Text>
            </View>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 8,
    marginBottom: 20,
  },
  imageContainer: {
    position: 'relative',
    height: 220,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badgeContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  content: {
    padding: 20,
  },
  price: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1a1a1a',
  },
  rentPeriod: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1a1a1a',
    marginTop: 8,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
  },
  locationText: {
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    color: '#666',
    flex: 1,
  },
  features: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 16,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  featureText: {
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
  },
});