import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Crown, Star, TrendingUp, Calendar, DollarSign } from 'lucide-react-native';
import { getFeaturedProperties, createFeaturedProperty } from '@/services/owners';
import { useAuth } from '@/hooks/useAuth';
import type { FeaturedProperty } from '@/types/owner';

const FEATURE_PACKAGES = [
  {
    type: 'homepage_hero' as const,
    title: 'Homepage Hero',
    description: 'Feature your property prominently on the homepage',
    price: 99,
    duration: '7 days',
    benefits: [
      'Prime homepage placement',
      'Maximum visibility',
      'Priority in search results',
      'Featured badge',
    ],
    color: '#f59e0b',
  },
  {
    type: 'premium_listing' as const,
    title: 'Premium Listing',
    description: 'Boost your property in search results',
    price: 49,
    duration: '30 days',
    benefits: [
      'Higher search ranking',
      'Premium badge',
      'Enhanced listing display',
      'Priority support',
    ],
    color: '#2563eb',
  },
  {
    type: 'sponsored' as const,
    title: 'Sponsored Property',
    description: 'Appear in sponsored sections',
    price: 29,
    duration: '14 days',
    benefits: [
      'Sponsored section placement',
      'Increased visibility',
      'Special highlighting',
      'Analytics tracking',
    ],
    color: '#10b981',
  },
];

export default function FeaturedProperties() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [featuredProperties, setFeaturedProperties] = useState<FeaturedProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);

  useEffect(() => {
    fetchFeaturedProperties();
  }, []);

  const fetchFeaturedProperties = async () => {
    try {
      setLoading(true);
      const data = await getFeaturedProperties();
      setFeaturedProperties(data.filter(fp => fp.ownerId === user?.id));
    } catch (error) {
      console.error('Failed to fetch featured properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchaseFeature = async (packageType: string, propertyId: string) => {
    try {
      setPurchasing(packageType);
      
      const selectedPackage = FEATURE_PACKAGES.find(p => p.type === packageType);
      if (!selectedPackage || !user) return;

      const endDate = new Date();
      endDate.setDate(endDate.getDate() + (packageType === 'premium_listing' ? 30 : packageType === 'sponsored' ? 14 : 7));

      await createFeaturedProperty({
        propertyId,
        ownerId: user.id,
        featureType: packageType as any,
        startDate: new Date().toISOString(),
        endDate: endDate.toISOString(),
        priority: packageType === 'homepage_hero' ? 3 : packageType === 'premium_listing' ? 2 : 1,
        paymentAmount: selectedPackage.price,
        paymentStatus: 'paid', // In real app, integrate with payment processor
      });

      Alert.alert('Success', `Your property has been featured as ${selectedPackage.title}!`);
      fetchFeaturedProperties();
    } catch (error) {
      Alert.alert('Error', 'Failed to purchase feature. Please try again.');
    } finally {
      setPurchasing(null);
    }
  };

  const getActiveFeatures = () => {
    const now = new Date();
    return featuredProperties.filter(fp => 
      fp.paymentStatus === 'paid' && 
      (!fp.endDate || new Date(fp.endDate) > now)
    );
  };

  const activeFeatures = getActiveFeatures();

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Featured Properties</Text>
        <Text style={styles.subtitle}>
          Boost your property visibility and get more inquiries
        </Text>
      </View>

      {/* Active Features */}
      {activeFeatures.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Active Features</Text>
          {activeFeatures.map((feature) => {
            const packageInfo = FEATURE_PACKAGES.find(p => p.type === feature.featureType);
            return (
              <View key={feature.id} style={styles.activeFeatureCard}>
                <View style={styles.activeFeatureHeader}>
                  <View style={[styles.featureIcon, { backgroundColor: `${packageInfo?.color}20` }]}>
                    <Crown size={20} color={packageInfo?.color} />
                  </View>
                  <View style={styles.activeFeatureInfo}>
                    <Text style={styles.activeFeatureTitle}>{packageInfo?.title}</Text>
                    <Text style={styles.activeFeatureExpiry}>
                      Expires: {new Date(feature.endDate!).toLocaleDateString()}
                    </Text>
                  </View>
                  <View style={styles.activeFeatureStatus}>
                    <Text style={styles.activeStatusText}>Active</Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      )}

      {/* Feature Packages */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Feature Packages</Text>
        <Text style={styles.sectionSubtitle}>
          Choose the best package to promote your properties
        </Text>

        {FEATURE_PACKAGES.map((pkg, index) => (
          <View key={index} style={styles.packageCard}>
            <View style={styles.packageHeader}>
              <View style={[styles.packageIcon, { backgroundColor: `${pkg.color}20` }]}>
                <Crown size={24} color={pkg.color} />
              </View>
              <View style={styles.packageInfo}>
                <Text style={styles.packageTitle}>{pkg.title}</Text>
                <Text style={styles.packageDescription}>{pkg.description}</Text>
              </View>
              <View style={styles.packagePrice}>
                <Text style={styles.priceAmount}>${pkg.price}</Text>
                <Text style={styles.priceDuration}>/{pkg.duration}</Text>
              </View>
            </View>

            <View style={styles.packageBenefits}>
              {pkg.benefits.map((benefit, benefitIndex) => (
                <View key={benefitIndex} style={styles.benefitItem}>
                  <Star size={16} color={pkg.color} />
                  <Text style={styles.benefitText}>{benefit}</Text>
                </View>
              ))}
            </View>

            <Pressable
              style={[
                styles.purchaseButton,
                { backgroundColor: pkg.color },
                purchasing === pkg.type && styles.purchaseButtonDisabled
              ]}
              onPress={() => handlePurchaseFeature(pkg.type, 'sample-property-id')} // In real app, let user select property
              disabled={purchasing === pkg.type}
            >
              <DollarSign size={20} color="#fff" />
              <Text style={styles.purchaseButtonText}>
                {purchasing === pkg.type ? 'Processing...' : 'Purchase Feature'}
              </Text>
            </Pressable>
          </View>
        ))}
      </View>

      {/* Statistics */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Performance Boost</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <TrendingUp size={24} color="#10b981" />
            <Text style={styles.statValue}>3.5x</Text>
            <Text style={styles.statLabel}>More Views</Text>
          </View>
          <View style={styles.statCard}>
            <Star size={24} color="#f59e0b" />
            <Text style={styles.statValue}>2.8x</Text>
            <Text style={styles.statLabel}>More Inquiries</Text>
          </View>
          <View style={styles.statCard}>
            <Calendar size={24} color="#2563eb" />
            <Text style={styles.statValue}>40%</Text>
            <Text style={styles.statLabel}>Faster Sales</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginTop: 4,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginBottom: 16,
  },
  activeFeatureCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  activeFeatureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activeFeatureInfo: {
    flex: 1,
  },
  activeFeatureTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1a1a1a',
  },
  activeFeatureExpiry: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginTop: 2,
  },
  activeFeatureStatus: {
    backgroundColor: '#dcfce7',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  activeStatusText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#16a34a',
  },
  packageCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  packageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  packageIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  packageInfo: {
    flex: 1,
  },
  packageTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1a1a1a',
  },
  packageDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginTop: 2,
  },
  packagePrice: {
    alignItems: 'flex-end',
  },
  priceAmount: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1a1a1a',
  },
  priceDuration: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  packageBenefits: {
    marginBottom: 20,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  benefitText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    marginLeft: 8,
  },
  purchaseButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    padding: 12,
    gap: 8,
  },
  purchaseButtonDisabled: {
    opacity: 0.6,
  },
  purchaseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1a1a1a',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
});