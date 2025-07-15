import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { useState } from 'react';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { Camera, Video, Upload, X } from 'lucide-react-native';
import type { PropertyMedia } from '@/types/owner';

type MediaUploaderProps = {
  media: PropertyMedia[];
  onMediaAdd: (media: Omit<PropertyMedia, 'id' | 'createdAt'>) => void;
  onMediaRemove: (id: string) => void;
  onMediaUpdate: (id: string, updates: Partial<PropertyMedia>) => void;
  maxImages?: number;
  maxVideos?: number;
};

export default function MediaUploader({
  media,
  onMediaAdd,
  onMediaRemove,
  onMediaUpdate,
  maxImages = 10,
  maxVideos = 3,
}: MediaUploaderProps) {
  const [uploading, setUploading] = useState(false);

  const images = media.filter(m => m.mediaType === 'image');
  const videos = media.filter(m => m.mediaType === 'video');

  const pickImage = async () => {
    if (images.length >= maxImages) {
      Alert.alert('Limit Reached', `You can only upload up to ${maxImages} images.`);
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
      aspect: [16, 9],
    });

    if (!result.canceled) {
      setUploading(true);
      try {
        for (const asset of result.assets) {
          const newMedia: Omit<PropertyMedia, 'id' | 'createdAt'> = {
            propertyId: '', // Will be set by parent component
            mediaType: 'image',
            mediaUrl: asset.uri,
            displayOrder: media.length,
            isPrimary: media.length === 0, // First image is primary
          };
          onMediaAdd(newMedia);
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to upload images');
      } finally {
        setUploading(false);
      }
    }
  };

  const pickVideo = async () => {
    if (videos.length >= maxVideos) {
      Alert.alert('Limit Reached', `You can only upload up to ${maxVideos} videos.`);
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setUploading(true);
      try {
        const asset = result.assets[0];
        const newMedia: Omit<PropertyMedia, 'id' | 'createdAt'> = {
          propertyId: '', // Will be set by parent component
          mediaType: 'video',
          mediaUrl: asset.uri,
          displayOrder: media.length,
          isPrimary: false,
        };
        onMediaAdd(newMedia);
      } catch (error) {
        Alert.alert('Error', 'Failed to upload video');
      } finally {
        setUploading(false);
      }
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Camera permission is required to take photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setUploading(true);
      try {
        const asset = result.assets[0];
        const newMedia: Omit<PropertyMedia, 'id' | 'createdAt'> = {
          propertyId: '', // Will be set by parent component
          mediaType: 'image',
          mediaUrl: asset.uri,
          displayOrder: media.length,
          isPrimary: media.length === 0,
        };
        onMediaAdd(newMedia);
      } catch (error) {
        Alert.alert('Error', 'Failed to take photo');
      } finally {
        setUploading(false);
      }
    }
  };

  const setPrimaryImage = (id: string) => {
    // Remove primary from all images
    media.forEach(m => {
      if (m.mediaType === 'image' && m.isPrimary) {
        onMediaUpdate(m.id, { isPrimary: false });
      }
    });
    // Set new primary
    onMediaUpdate(id, { isPrimary: true });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Property Media</Text>
      
      {/* Upload Buttons */}
      <View style={styles.uploadButtons}>
        <Pressable style={styles.uploadButton} onPress={pickImage} disabled={uploading}>
          <Upload size={20} color="#2563eb" />
          <Text style={styles.uploadButtonText}>
            Add Photos ({images.length}/{maxImages})
          </Text>
        </Pressable>
        
        <Pressable style={styles.uploadButton} onPress={takePhoto} disabled={uploading}>
          <Camera size={20} color="#2563eb" />
          <Text style={styles.uploadButtonText}>Take Photo</Text>
        </Pressable>
        
        <Pressable style={styles.uploadButton} onPress={pickVideo} disabled={uploading}>
          <Video size={20} color="#2563eb" />
          <Text style={styles.uploadButtonText}>
            Add Video ({videos.length}/{maxVideos})
          </Text>
        </Pressable>
      </View>

      {/* Media Grid */}
      {media.length > 0 && (
        <View style={styles.mediaGrid}>
          {media.map((item, index) => (
            <View key={item.id || index} style={styles.mediaItem}>
              <Image
                source={{ uri: item.mediaUrl }}
                style={styles.mediaImage}
                resizeMode="cover"
              />
              
              {/* Media Type Indicator */}
              <View style={styles.mediaTypeIndicator}>
                {item.mediaType === 'video' ? (
                  <Video size={16} color="#fff" />
                ) : (
                  <Camera size={16} color="#fff" />
                )}
              </View>

              {/* Primary Badge */}
              {item.isPrimary && (
                <View style={styles.primaryBadge}>
                  <Text style={styles.primaryBadgeText}>Primary</Text>
                </View>
              )}

              {/* Actions */}
              <View style={styles.mediaActions}>
                {item.mediaType === 'image' && !item.isPrimary && (
                  <Pressable
                    style={styles.actionButton}
                    onPress={() => setPrimaryImage(item.id)}
                  >
                    <Text style={styles.actionButtonText}>Set Primary</Text>
                  </Pressable>
                )}
                
                <Pressable
                  style={[styles.actionButton, styles.removeButton]}
                  onPress={() => onMediaRemove(item.id)}
                >
                  <X size={16} color="#fff" />
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      )}

      {uploading && (
        <View style={styles.uploadingIndicator}>
          <Text style={styles.uploadingText}>Uploading...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  uploadButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  uploadButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#2563eb',
    borderRadius: 8,
    padding: 12,
    gap: 8,
  },
  uploadButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#2563eb',
  },
  mediaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  mediaItem: {
    position: 'relative',
    width: '48%',
    aspectRatio: 16 / 9,
    borderRadius: 8,
    overflow: 'hidden',
  },
  mediaImage: {
    width: '100%',
    height: '100%',
  },
  mediaTypeIndicator: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    padding: 4,
  },
  primaryBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#f59e0b',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  primaryBadgeText: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
  },
  mediaActions: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    flexDirection: 'row',
    gap: 4,
  },
  actionButton: {
    backgroundColor: 'rgba(37, 99, 235, 0.8)',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  removeButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.8)',
  },
  actionButtonText: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
  },
  uploadingIndicator: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  uploadingText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
});