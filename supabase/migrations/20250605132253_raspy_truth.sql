/*
  # Initial Schema Setup for Real Estate Application

  1. New Tables
    - users
      - Custom user data extending auth.users
    - properties
      - Property listings with details
    - favorites
      - User's favorite properties
    - messages
      - Communication between users
    
  2. Security
    - Enable RLS on all tables
    - Set up access policies for each table
*/

-- Create custom user profiles table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  is_agent BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create properties table
CREATE TABLE IF NOT EXISTS properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('sale', 'rent')),
  bedrooms INTEGER NOT NULL,
  bathrooms DECIMAL NOT NULL,
  area DECIMAL NOT NULL,
  location TEXT NOT NULL,
  images TEXT[] NOT NULL,
  features TEXT[],
  agent_id UUID REFERENCES users(id) ON DELETE CASCADE,
  is_premium_listing BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, property_id)
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES users(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Users Policies
CREATE POLICY "Users can read their own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Properties Policies
CREATE POLICY "Anyone can view properties"
  ON properties FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Agents can create properties"
  ON properties FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND is_agent = true
    )
  );

CREATE POLICY "Agents can update their own properties"
  ON properties FOR UPDATE
  TO authenticated
  USING (agent_id = auth.uid());

-- Favorites Policies
CREATE POLICY "Users can manage their favorites"
  ON favorites FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Messages Policies
CREATE POLICY "Users can read their messages"
  ON messages FOR SELECT
  TO authenticated
  USING (
    sender_id = auth.uid() OR
    receiver_id = auth.uid()
  );

CREATE POLICY "Users can send messages"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Users can update their sent messages"
  ON messages FOR UPDATE
  TO authenticated
  USING (sender_id = auth.uid());