export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          phone: string | null
          bio: string | null
          is_agent: boolean
          is_owner: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          bio?: string | null
          is_agent?: boolean
          is_owner?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          bio?: string | null
          is_agent?: boolean
          is_owner?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      properties: {
        Row: {
          id: string
          title: string
          description: string | null
          price: number
          type: 'sale' | 'rent'
          bedrooms: number
          bathrooms: number
          area: number
          location: string
          images: string[]
          features: string[] | null
          agent_id: string | null
          is_premium_listing: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          price: number
          type: 'sale' | 'rent'
          bedrooms: number
          bathrooms: number
          area: number
          location: string
          images: string[]
          features?: string[] | null
          agent_id?: string | null
          is_premium_listing?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          price?: number
          type?: 'sale' | 'rent'
          bedrooms?: number
          bathrooms?: number
          area?: number
          location?: string
          images?: string[]
          features?: string[] | null
          agent_id?: string | null
          is_premium_listing?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      owner_profiles: {
        Row: {
          id: string
          user_id: string
          business_name: string | null
          business_description: string | null
          business_logo: string | null
          cover_image: string | null
          intro_video: string | null
          website_url: string | null
          social_media: Json
          business_hours: Json
          service_areas: string[] | null
          specialties: string[] | null
          years_experience: number | null
          total_properties: number
          rating: number
          review_count: number
          is_verified: boolean
          subscription_tier: 'basic' | 'premium' | 'professional'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          business_name?: string | null
          business_description?: string | null
          business_logo?: string | null
          cover_image?: string | null
          intro_video?: string | null
          website_url?: string | null
          social_media?: Json
          business_hours?: Json
          service_areas?: string[] | null
          specialties?: string[] | null
          years_experience?: number | null
          total_properties?: number
          rating?: number
          review_count?: number
          is_verified?: boolean
          subscription_tier?: 'basic' | 'premium' | 'professional'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          business_name?: string | null
          business_description?: string | null
          business_logo?: string | null
          cover_image?: string | null
          intro_video?: string | null
          website_url?: string | null
          social_media?: Json
          business_hours?: Json
          service_areas?: string[] | null
          specialties?: string[] | null
          years_experience?: number | null
          total_properties?: number
          rating?: number
          review_count?: number
          is_verified?: boolean
          subscription_tier?: 'basic' | 'premium' | 'professional'
          created_at?: string
          updated_at?: string
        }
      }
      property_media: {
        Row: {
          id: string
          property_id: string
          media_type: 'image' | 'video' | 'virtual_tour'
          media_url: string
          thumbnail_url: string | null
          title: string | null
          description: string | null
          display_order: number
          is_primary: boolean
          created_at: string
        }
        Insert: {
          id?: string
          property_id: string
          media_type: 'image' | 'video' | 'virtual_tour'
          media_url: string
          thumbnail_url?: string | null
          title?: string | null
          description?: string | null
          display_order?: number
          is_primary?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          media_type?: 'image' | 'video' | 'virtual_tour'
          media_url?: string
          thumbnail_url?: string | null
          title?: string | null
          description?: string | null
          display_order?: number
          is_primary?: boolean
          created_at?: string
        }
      }
      featured_properties: {
        Row: {
          id: string
          property_id: string
          owner_id: string
          feature_type: 'homepage_hero' | 'premium_listing' | 'sponsored'
          start_date: string
          end_date: string | null
          priority: number
          payment_amount: number | null
          payment_status: 'pending' | 'paid' | 'expired'
          created_at: string
        }
        Insert: {
          id?: string
          property_id: string
          owner_id: string
          feature_type: 'homepage_hero' | 'premium_listing' | 'sponsored'
          start_date?: string
          end_date?: string | null
          priority?: number
          payment_amount?: number | null
          payment_status?: 'pending' | 'paid' | 'expired'
          created_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          owner_id?: string
          feature_type?: 'homepage_hero' | 'premium_listing' | 'sponsored'
          start_date?: string
          end_date?: string | null
          priority?: number
          payment_amount?: number | null
          payment_status?: 'pending' | 'paid' | 'expired'
          created_at?: string
        }
      }
      favorites: {
        Row: {
          id: string
          user_id: string
          property_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          property_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          property_id?: string
          created_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          sender_id: string
          receiver_id: string
          property_id: string | null
          content: string
          read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          sender_id: string
          receiver_id: string
          property_id?: string | null
          content: string
          read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          sender_id?: string
          receiver_id?: string
          property_id?: string | null
          content?: string
          read?: boolean
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}