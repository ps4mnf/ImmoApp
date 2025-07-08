import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { Link } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Plus, FileEdit as Edit, Trash2, Eye, Star } from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';
import { getPropertiesByAgent, deleteProperty } from '@/services/properties';
import PropertyCard from '@/components/PropertyCard';
import type { Property } from '@/types';

export default function MyPropertiesScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProperties();
    }
  }, [user]);

  const fetchProperties = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const data = await getPropertiesByAgent(user.id);
      setProperties(data);
    } catch (error) {
      console.error('Failed to fetch properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProperty = (propertyId: string) => {
    Alert.alert(
      'Delete Property',
      'Are you sure you want to delete this property? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteProperty(propertyId);
              setProperties(prev => prev.filter(p => p.id !== propertyId));
              Alert.alert('Success', 'Property deleted successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete property');
            }
          }
        }
      ]
    );
  };

  const getPropertyStats = () => {
    const totalProperties = properties.length;
    const forSale = properties.filter(p => p.type === 'sale').length;
    const forRent = properties.filter(p => p.type === 'rent').length;
    const premium = properties.filter(p => p.isPremiumListing).length;

    return { totalProperties, forSale, forRent, premium };
  };

  const stats = getPropertyStats();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>My Properties</Text>
        <Text style={styles.subtitle}>Manage your property listings</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.totalProperties}</Text>
          <Text style={styles.statLabel}>Total Properties</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.forSale}</Text>
          <Text style={styles.statLabel}>For Sale</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.forRent}</Text>
          <Text style={styles.statLabel}>For Rent</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.premium}</Text>
          <Text style={styles.statLabel}>Premium</Text>
        </View>
      </View>

      {/* Add Property Button */}
      <View style={styles.addButtonContainer}>
        <Link href="/owner/create-property" asChild>
          <Pressable style={styles.addButton}>
            <Plus size={20} color="#fff" />
            <Text style={styles.addButtonText}>Add New Property</Text>
          </Pressable>
        </Link>
      </View>

      {/* Properties List */}
      <ScrollView style={styles.propertiesList} contentContainerStyle={styles.propertiesContent}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading properties...</Text>
          </View>
        ) : properties.length > 0 ? (
          properties.map((property) => (
            <View key={property.id} style={styles.propertyContainer}>
              <PropertyCard property={property} />
              
              {/* Property Actions */}
              <View style={styles.propertyActions}>
                <View style={styles.propertyStats}>
                  <View style={styles.statItem}>
                    <Eye size={16} color="#666" />
                    <Text style={styles.statText}>0 views</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Star size={16} color="#666" />
                    <Text style={styles.statText}>0 favorites</Text>
                  </View>
                </View>
                
                <View style={styles.actionButtons}>
                  <Pressable style={styles.actionButton}>
                    <Edit size={16} color="#2563eb" />
                    <Text style={styles.actionButtonText}>Edit</Text>
                  </Pressable>
                  
                  <Pressable 
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => handleDeleteProperty(property.id)}
                  >
                    <Trash2 size={16} color="#ef4444" />
                    <Text style={[styles.actionButtonText, styles.deleteButtonText]}>Delete</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Plus size={48} color="#666" />
            <Text style={styles.emptyStateTitle}>No Properties Yet</Text>
            <Text style={styles.emptyStateSubtitle}>
              Start by adding your first property listing
            </Text>
            <Link href="/owner/create-property" asChild>
              <Pressable style={styles.emptyStateButton}>
                <Text style={styles.emptyStateButtonText}>Add Property</Text>
              </Pressable>
            </Link>
          </View>
        )}
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
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
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
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1a1a1a',
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  addButtonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  addButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  propertiesList: {
    flex: 1,
  },
  propertiesContent: {
    padding: 20,
    gap: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  propertyContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  propertyActions: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  propertyStats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    gap: 6,
  },
  deleteButton: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
  },
  actionButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#2563eb',
  },
  deleteButtonText: {
    color: '#ef4444',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1a1a1a',
    marginTop: 16,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  emptyStateButton: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginTop: 20,
  },
  emptyStateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
});