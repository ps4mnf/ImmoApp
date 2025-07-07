import { getDatabase, generateId } from './database';
import type { Property } from '@/types';

export async function getProperties(filters?: {
  type?: 'sale' | 'rent';
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  location?: string;
}): Promise<Property[]> {
  const db = getDatabase();
  
  try {
    let query = 'SELECT * FROM properties WHERE 1=1';
    const params = [];

    if (filters?.type) {
      query += ' AND type = ?';
      params.push(filters.type);
    }
    if (filters?.minPrice) {
      query += ' AND price >= ?';
      params.push(filters.minPrice);
    }
    if (filters?.maxPrice) {
      query += ' AND price <= ?';
      params.push(filters.maxPrice);
    }
    if (filters?.bedrooms) {
      query += ' AND bedrooms = ?';
      params.push(filters.bedrooms);
    }
    if (filters?.location) {
      query += ' AND location LIKE ?';
      params.push(`%${filters.location}%`);
    }

    query += ' ORDER BY created_at DESC';

    const results = await db.getAllAsync(query, params);

    return results.map((property: any) => ({
      ...property,
      images: JSON.parse(property.images || '[]'),
      features: JSON.parse(property.features || '[]'),
      isPremiumListing: Boolean(property.is_premium_listing),
    })) as Property[];
  } catch (error) {
    console.error('Get properties error:', error);
    throw error;
  }
}

export async function getPropertyById(id: string): Promise<Property | null> {
  const db = getDatabase();
  
  try {
    const property = await db.getFirstAsync(
      'SELECT * FROM properties WHERE id = ?',
      [id]
    );

    if (!property) return null;

    return {
      ...property,
      images: JSON.parse((property as any).images || '[]'),
      features: JSON.parse((property as any).features || '[]'),
      isPremiumListing: Boolean((property as any).is_premium_listing),
    } as Property;
  } catch (error) {
    console.error('Get property by ID error:', error);
    throw error;
  }
}

export async function createProperty(property: Omit<Property, 'id' | 'createdAt'>): Promise<Property> {
  const db = getDatabase();
  
  try {
    const propertyId = generateId();
    
    await db.runAsync(
      `INSERT INTO properties (
        id, title, description, price, type, bedrooms, bathrooms, 
        area, location, images, features, agent_id, is_premium_listing
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        propertyId,
        property.title,
        property.description || '',
        property.price,
        property.type,
        property.bedrooms,
        property.bathrooms,
        property.area,
        property.location,
        JSON.stringify(property.images || []),
        JSON.stringify(property.features || []),
        property.agentId,
        property.isPremiumListing ? 1 : 0
      ]
    );

    return await getPropertyById(propertyId) as Property;
  } catch (error) {
    console.error('Create property error:', error);
    throw error;
  }
}

export async function updateProperty(id: string, updates: Partial<Property>): Promise<Property> {
  const db = getDatabase();
  
  try {
    const setFields = [];
    const values = [];

    if (updates.title !== undefined) {
      setFields.push('title = ?');
      values.push(updates.title);
    }
    if (updates.description !== undefined) {
      setFields.push('description = ?');
      values.push(updates.description);
    }
    if (updates.price !== undefined) {
      setFields.push('price = ?');
      values.push(updates.price);
    }
    if (updates.type !== undefined) {
      setFields.push('type = ?');
      values.push(updates.type);
    }
    if (updates.bedrooms !== undefined) {
      setFields.push('bedrooms = ?');
      values.push(updates.bedrooms);
    }
    if (updates.bathrooms !== undefined) {
      setFields.push('bathrooms = ?');
      values.push(updates.bathrooms);
    }
    if (updates.area !== undefined) {
      setFields.push('area = ?');
      values.push(updates.area);
    }
    if (updates.location !== undefined) {
      setFields.push('location = ?');
      values.push(updates.location);
    }
    if (updates.images !== undefined) {
      setFields.push('images = ?');
      values.push(JSON.stringify(updates.images));
    }
    if (updates.features !== undefined) {
      setFields.push('features = ?');
      values.push(JSON.stringify(updates.features));
    }
    if (updates.isPremiumListing !== undefined) {
      setFields.push('is_premium_listing = ?');
      values.push(updates.isPremiumListing ? 1 : 0);
    }

    if (setFields.length > 0) {
      setFields.push('updated_at = CURRENT_TIMESTAMP');
      values.push(id);

      await db.runAsync(
        `UPDATE properties SET ${setFields.join(', ')} WHERE id = ?`,
        values
      );
    }

    return await getPropertyById(id) as Property;
  } catch (error) {
    console.error('Update property error:', error);
    throw error;
  }
}

export async function deleteProperty(id: string): Promise<void> {
  const db = getDatabase();
  
  try {
    await db.runAsync('DELETE FROM properties WHERE id = ?', [id]);
  } catch (error) {
    console.error('Delete property error:', error);
    throw error;
  }
}

// Get properties by agent/owner
export async function getPropertiesByAgent(agentId: string): Promise<Property[]> {
  const db = getDatabase();
  
  try {
    const results = await db.getAllAsync(
      'SELECT * FROM properties WHERE agent_id = ? ORDER BY created_at DESC',
      [agentId]
    );

    return results.map((property: any) => ({
      ...property,
      images: JSON.parse(property.images || '[]'),
      features: JSON.parse(property.features || '[]'),
      isPremiumListing: Boolean(property.is_premium_listing),
    })) as Property[];
  } catch (error) {
    console.error('Get properties by agent error:', error);
    throw error;
  }
}