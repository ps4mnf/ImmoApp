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
  console.log('Creating owner profile:', profile);
  
  const { data, error } = await supabase
    .from('owner_profiles')
    .insert({
      user_id: profile.userId,
      business_name: profile.businessName,
      business_description: profile.businessDescription,
      business_logo: profile.businessLogo,
      cover_image: profile.coverImage,
      intro_video: profile.introVideo,
      website_url: profile.websiteUrl,
      social_media: profile.socialMedia || {},
      business_hours: profile.businessHours || {},
      service_areas: profile.serviceAreas || [],
      specialties: profile.specialties || [],
      years_experience: profile.yearsExperience || 0,
      subscription_tier: profile.subscriptionTier || 'basic',
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating owner profile:', error);
    throw error;
  }
  
  console.log('Owner profile created successfully:', data);
  
  return {
    ...data,
    userId: data.user_id,
    businessName: data.business_name,
    businessDescription: data.business_description,
    businessLogo: data.business_logo,
    coverImage: data.cover_image,
    introVideo: data.intro_video,
    websiteUrl: data.website_url,
    socialMedia: data.social_media,
    businessHours: data.business_hours,
    serviceAreas: data.service_areas,
    specialties: data.specialties,
    yearsExperience: data.years_experience,
    totalProperties: data.total_properties,
    rating: data.rating,
    reviewCount: data.review_count,
    isVerified: data.is_verified,
    subscriptionTier: data.subscription_tier,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  } as OwnerProfile;
}

export async function updateOwnerProfile(userId: string, updates: Partial<OwnerProfile>): Promise<OwnerProfile> {
  console.log('Updating owner profile for user:', userId, 'with updates:', updates);
  
  const updateData: any = {};
  
  if (updates.businessName !== undefined) updateData.business_name = updates.businessName;
  if (updates.businessDescription !== undefined) updateData.business_description = updates.businessDescription;
  if (updates.businessLogo !== undefined) updateData.business_logo = updates.businessLogo;
  if (updates.coverImage !== undefined) updateData.cover_image = updates.coverImage;
  if (updates.websiteUrl !== undefined) updateData.website_url = updates.websiteUrl;
  if (updates.socialMedia !== undefined) updateData.social_media = updates.socialMedia;
  if (updates.serviceAreas !== undefined) updateData.service_areas = updates.serviceAreas;
  if (updates.specialties !== undefined) updateData.specialties = updates.specialties;
  if (updates.yearsExperience !== undefined) updateData.years_experience = updates.yearsExperience;

  console.log('Prepared update data:', updateData);

  const { data, error } = await supabase
    .from('owner_profiles')
    .update(updateData)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating owner profile:', error);
    throw error;
  }
  
  console.log('Owner profile updated successfully:', data);
  
  return {
    ...data,
    userId: data.user_id,
    businessName: data.business_name,
    businessDescription: data.business_description,
    businessLogo: data.business_logo,
    coverImage: data.cover_image,
    introVideo: data.intro_video,
    websiteUrl: data.website_url,
    socialMedia: data.social_media,
    businessHours: data.business_hours,
    serviceAreas: data.service_areas,
    specialties: data.specialties,
    yearsExperience: data.years_experience,
    totalProperties: data.total_properties,
    rating: data.rating,
    reviewCount: data.review_count,
    isVerified: data.is_verified,
    subscriptionTier: data.subscription_tier,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  } as OwnerProfile;
}

// Property Media Management
export async function getPropertyMedia(propertyId: string): Promise<PropertyMedia[]> {
  const { data, error } = await supabase
    .from('property_media')
    .select('*')
    .eq('property_id', propertyId)
    .order('display_order', { ascending: true });

  if (error) throw error;
  return (data || []).map(media => ({
    ...media,
    propertyId: media.property_id,
    mediaType: media.media_type,
    mediaUrl: media.media_url,
    thumbnailUrl: media.thumbnail_url,
    displayOrder: media.display_order,
    isPrimary: media.is_primary,
    createdAt: media.created_at,
  })) as PropertyMedia[];
}

export async function addPropertyMedia(media: Omit<PropertyMedia, 'id' | 'createdAt'>): Promise<PropertyMedia> {
  const { data, error } = await supabase
    .from('property_media')
    .insert({
      property_id: media.propertyId,
      media_type: media.mediaType,
      media_url: media.mediaUrl,
      thumbnail_url: media.thumbnailUrl,
      title: media.title,
      description: media.description,
      display_order: media.displayOrder,
      is_primary: media.isPrimary,
    })
    .select()
    .single();

  if (error) throw error;
  return {
    ...data,
    propertyId: data.property_id,
    mediaType: data.media_type,
    mediaUrl: data.media_url,
    thumbnailUrl: data.thumbnail_url,
    displayOrder: data.display_order,
    isPrimary: data.is_primary,
    createdAt: data.created_at,
  } as PropertyMedia;
}

// Featured Properties Management
export async function getFeaturedProperties(featureType?: string): Promise<any[]> {
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
    .insert({
      property_id: featured.propertyId,
      owner_id: featured.ownerId,
      feature_type: featured.featureType,
      start_date: featured.startDate,
      end_date: featured.endDate,
      priority: featured.priority,
      payment_amount: featured.paymentAmount,
      payment_status: featured.paymentStatus,
    })
    .select()
    .single();

  if (error) throw error;
  return {
    ...data,
    propertyId: data.property_id,
    ownerId: data.owner_id,
    featureType: data.feature_type,
    startDate: data.start_date,
    endDate: data.end_date,
    paymentAmount: data.payment_amount,
    paymentStatus: data.payment_status,
    createdAt: data.created_at,
  } as FeaturedProperty;
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

  if (filters.verified !== undefined) {
    query = query.eq('is_verified', filters.verified);
  }

  const { data, error } = await query.order('rating', { ascending: false });
  if (error) throw error;
  
  return (data || []).map(profile => ({
    ...profile,
    userId: profile.user_id,
    businessName: profile.business_name,
    businessDescription: profile.business_description,
    businessLogo: profile.business_logo,
    coverImage: profile.cover_image,
    introVideo: profile.intro_video,
    websiteUrl: profile.website_url,
    socialMedia: profile.social_media,
    businessHours: profile.business_hours,
    serviceAreas: profile.service_areas,
    specialties: profile.specialties,
    yearsExperience: profile.years_experience,
    totalProperties: profile.total_properties,
    reviewCount: profile.review_count,
    isVerified: profile.is_verified,
    subscriptionTier: profile.subscription_tier,
    createdAt: profile.created_at,
    updatedAt: profile.updated_at,
  })) as OwnerProfile[];
}