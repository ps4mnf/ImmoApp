import { getDatabase, generateId } from './database';
import type { OwnerProfile, PropertyMedia, FeaturedProperty, PropertyPricing, OwnerReview } from '@/types/owner';

// Owner Profile Management
export async function getOwnerProfile(userId: string): Promise<OwnerProfile | null> {
  const db = getDatabase();
  
  try {
    const profile = await db.getFirstAsync(
      'SELECT * FROM owner_profiles WHERE user_id = ?',
      [userId]
    );

    if (!profile) return null;

    // Parse JSON fields
    return {
      ...profile,
      socialMedia: JSON.parse((profile as any).social_media || '{}'),
      businessHours: JSON.parse((profile as any).business_hours || '{}'),
      serviceAreas: JSON.parse((profile as any).service_areas || '[]'),
      specialties: JSON.parse((profile as any).specialties || '[]'),
    } as OwnerProfile;
  } catch (error) {
    console.error('Get owner profile error:', error);
    throw error;
  }
}

export async function createOwnerProfile(profile: Partial<OwnerProfile>): Promise<OwnerProfile> {
  const db = getDatabase();
  
  try {
    const profileId = generateId();
    
    await db.runAsync(
      `INSERT INTO owner_profiles (
        id, user_id, business_name, business_description, business_logo, 
        cover_image, intro_video, website_url, social_media, business_hours,
        service_areas, specialties, years_experience, subscription_tier
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        profileId,
        profile.userId,
        profile.businessName || '',
        profile.businessDescription || '',
        profile.businessLogo || '',
        profile.coverImage || '',
        profile.introVideo || '',
        profile.websiteUrl || '',
        JSON.stringify(profile.socialMedia || {}),
        JSON.stringify(profile.businessHours || {}),
        JSON.stringify(profile.serviceAreas || []),
        JSON.stringify(profile.specialties || []),
        profile.yearsExperience || 0,
        profile.subscriptionTier || 'basic'
      ]
    );

    return await getOwnerProfile(profile.userId!) as OwnerProfile;
  } catch (error) {
    console.error('Create owner profile error:', error);
    throw error;
  }
}

export async function updateOwnerProfile(userId: string, updates: Partial<OwnerProfile>): Promise<OwnerProfile> {
  const db = getDatabase();
  
  try {
    const setFields = [];
    const values = [];

    if (updates.businessName !== undefined) {
      setFields.push('business_name = ?');
      values.push(updates.businessName);
    }
    if (updates.businessDescription !== undefined) {
      setFields.push('business_description = ?');
      values.push(updates.businessDescription);
    }
    if (updates.businessLogo !== undefined) {
      setFields.push('business_logo = ?');
      values.push(updates.businessLogo);
    }
    if (updates.coverImage !== undefined) {
      setFields.push('cover_image = ?');
      values.push(updates.coverImage);
    }
    if (updates.websiteUrl !== undefined) {
      setFields.push('website_url = ?');
      values.push(updates.websiteUrl);
    }
    if (updates.socialMedia !== undefined) {
      setFields.push('social_media = ?');
      values.push(JSON.stringify(updates.socialMedia));
    }
    if (updates.serviceAreas !== undefined) {
      setFields.push('service_areas = ?');
      values.push(JSON.stringify(updates.serviceAreas));
    }
    if (updates.specialties !== undefined) {
      setFields.push('specialties = ?');
      values.push(JSON.stringify(updates.specialties));
    }
    if (updates.yearsExperience !== undefined) {
      setFields.push('years_experience = ?');
      values.push(updates.yearsExperience);
    }

    if (setFields.length > 0) {
      setFields.push('updated_at = CURRENT_TIMESTAMP');
      values.push(userId);

      await db.runAsync(
        `UPDATE owner_profiles SET ${setFields.join(', ')} WHERE user_id = ?`,
        values
      );
    }

    return await getOwnerProfile(userId) as OwnerProfile;
  } catch (error) {
    console.error('Update owner profile error:', error);
    throw error;
  }
}

// Property Media Management
export async function getPropertyMedia(propertyId: string): Promise<PropertyMedia[]> {
  const db = getDatabase();
  
  try {
    const media = await db.getAllAsync(
      'SELECT * FROM property_media WHERE property_id = ? ORDER BY display_order ASC',
      [propertyId]
    );

    return media as PropertyMedia[];
  } catch (error) {
    console.error('Get property media error:', error);
    throw error;
  }
}

export async function addPropertyMedia(media: Omit<PropertyMedia, 'id' | 'createdAt'>): Promise<PropertyMedia> {
  const db = getDatabase();
  
  try {
    const mediaId = generateId();
    
    await db.runAsync(
      `INSERT INTO property_media (
        id, property_id, media_type, media_url, thumbnail_url, 
        title, description, display_order, is_primary
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        mediaId,
        media.propertyId,
        media.mediaType,
        media.mediaUrl,
        media.thumbnailUrl || '',
        media.title || '',
        media.description || '',
        media.displayOrder,
        media.isPrimary ? 1 : 0
      ]
    );

    const newMedia = await db.getFirstAsync(
      'SELECT * FROM property_media WHERE id = ?',
      [mediaId]
    );

    return newMedia as PropertyMedia;
  } catch (error) {
    console.error('Add property media error:', error);
    throw error;
  }
}

// Featured Properties Management
export async function getFeaturedProperties(featureType?: string): Promise<any[]> {
  const db = getDatabase();
  
  try {
    let query = `
      SELECT 
        fp.*,
        p.id as property_id,
        p.title,
        p.price,
        p.location,
        p.images,
        p.bedrooms,
        p.bathrooms,
        p.area,
        p.type
      FROM featured_properties fp
      JOIN properties p ON fp.property_id = p.id
      WHERE fp.payment_status = 'paid'
      AND (fp.end_date IS NULL OR fp.end_date > datetime('now'))
    `;

    const params = [];
    if (featureType) {
      query += ' AND fp.feature_type = ?';
      params.push(featureType);
    }

    query += ' ORDER BY fp.priority DESC, fp.created_at DESC';

    const results = await db.getAllAsync(query, params);

    return results.map((row: any) => ({
      id: row.id,
      propertyId: row.property_id,
      ownerId: row.owner_id,
      featureType: row.feature_type,
      startDate: row.start_date,
      endDate: row.end_date,
      priority: row.priority,
      paymentAmount: row.payment_amount,
      paymentStatus: row.payment_status,
      createdAt: row.created_at,
      properties: {
        id: row.property_id,
        title: row.title,
        price: row.price,
        location: row.location,
        images: JSON.parse(row.images || '[]'),
        bedrooms: row.bedrooms,
        bathrooms: row.bathrooms,
        area: row.area,
        type: row.type,
      }
    }));
  } catch (error) {
    console.error('Get featured properties error:', error);
    throw error;
  }
}

export async function createFeaturedProperty(featured: Omit<FeaturedProperty, 'id' | 'createdAt'>): Promise<FeaturedProperty> {
  const db = getDatabase();
  
  try {
    const featuredId = generateId();
    
    await db.runAsync(
      `INSERT INTO featured_properties (
        id, property_id, owner_id, feature_type, start_date, 
        end_date, priority, payment_amount, payment_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        featuredId,
        featured.propertyId,
        featured.ownerId,
        featured.featureType,
        featured.startDate || new Date().toISOString(),
        featured.endDate,
        featured.priority,
        featured.paymentAmount,
        featured.paymentStatus
      ]
    );

    const newFeatured = await db.getFirstAsync(
      'SELECT * FROM featured_properties WHERE id = ?',
      [featuredId]
    );

    return newFeatured as FeaturedProperty;
  } catch (error) {
    console.error('Create featured property error:', error);
    throw error;
  }
}

// Search and Filter Owners
export async function searchOwners(filters: {
  location?: string;
  specialty?: string;
  rating?: number;
  verified?: boolean;
}): Promise<OwnerProfile[]> {
  const db = getDatabase();
  
  try {
    let query = 'SELECT * FROM owner_profiles WHERE 1=1';
    const params = [];

    if (filters.location) {
      query += ' AND service_areas LIKE ?';
      params.push(`%"${filters.location}"%`);
    }

    if (filters.specialty) {
      query += ' AND specialties LIKE ?';
      params.push(`%"${filters.specialty}"%`);
    }

    if (filters.rating) {
      query += ' AND rating >= ?';
      params.push(filters.rating);
    }

    if (filters.verified !== undefined) {
      query += ' AND is_verified = ?';
      params.push(filters.verified ? 1 : 0);
    }

    query += ' ORDER BY rating DESC, review_count DESC';

    const results = await db.getAllAsync(query, params);

    return results.map((profile: any) => ({
      ...profile,
      socialMedia: JSON.parse(profile.social_media || '{}'),
      businessHours: JSON.parse(profile.business_hours || '{}'),
      serviceAreas: JSON.parse(profile.service_areas || '[]'),
      specialties: JSON.parse(profile.specialties || '[]'),
    })) as OwnerProfile[];
  } catch (error) {
    console.error('Search owners error:', error);
    throw error;
  }
}