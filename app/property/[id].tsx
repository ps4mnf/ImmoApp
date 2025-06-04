import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, useWindowDimensions } from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import { Heart, Share2, Bed, Bath, Square, MapPin, Phone, MessageSquare } from 'lucide-react-native';

const PROPERTY_DATA = {
  id: '1',
  title: 'Luxury Villa with Ocean View',
  price: 1200000,
  location: 'Miami Beach, FL',
  description: 'This stunning oceanfront villa offers breathtaking views and luxurious living spaces. Features include a gourmet kitchen, private pool, and direct beach access.',
  images: [
    'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg',
    'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg',
    'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
  ],
  bedrooms: 4,
  bathrooms: 3,
  area: 3500,
  features: [
    'Ocean View',
    'Private Pool',
    'Gourmet Kitchen',
    'Beach Access',
    'Smart Home System',
    'Wine Cellar',
  ],
  agent: {
    name: 'Sarah Wilson',
    image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
    rating: 4.8,
    reviews: 124,
  },
};

export default function PropertyDetails() {
  const { id } = useLocalSearchParams();
  const [isFavorite, setIsFavorite] = useState(false);
  const { width } = useWindowDimensions();

  const property = PROPERTY_DATA;
  const imageHeight = width * 0.75;

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
          >
            {property.images.map((image, index) => (
              <Image
                key={index}
                source={image}
                style={[styles.image, { width, height: imageHeight }]}
                contentFit="cover"
              />
            ))}
          </ScrollView>
          
          <View style={styles.imageActions}>
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
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{property.title}</Text>
          <Text style={styles.price}>
            {formattedPrice}
          </Text>

          <View style={styles.location}>
            <MapPin size={20} color="#666" />
            <Text style={styles.locationText}>{property.location}</Text>
          </View>

          <View style={styles.features}>
            <View style={styles.feature}>
              <Bed size={24} color="#666" />
              <Text style={styles.featureText}>{property.bedrooms} Beds</Text>
            </View>
            <View style={styles.feature}>
              <Bath size={24} color="#666" />
              <Text style={styles.featureText}>{property.bathrooms} Baths</Text>
            </View>
            <View style={styles.feature}>
              <Square size={24} color="#666" />
              <Text style={styles.featureText}>{property.area} sq ft</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{property.description}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Features</Text>
            <View style={styles.featuresList}>
              {property.features.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <Text style={styles.featureItemText}>{feature}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Listed by</Text>
            <View style={styles.agent}>
              <Image source={property.agent.image} style={styles.agentImage} />
              <View style={styles.agentInfo}>
                <Text style={styles.agentName}>{property.agent.name}</Text>
                <Text style={styles.agentStats}>
                  ⭐️ {property.agent.rating} · {property.agent.reviews} reviews
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable style={styles.messageButton}>
          <MessageSquare size={24} color="#fff" />
          <Text style={styles.messageButtonText}>Message</Text>
        </Pressable>
        <Pressable style={styles.callButton}>
          <Phone size={24} color="#fff" />
          <Text style={styles.callButtonText}>Call Agent</Text>
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
    top: 40,
    right: 20,
    gap: 12,
  },
  actionButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 8,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1a1a1a',
  },
  price: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#2563eb',
    marginTop: 8,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 4,
  },
  locationText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  features: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
  },
  feature: {
    alignItems: 'center',
    gap: 4,
  },
  featureText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1a1a1a',
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666',
    lineHeight: 24,
  },
  featuresList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  featureItem: {
    backgroundColor: '#f8fafc',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
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
    borderRadius: 12,
    padding: 16,
  },
  agentImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  agentInfo: {
    marginLeft: 12,
  },
  agentName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1a1a1a',
  },
  agentStats: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginTop: 4,
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#f4f4f5',
    backgroundColor: '#fff',
  },
  messageButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563eb',
    borderRadius: 12,
    padding: 16,
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
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  callButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
});