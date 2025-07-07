import { useState, useRef } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, Pressable, Platform } from 'react-native';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import type { Property } from '@/types';

type FeaturedCarouselProps = {
  properties: Property[];
};

const { width: WINDOW_WIDTH } = Dimensions.get('window');
const ITEM_WIDTH = Math.min(WINDOW_WIDTH * 0.85, 400);
const ITEM_HEIGHT = ITEM_WIDTH * 0.6;

export default function FeaturedCarousel({ properties }: FeaturedCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / (ITEM_WIDTH + 16));
    setActiveIndex(index);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled={false}
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        decelerationRate="fast"
        snapToInterval={ITEM_WIDTH + 16}
        snapToAlignment="start"
        contentContainerStyle={styles.scrollContent}
      >
        {properties.map((property) => (
          <Link key={property.id} href={`/property/${property.id}`} asChild>
            <Pressable style={[styles.item, { width: ITEM_WIDTH }]}>
              <Image
                source={property.images[0]}
                style={[styles.image, { height: ITEM_HEIGHT }]}
                contentFit="cover"
                transition={200}
                placeholder="L6PZfSi_.AyE_3t7t7R**0o#DgR4"
              />
            </Pressable>
          </Link>
        ))}
      </ScrollView>

      <View style={styles.pagination}>
        {properties.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              index === activeIndex && styles.paginationDotActive,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 16,
  },
  item: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    width: '100%',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    gap: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ddd',
  },
  paginationDotActive: {
    backgroundColor: '#2563eb',
    width: 24,
  },
});