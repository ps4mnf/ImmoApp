import { supabase } from './supabase';
import type { OwnerProfile, PropertyMedia, FeaturedProperty, PropertyPricing, OwnerReview } from '@/types/owner';

// Owner Profile Management
export async function getOwnerProfile(userId: string): Promise<OwnerProfile | null> {
  const { data, error } = await supabase
    .from('owner_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function createOwnerProfile(profile: Partial<OwnerProfile>): Promise<OwnerProfile> {
  const { data, error } = await supabase
    .from('owner_profiles')
    .insert(profile)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateOwnerProfile(userId: string, updates: Partial<OwnerProfile>): Promise<OwnerProfile> {
  const { data, error } = await supabase
    .from('owner_profiles')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Property Media Management
export async function getPropertyMedia(propertyId: string): Promise<PropertyMedia[]> {
  const { data, error } = await supabase
    .from('property_media')
    .select('*')
    .eq('property_id', propertyId)
    .order('display_order', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function addPropertyMedia(media: Omit<PropertyMedia, 'id' | 'createdAt'>): Promise<PropertyMedia> {
  const { data, error } = await supabase
    .from('property_media')
    .insert(media)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updatePropertyMedia(id: string, updates: Partial<PropertyMedia>): Promise<PropertyMedia> {
  const { data, error } = await supabase
    .from('property_media')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deletePropertyMedia(id: string): Promise<void> {
  const { error } = await supabase
    .from('property_media')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Featured Properties Management
export async function getFeaturedProperties(featureType?: string): Promise<FeaturedProperty[]> {
  let query = supabase
    .from('featured_properties')
    .select(`
      *,
      properties (
        id,
        title,
        price,
        location,
        images,
        bedrooms,
        bathrooms,
        area,
        type
      )
    `)
    .eq('payment_status', 'paid')
    .gte('end_date', new Date().toISOString())
    .order('priority', { ascending: false });

  if (featureType) {
    query = query.eq('feature_type', featureType);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function createFeaturedProperty(featured: Omit<FeaturedProperty, 'id' | 'createdAt'>): Promise<FeaturedProperty> {
  const { data, error } = await supabase
    .from('featured_properties')
    .insert(featured)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateFeaturedProperty(id: string, updates: Partial<FeaturedProperty>): Promise<FeaturedProperty> {
  const { data, error } = await supabase
    .from('featured_properties')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Property Pricing Management
export async function getPropertyPricing(propertyId: string): Promise<PropertyPricing[]> {
  const { data, error } = await supabase
    .from('property_pricing')
    .select('*')
    .eq('property_id', propertyId);

  if (error) throw error;
  return data || [];
}

export async function createPropertyPricing(pricing: Omit<PropertyPricing, 'id' | 'createdAt' | 'updatedAt'>): Promise<PropertyPricing> {
  const { data, error } = await supabase
    .from('property_pricing')
    .insert(pricing)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updatePropertyPricing(id: string, updates: Partial<PropertyPricing>): Promise<PropertyPricing> {
  const { data, error } = await supabase
    .from('property_pricing')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Owner Reviews Management
export async function getOwnerReviews(ownerId: string): Promise<OwnerReview[]> {
  const { data, error } = await supabase
    .from('owner_reviews')
    .select(`
      *,
      reviewer:users!reviewer_id (
        id,
        full_name,
        avatar_url
      )
    `)
    .eq('owner_id', ownerId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createOwnerReview(review: Omit<OwnerReview, 'id' | 'createdAt' | 'updatedAt'>): Promise<OwnerReview> {
  const { data, error } = await supabase
    .from('owner_reviews')
    .insert(review)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Media Upload Helper
export async function uploadMedia(file: File, bucket: string, path: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file);

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);

  return publicUrl;
}

// Search and Filter Owners
export async function searchOwners(filters: {
  location?: string;
  specialty?: string;
  rating?: number;
  verified?: boolean;
}): Promise<OwnerProfile[]> {
  let query = supabase
    .from('owner_profiles')
    .select('*');

  if (filters.location) {
    query = query.contains('service_areas', [filters.location]);
  }

  if (filters.specialty) {
    query = query.contains('specialties', [filters.specialty]);
  }

  if (filters.rating) {
    query = query.gte('rating', filters.rating);
  }

  if (filters.verified) {
    query = query.eq('is_verified', filters.verified);
  }

  const { data, error } = await query.order('rating', { ascending: false });
  if (error) throw error;
  return data || [];
}