/*
  # Owner Profile Management System

  1. New Tables
    - owner_profiles
      - Extended profile information for property owners
      - Media storage (images, videos)
      - Business information
    - property_media
      - Separate table for property images and videos
    - featured_properties
      - Properties selected for front page display
    - property_pricing
      - Flexible pricing options and packages
    
  2. Security
    - Enable RLS on all tables
    - Owner-specific access policies
    - Media upload permissions
*/

-- Extend users table for owner profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'is_owner'
  ) THEN
    ALTER TABLE users ADD COLUMN is_owner BOOLEAN DEFAULT false;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'phone'
  ) THEN
    ALTER TABLE users ADD COLUMN phone TEXT;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'bio'
  ) THEN
    ALTER TABLE users ADD COLUMN bio TEXT;
  END IF;
END $$;

-- Create owner profiles table
CREATE TABLE IF NOT EXISTS owner_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  business_name TEXT,
  business_description TEXT,
  business_logo TEXT,
  cover_image TEXT,
  intro_video TEXT,
  website_url TEXT,
  social_media JSONB DEFAULT '{}',
  business_hours JSONB DEFAULT '{}',
  service_areas TEXT[],
  specialties TEXT[],
  years_experience INTEGER,
  total_properties INTEGER DEFAULT 0,
  rating DECIMAL DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  subscription_tier TEXT DEFAULT 'basic' CHECK (subscription_tier IN ('basic', 'premium', 'professional')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

-- Create property media table
CREATE TABLE IF NOT EXISTS property_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video', 'virtual_tour')),
  media_url TEXT NOT NULL,
  thumbnail_url TEXT,
  title TEXT,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create featured properties table
CREATE TABLE IF NOT EXISTS featured_properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
  feature_type TEXT NOT NULL CHECK (feature_type IN ('homepage_hero', 'premium_listing', 'sponsored')),
  start_date TIMESTAMPTZ DEFAULT now(),
  end_date TIMESTAMPTZ,
  priority INTEGER DEFAULT 0,
  payment_amount DECIMAL,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'expired')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(property_id, feature_type)
);

-- Create property pricing table
CREATE TABLE IF NOT EXISTS property_pricing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  pricing_type TEXT NOT NULL CHECK (pricing_type IN ('sale', 'rent', 'lease', 'auction')),
  base_price DECIMAL NOT NULL,
  currency TEXT DEFAULT 'USD',
  price_per TEXT, -- 'month', 'week', 'night', etc.
  negotiable BOOLEAN DEFAULT true,
  price_history JSONB DEFAULT '[]',
  special_offers JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS owner_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  response_text TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE owner_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE featured_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE owner_reviews ENABLE ROW LEVEL SECURITY;

-- Owner Profiles Policies
CREATE POLICY "Owners can manage their own profile"
  ON owner_profiles FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Anyone can view owner profiles"
  ON owner_profiles FOR SELECT
  TO authenticated
  USING (true);

-- Property Media Policies
CREATE POLICY "Property owners can manage their media"
  ON property_media FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM properties
      WHERE id = property_media.property_id
      AND agent_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can view property media"
  ON property_media FOR SELECT
  TO authenticated
  USING (true);

-- Featured Properties Policies
CREATE POLICY "Owners can manage their featured properties"
  ON featured_properties FOR ALL
  TO authenticated
  USING (owner_id = auth.uid());

CREATE POLICY "Anyone can view featured properties"
  ON featured_properties FOR SELECT
  TO authenticated
  USING (true);

-- Property Pricing Policies
CREATE POLICY "Property owners can manage pricing"
  ON property_pricing FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM properties
      WHERE id = property_pricing.property_id
      AND agent_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can view property pricing"
  ON property_pricing FOR SELECT
  TO authenticated
  USING (true);

-- Owner Reviews Policies
CREATE POLICY "Users can create reviews"
  ON owner_reviews FOR INSERT
  TO authenticated
  WITH CHECK (reviewer_id = auth.uid());

CREATE POLICY "Owners can respond to their reviews"
  ON owner_reviews FOR UPDATE
  TO authenticated
  USING (owner_id = auth.uid());

CREATE POLICY "Anyone can view reviews"
  ON owner_reviews FOR SELECT
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_owner_profiles_user_id ON owner_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_property_media_property_id ON property_media(property_id);
CREATE INDEX IF NOT EXISTS idx_featured_properties_property_id ON featured_properties(property_id);
CREATE INDEX IF NOT EXISTS idx_featured_properties_feature_type ON featured_properties(feature_type);
CREATE INDEX IF NOT EXISTS idx_property_pricing_property_id ON property_pricing(property_id);
CREATE INDEX IF NOT EXISTS idx_owner_reviews_owner_id ON owner_reviews(owner_id);

-- Create functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_owner_profiles_updated_at BEFORE UPDATE ON owner_profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_property_pricing_updated_at BEFORE UPDATE ON property_pricing FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_owner_reviews_updated_at BEFORE UPDATE ON owner_reviews FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();