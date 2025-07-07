import { View, Text, StyleSheet, ScrollView, TextInput, Pressable, Alert } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Home, DollarSign, MapPin, Bed, Bath, Square, Save } from 'lucide-react-native';
import { useAuth } from '@/hooks/useLocalAuth';
import { createProperty } from '@/services/localProperties';
import MediaUploader from '@/components/MediaUploader';
import type { PropertyMedia } from '@/types/owner';

const PROPERTY_TYPES = [
  { value: 'sale', label: 'For Sale' },
  { value: 'rent', label: 'For Rent' },
];

const PROPERTY_FEATURES = [
  'Swimming Pool', 'Garage', 'Garden', 'Balcony', 'Fireplace',
  'Air Conditioning', 'Heating', 'Gym', 'Security System', 'Elevator',
  'Parking', 'Storage', 'Laundry Room', 'Walk-in Closet', 'Hardwood Floors'
];

export default function CreatePropertyScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [media, setMedia] = useState<PropertyMedia[]>([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    type: 'sale' as 'sale' | 'rent',
    bedrooms: '',
    bathrooms: '',
    area: '',
    location: '',
    features: [] as string[],
  });

  const handleSave = async () => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to create a property');
      return;
    }

    if (!formData.title || !formData.price || !formData.location) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (media.length === 0) {
      Alert.alert('Error', 'Please add at least one image');
      return;
    }

    try {
      setSaving(true);

      const propertyData = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        type: formData.type,
        bedrooms: parseInt(formData.bedrooms) || 1,
        bathrooms: parseFloat(formData.bathrooms) || 1,
        area: parseFloat(formData.area) || 0,
        location: formData.location,
        images: media.filter(m => m.mediaType === 'image').map(m => m.mediaUrl),
        features: formData.features,
        agentId: user.id,
        isPremiumListing: false,
      };

      await createProperty(propertyData);
      Alert.alert('Success', 'Property created successfully!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to create property. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const toggleFeature = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const handleMediaAdd = (newMedia: Omit<PropertyMedia, 'id' | 'createdAt'>) => {
    const mediaWithId: PropertyMedia = {
      ...newMedia,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setMedia(prev => [...prev, mediaWithId]);
  };

  const handleMediaRemove = (id: string) => {
    setMedia(prev => prev.filter(m => m.id !== id));
  };

  const handleMediaUpdate = (id: string, updates: Partial<PropertyMedia>) => {
    setMedia(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  };

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Add New Property</Text>
        <Text style={styles.subtitle}>Create a new property listing</Text>
      </View>

      <View style={styles.form}>
        {/* Basic Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Property Title *</Text>
            <TextInput
              style={styles.input}
              value={formData.title}
              onChangeText={(text) => setFormData(prev => ({ ...prev, title: text }))}
              placeholder="Enter property title"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.description}
              onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
              placeholder="Describe your property"
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Location *</Text>
            <View style={styles.inputContainer}>
              <MapPin size={20} color="#666" />
              <TextInput
                style={styles.inputWithIcon}
                value={formData.location}
                onChangeText={(text) => setFormData(prev => ({ ...prev, location: text }))}
                placeholder="Enter property location"
                placeholderTextColor="#999"
              />
            </View>
          </View>
        </View>

        {/* Property Type */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Property Type</Text>
          <View style={styles.typeSelector}>
            {PROPERTY_TYPES.map((type) => (
              <Pressable
                key={type.value}
                style={[
                  styles.typeOption,
                  formData.type === type.value && styles.typeOptionSelected
                ]}
                onPress={() => setFormData(prev => ({ ...prev, type: type.value as any }))}
              >
                <Text style={[
                  styles.typeOptionText,
                  formData.type === type.value && styles.typeOptionTextSelected
                ]}>
                  {type.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Price and Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Price & Details</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Price * {formData.type === 'rent' ? '(per month)' : ''}
            </Text>
            <View style={styles.inputContainer}>
              <DollarSign size={20} color="#666" />
              <TextInput
                style={styles.inputWithIcon}
                value={formData.price}
                onChangeText={(text) => setFormData(prev => ({ ...prev, price: text }))}
                placeholder="Enter price"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.rowItem}>
              <Text style={styles.label}>Bedrooms</Text>
              <View style={styles.inputContainer}>
                <Bed size={20} color="#666" />
                <TextInput
                  style={styles.inputWithIcon}
                  value={formData.bedrooms}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, bedrooms: text }))}
                  placeholder="0"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.rowItem}>
              <Text style={styles.label}>Bathrooms</Text>
              <View style={styles.inputContainer}>
                <Bath size={20} color="#666" />
                <TextInput
                  style={styles.inputWithIcon}
                  value={formData.bathrooms}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, bathrooms: text }))}
                  placeholder="0"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Area (sq ft)</Text>
            <View style={styles.inputContainer}>
              <Square size={20} color="#666" />
              <TextInput
                style={styles.inputWithIcon}
                value={formData.area}
                onChangeText={(text) => setFormData(prev => ({ ...prev, area: text }))}
                placeholder="Enter area in square feet"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

        {/* Media Upload */}
        <MediaUploader
          media={media}
          onMediaAdd={handleMediaAdd}
          onMediaRemove={handleMediaRemove}
          onMediaUpdate={handleMediaUpdate}
        />

        {/* Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Property Features</Text>
          <View style={styles.featuresGrid}>
            {PROPERTY_FEATURES.map((feature) => (
              <Pressable
                key={feature}
                style={[
                  styles.featureTag,
                  formData.features.includes(feature) && styles.featureTagSelected
                ]}
                onPress={() => toggleFeature(feature)}
              >
                <Text style={[
                  styles.featureTagText,
                  formData.features.includes(feature) && styles.featureTagTextSelected
                ]}>
                  {feature}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Save Button */}
        <Pressable
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          <Save size={20} color="#fff" />
          <Text style={styles.saveButtonText}>
            {saving ? 'Creating Property...' : 'Create Property'}
          </Text>
        </Pressable>
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
  form: {
    padding: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1a1a1a',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    gap: 8,
  },
  inputWithIcon: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1a1a1a',
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 12,
  },
  typeOption: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  typeOptionSelected: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  typeOptionText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
  },
  typeOptionTextSelected: {
    color: '#fff',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  rowItem: {
    flex: 1,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  featureTag: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  featureTagSelected: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  featureTagText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#374151',
  },
  featureTagTextSelected: {
    color: '#fff',
  },
  saveButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 20,
  },
  saveButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
});