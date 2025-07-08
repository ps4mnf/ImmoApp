import { supabase } from './supabase';
import type { Property } from '@/types';

export async function getProperties(filters?: {
  type?: 'sale' | 'rent';
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  location?: string;
}): Promise<Property[]> {
  let query = supabase
    .from('properties')
    .select('*')
    .order('created_at', { ascending: false });

  if (filters?.type) {
    query = query.eq('type', filters.type);
  }
  if (filters?.minPrice) {
    query = query.gte('price', filters.minPrice);
  }
  if (filters?.maxPrice) {
    query = query.lte('price', filters.maxPrice);
  }
  if (filters?.bedrooms) {
    query = query.eq('bedrooms', filters.bedrooms);
  }
  if (filters?.location) {
    query = query.ilike('location', `%${filters.location}%`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as Property[];
}

export async function getPropertyById(id: string): Promise<Property | null> {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data as Property;
}

export async function createProperty(property: Omit<Property, 'id' | 'createdAt'>): Promise<Property> {
  const { data, error } = await supabase
    .from('properties')
    .insert({
      title: property.title,
      description: property.description,
      price: property.price,
      type: property.type,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      area: property.area,
      location: property.location,
      images: property.images,
      features: property.features,
      agent_id: property.agentId,
      is_premium_listing: property.isPremiumListing,
    })
    .select()
    .single();

  if (error) throw error;
  return {
    ...data,
    agentId: data.agent_id,
    isPremiumListing: data.is_premium_listing,
    createdAt: data.created_at,
  } as Property;
}

export async function updateProperty(id: string, updates: Partial<Property>): Promise<Property> {
  const updateData: any = {};
  
  if (updates.title !== undefined) updateData.title = updates.title;
  if (updates.description !== undefined) updateData.description = updates.description;
  if (updates.price !== undefined) updateData.price = updates.price;
  if (updates.type !== undefined) updateData.type = updates.type;
  if (updates.bedrooms !== undefined) updateData.bedrooms = updates.bedrooms;
  if (updates.bathrooms !== undefined) updateData.bathrooms = updates.bathrooms;
  if (updates.area !== undefined) updateData.area = updates.area;
  if (updates.location !== undefined) updateData.location = updates.location;
  if (updates.images !== undefined) updateData.images = updates.images;
  if (updates.features !== undefined) updateData.features = updates.features;
  if (updates.isPremiumListing !== undefined) updateData.is_premium_listing = updates.isPremiumListing;

  const { data, error } = await supabase
    .from('properties')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return {
    ...data,
    agentId: data.agent_id,
    isPremiumListing: data.is_premium_listing,
    createdAt: data.created_at,
  } as Property;
}

export async function deleteProperty(id: string): Promise<void> {
  const { error } = await supabase
    .from('properties')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function getPropertiesByAgent(agentId: string): Promise<Property[]> {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('agent_id', agentId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []).map(property => ({
    ...property,
    agentId: property.agent_id,
    isPremiumListing: property.is_premium_listing,
    createdAt: property.created_at,
  })) as Property[];
}