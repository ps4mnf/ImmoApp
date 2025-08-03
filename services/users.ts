import { supabase } from './supabase';

export type UserProfile = {
  id: string;
  fullName: string;
  avatarUrl?: string;
  phone?: string;
  bio?: string;
  isAgent: boolean;
  isOwner: boolean;
  createdAt: string;
  updatedAt: string;
};

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  
  if (!data) return null;
  
  return {
    id: data.id,
    fullName: data.full_name || '',
    avatarUrl: data.avatar_url,
    phone: data.phone,
    bio: data.bio,
    isAgent: data.is_agent,
    isOwner: data.is_owner,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

export async function createUserProfile(profile: {
  id: string;
  fullName: string;
  phone?: string;
  bio?: string;
  isAgent?: boolean;
  isOwner?: boolean;
}): Promise<UserProfile> {
  const { data, error } = await supabase
    .from('users')
    .insert({
      id: profile.id,
      full_name: profile.fullName,
      phone: profile.phone,
      bio: profile.bio,
      is_agent: profile.isAgent || false,
      is_owner: profile.isOwner || false,
    })
    .select()
    .single();

  if (error) throw error;
  
  return {
    id: data.id,
    fullName: data.full_name || '',
    avatarUrl: data.avatar_url,
    phone: data.phone,
    bio: data.bio,
    isAgent: data.is_agent,
    isOwner: data.is_owner,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

export async function updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
  const updateData: any = {};
  
  if (updates.fullName !== undefined) updateData.full_name = updates.fullName;
  if (updates.avatarUrl !== undefined) updateData.avatar_url = updates.avatarUrl;
  if (updates.phone !== undefined) updateData.phone = updates.phone;
  if (updates.bio !== undefined) updateData.bio = updates.bio;
  if (updates.isAgent !== undefined) updateData.is_agent = updates.isAgent;
  if (updates.isOwner !== undefined) updateData.is_owner = updates.isOwner;

  const { data, error } = await supabase
    .from('users')
    .update(updateData)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  
  return {
    id: data.id,
    fullName: data.full_name || '',
    avatarUrl: data.avatar_url,
    phone: data.phone,
    bio: data.bio,
    isAgent: data.is_agent,
    isOwner: data.is_owner,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

export async function getAllUsers(): Promise<UserProfile[]> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  
  return (data || []).map(user => ({
    id: user.id,
    fullName: user.full_name || '',
    avatarUrl: user.avatar_url,
    phone: user.phone,
    bio: user.bio,
    isAgent: user.is_agent,
    isOwner: user.is_owner,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
  }));
}