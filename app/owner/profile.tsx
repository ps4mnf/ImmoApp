import { View, Text, StyleSheet, ScrollView, TextInput, Pressable, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { Camera, Upload, Save, MapPin, Globe, Clock } from 'lucide-react-native';
import { useOwnerProfile } from '@/hooks/useOwnerProfile';
import { useAuth } from '@/hooks/useAuth';

const BUSINESS_HOURS = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

const SPECIALTIES = [
  'Residential Sales',
  'Commercial Properties',
  'Luxury Homes',
  'Investment Properties',
  'Rental Management',
  'Property Development',
  'First-Time Buyers',
  'Vacation Rentals',
];

export default function OwnerProfileEdit() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { profile, updateProfile, loading } = useOwnerProfile();
  
  const [formData, setFormData] = useState({
    businessName: '',
    businessDescription: '',
    businessLogo: '',
    coverImage: '',
    websiteUrl: '',
    phone: '',
    bio: '',
    serviceAreas: [] as string[],
    specialties: [] as string[],
    yearsExperience: 0,
    businessHours: {} as any,
    socialMedia: {
      facebook: '',
      instagram: '',
      twitter: '',
      linkedin: '',
    },
  });

  const [newServiceArea, setNewServiceArea] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        businessName: profile.businessName || '',
        businessDescription: profile.businessDescription || '',
        businessLogo: profile.businessLogo || '',
        coverImage: profile.coverImage || '',
        websiteUrl: profile.websiteUrl || '',
        phone: user?.phone || '',
        bio: user?.user_metadata?.bio || '',
        serviceAreas: profile.serviceAreas || [],
        specialties: profile.specialties || [],
        yearsExperience: profile.yearsExperience || 0,
        businessHours: profile.businessHours || {},
        socialMedia: profile.socialMedia || {
          facebook: '',
          instagram: '',
          twitter: '',
          linkedin: '',
        },
      });
    }
  }, [profile, user]);

  const pickImage = async (type: 'logo' | 'cover') => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: type === 'logo' ? [1, 1] : [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const imageUri = result.assets[0].uri;
      setFormData(prev => ({
        ...prev,
        [type === 'logo' ? 'businessLogo' : 'coverImage']: imageUri,
      }));
    }
  };

  const addServiceArea = () => {
    if (newServiceArea.trim() && !formData.serviceAreas.includes(newServiceArea.trim())) {
      setFormData(prev => ({
        ...prev,
        serviceAreas: [...prev.serviceAreas, newServiceArea.trim()],
      }));
      setNewServiceArea('');
    }
  };

  const removeServiceArea = (area: string) => {
    setFormData(prev => ({
      ...prev,
      serviceAreas: prev.serviceAreas.filter(a => a !== area),
    }));
  };

  const toggleSpecialty = (specialty: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty],
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateProfile(formData);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]}>
      {/* Cover Image */}
      <View style={styles.coverSection}>
        <Pressable style={styles.coverImageContainer} onPress={() => pickImage('cover')}>
          {formData.coverImage ? (
            <Image source={{ uri: formData.coverImage }} style={styles.coverImage} resizeMode="cover" />
          ) : (
            <View style={styles.coverPlaceholder}>
              <Upload size={32} color="#666" />
              <Text style={styles.coverPlaceholderText}>Add Cover Image</Text>
            </View>
          )}
        </Pressable>
        
        {/* Business Logo */}
        <Pressable style={styles.logoContainer} onPress={() => pickImage('logo')}>
          {formData.businessLogo ? (
            <Image source={{ uri: formData.businessLogo }} style={styles.logo} resizeMode="cover" />
          ) : (
            <View style={styles.logoPlaceholder}>
              <Camera size={24} color="#666" />
            </View>
          )}
        </Pressable>
      </View>

      <View style={styles.formContainer}>
        {/* Basic Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Business Information</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Business Name</Text>
            <TextInput
              style={styles.input}
              value={formData.businessName}
              onChangeText={(text) => setFormData(prev => ({ ...prev, businessName: text }))}
              placeholder="Enter your business name"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.businessDescription}
              onChangeText={(text) => setFormData(prev => ({ ...prev, businessDescription: text }))}
              placeholder="Describe your business and services"
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Years of Experience</Text>
            <TextInput
              style={styles.input}
              value={formData.yearsExperience.toString()}
              onChangeText={(text) => setFormData(prev => ({ ...prev, yearsExperience: parseInt(text) || 0 }))}
              placeholder="0"
              placeholderTextColor="#999"
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Website URL</Text>
            <TextInput
              style={styles.input}
              value={formData.websiteUrl}
              onChangeText={(text) => setFormData(prev => ({ ...prev, websiteUrl: text }))}
              placeholder="https://yourwebsite.com"
              placeholderTextColor="#999"
              keyboardType="url"
            />
          </View>
        </View>

        {/* Service Areas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Service Areas</Text>
          
          <View style={styles.serviceAreaInput}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              value={newServiceArea}
              onChangeText={setNewServiceArea}
              placeholder="Add a service area"
              placeholderTextColor="#999"
            />
            <Pressable style={styles.addButton} onPress={addServiceArea}>
              <Text style={styles.addButtonText}>Add</Text>
            </Pressable>
          </View>

          <View style={styles.tagsContainer}>
            {formData.serviceAreas.map((area, index) => (
              <Pressable
                key={index}
                style={styles.tag}
                onPress={() => removeServiceArea(area)}
              >
                <MapPin size={14} color="#2563eb" />
                <Text style={styles.tagText}>{area}</Text>
                <Text style={styles.tagRemove}>×</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Specialties */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Specialties</Text>
          
          <View style={styles.specialtiesGrid}>
            {SPECIALTIES.map((specialty, index) => (
              <Pressable
                key={index}
                style={[
                  styles.specialtyTag,
                  formData.specialties.includes(specialty) && styles.specialtyTagSelected
                ]}
                onPress={() => toggleSpecialty(specialty)}
              >
                <Text style={[
                  styles.specialtyTagText,
                  formData.specialties.includes(specialty) && styles.specialtyTagTextSelected
                ]}>
                  {specialty}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Social Media */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Social Media</Text>
          
          {Object.entries(formData.socialMedia).map(([platform, url]) => (
            <View key={platform} style={styles.inputGroup}>
              <Text style={styles.label}>{platform.charAt(0).toUpperCase() + platform.slice(1)}</Text>
              <TextInput
                style={styles.input}
                value={url}
                onChangeText={(text) => setFormData(prev => ({
                  ...prev,
                  socialMedia: { ...prev.socialMedia, [platform]: text }
                }))}
                placeholder={`Your ${platform} URL`}
                placeholderTextColor="#999"
                keyboardType="url"
              />
            </View>
          ))}
        </View>

        {/* Save Button */}
        <Pressable
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          <Save size={20} color="#fff" />
          <Text style={styles.saveButtonText}>
            {saving ? 'Saving...' : 'Save Profile'}
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
  coverSection: {
    position: 'relative',
    height: 200,
  },
  coverImageContainer: {
    width: '100%',
    height: '100%',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  coverPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverPlaceholderText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginTop: 8,
  },
  logoContainer: {
    position: 'absolute',
    bottom: -40,
    left: 20,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    borderWidth: 4,
    borderColor: '#fff',
    overflow: 'hidden',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  logoPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    padding: 20,
    paddingTop: 60,
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
  serviceAreaInput: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 4,
  },
  tagText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#2563eb',
  },
  tagRemove: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#2563eb',
    marginLeft: 4,
  },
  specialtiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  specialtyTag: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  specialtyTagSelected: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  specialtyTagText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#374151',
  },
  specialtyTagTextSelected: {
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