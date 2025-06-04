import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { Image } from 'expo-image';
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
            source={property.images[0]}
            style={styles.image}
            contentFit="cover"
            transition={200}
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
    borderRadius: 12,
    overflow: 'hidden',
    ...Platform.select({
      web: {
        width: 'calc(50% - 8px)',
      },
      default: {
        width: '100%',
      },
    }),
    borderWidth: 1,
    borderColor: '#eee',
  },
  imageContainer: {
    position: 'relative',
    height: 200,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badgeContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  content: {
    padding: 16,
  },
  price: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1a1a1a',
  },
  rentPeriod: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  title: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1a1a1a',
    marginTop: 4,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
  },
  locationText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    flex: 1,
  },
  features: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 12,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  featureText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
});