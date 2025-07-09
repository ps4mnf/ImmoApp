import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, useWindowDimensions, Platform } from 'react-native';
import { Image } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Heart, Share2, Bed, Bath, Square, MapPin, Phone, MessageSquare, Star, Calendar } from 'lucide-react-native';

const PROPERTY_DATA = {
  id: '1',
  title: 'Luxury Villa with Ocean View',
  price: 1200000,
  location: 'Miami Beach, FL',
  description: 'This stunning oceanfront villa offers breathtaking views and luxurious living spaces. Features include a gourmet kitchen, private pool, and direct beach access. The property has been meticulously maintained and includes high-end finishes throughout.',
  images: [
    'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg',
    'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg',
    'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
  ],
  bedrooms: 4,
  bathrooms: 3,
  area: 3500,
  yearBuilt: 2018,
  features: [
    'Ocean View',
    'Private Pool',
    'Gourmet Kitchen',
    'Beach Access',
    'Smart Home System',
    'Wine Cellar',
    'Garage',
    'Garden',
    'Fireplace',
    'Air Conditioning',
  ],
  agent: {
    name: 'Sarah Wilson',
    image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
    rating: 4.8,
    reviews: 124,
    phone: '+1 (555) 123-4567',
  },
};

export default function PropertyDetails() {
  const { id } = useLocalSearchParams();
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const property = PROPERTY_DATA;
  const imageHeight = width * 0.6;

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(property.price);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={[styles.imageContainer, { height: imageHeight }]}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(event.nativeEvent.contentOffset.x / width);
              setCurrentImageIndex(index);
            }}
          >
            {property.images.map((image, index) => (
              <Image
                key={index}
                source={{ uri: image }}
                style={[styles.image, { width, height: imageHeight }]}
                resizeMode="cover"
              />
            ))}
          </ScrollView>
          
          <View style={[styles.imageActions, { top: insets.top + 10 }]}>
            <Pressable
              style={styles.actionButton}
              onPress={() => setIsFavorite(!isFavorite)}
            >
              <Heart
                size={24}
                color={isFavorite ? '#ef4444' : '#fff'}
                fill={isFavorite ? '#ef4444' : 'none'}
              />
            </Pressable>
            <Pressable style={styles.actionButton}>
              <Share2 size={24} color="#fff" />
            </Pressable>
          </View>

          <View style={styles.imageIndicator}>
            <Text style={styles.imageCounter}>
              {currentImageIndex + 1} / {property.images.length}
            </Text>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.priceSection}>
            <Text style={styles.price}>{formattedPrice}</Text>
            <View style={styles.priceDetails}>
              <Text style={styles.pricePerSqft}>
                ${Math.round(property.price / property.area)}/sq ft
              </Text>
            </View>
          </View>

          <Text style={styles.title}>{property.title}</Text>

          <View style={styles.location}>
            <MapPin size={20} color="#666" />
            <Text style={styles.locationText}>{property.location}</Text>
          </View>

          <View style={styles.features}>
            <View style={styles.feature}>
              <Bed size={24} color="#2563eb" />
              <Text style={styles.featureText}>{property.bedrooms} Beds</Text>
            </View>
            <View style={styles.feature}>
              <Bath size={24} color="#2563eb" />
              <Text style={styles.featureText}>{property.bathrooms} Baths</Text>
            </View>
            <View style={styles.feature}>
              <Square size={24} color="#2563eb" />
              <Text style={styles.featureText}>{property.area} sq ft</Text>
            </View>
            <View style={styles.feature}>
              <Calendar size={24} color="#2563eb" />
              <Text style={styles.featureText}>Built {property.yearBuilt}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{property.description}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Property Features</Text>
            <View style={styles.featuresList}>
              {property.features.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <View style={styles.featureDot} />
                  <Text style={styles.featureItemText}>{feature}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Listed by</Text>
            <View style={styles.agent}>
              <Image source={{ uri: property.agent.image }} style={styles.agentImage} />
              <View style={styles.agentInfo}>
                <Text style={styles.agentName}>{property.agent.name}</Text>
                <View style={styles.agentRating}>
                  <Star size={16} color="#f59e0b" fill="#f59e0b" />
                  <Text style={styles.agentStats}>
                    {property.agent.rating} · {property.agent.reviews} reviews
                  </Text>
                </View>
                <Text style={styles.agentPhone}>{property.agent.phone}</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
        <Pressable style={styles.messageButton}>
          <MessageSquare size={24} color="#fff" />
          <Text style={styles.messageButtonText}>Message Agent</Text>
        </Pressable>
        <Pressable style={styles.callButton}>
          <Phone size={24} color="#fff" />
          <Text style={styles.callButtonText}>Call Now</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    flex: 1,
  },
  imageActions: {
    position: 'absolute',
    right: 20,
    gap: 12,
  },
  actionButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 24,
    padding: 12,
  },
  imageIndicator: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  imageCounter: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  content: {
    padding: 24,
  },
  priceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  price: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#2563eb',
  },
  priceDetails: {
    alignItems: 'flex-end',
  },
  pricePerSqft: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#1a1a1a',
    lineHeight: 36,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 6,
  },
  locationText: {
    fontSize: 18,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  features: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    marginTop: 24,
    padding: 20,
    backgroundColor: '#f8fafc',
    borderRadius: 16,
  },
  feature: {
    alignItems: 'center',
    gap: 8,
    minWidth: '22%',
  },
  featureText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1a1a1a',
    textAlign: 'center',
  },
  section: {
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: 'Inter-SemiBold',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666',
    lineHeight: 26,
  },
  featuresList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
    marginBottom: 8,
  },
  featureDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2563eb',
  },
  featureItemText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#1a1a1a',
  },
  agent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 20,
  },
  agentImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  agentInfo: {
    marginLeft: 16,
    flex: 1,
  },
  agentName: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1a1a1a',
  },
  agentRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  agentStats: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  agentPhone: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#2563eb',
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    padding: 24,
    gap: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    backgroundColor: '#fff',
  },
  messageButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563eb',
    borderRadius: 16,
    padding: 18,
    gap: 8,
  },
  messageButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  callButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#059669',
    borderRadius: 16,
    padding: 18,
    gap: 8,
  },
  callButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
});