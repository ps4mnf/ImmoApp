import { useState, useRef } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import type { Property } from '@/types';

type FeaturedCarouselProps = {
  properties: Property[];
};

const { width: WINDOW_WIDTH } = Dimensions.get('window');
const ITEM_WIDTH = Math.min(WINDOW_WIDTH * 0.8, 400);
const ITEM_HEIGHT = ITEM_WIDTH * 0.75;

export default function FeaturedCarousel({ properties }: FeaturedCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / ITEM_WIDTH);
    setActiveIndex(index);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        decelerationRate="fast"
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