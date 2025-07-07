import * as SQLite from 'expo-sqlite';
import uuid from 'react-native-uuid';

// Database instance
let db: SQLite.SQLiteDatabase;

// Initialize database
export async function initializeDatabase() {
  try {
    db = await SQLite.openDatabaseAsync('realEstate.db');
    await createTables();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
}

// Create all necessary tables
async function createTables() {
  // Users table
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      full_name TEXT,
      avatar_url TEXT,
      phone TEXT,
      bio TEXT,
      is_agent BOOLEAN DEFAULT 0,
      is_owner BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Owner profiles table
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS owner_profiles (
      id TEXT PRIMARY KEY,
      user_id TEXT UNIQUE NOT NULL,
      business_name TEXT,
      business_description TEXT,
      business_logo TEXT,
      cover_image TEXT,
      intro_video TEXT,
      website_url TEXT,
      social_media TEXT DEFAULT '{}',
      business_hours TEXT DEFAULT '{}',
      service_areas TEXT DEFAULT '[]',
      specialties TEXT DEFAULT '[]',
      years_experience INTEGER DEFAULT 0,
      total_properties INTEGER DEFAULT 0,
      rating REAL DEFAULT 0,
      review_count INTEGER DEFAULT 0,
      is_verified BOOLEAN DEFAULT 0,
      subscription_tier TEXT DEFAULT 'basic',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    );
  `);

  // Properties table
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS properties (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      type TEXT NOT NULL CHECK (type IN ('sale', 'rent')),
      bedrooms INTEGER NOT NULL,
      bathrooms REAL NOT NULL,
      area REAL NOT NULL,
      location TEXT NOT NULL,
      images TEXT NOT NULL DEFAULT '[]',
      features TEXT DEFAULT '[]',
      agent_id TEXT,
      is_premium_listing BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (agent_id) REFERENCES users (id) ON DELETE CASCADE
    );
  `);

  // Property media table
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS property_media (
      id TEXT PRIMARY KEY,
      property_id TEXT NOT NULL,
      media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video', 'virtual_tour')),
      media_url TEXT NOT NULL,
      thumbnail_url TEXT,
      title TEXT,
      description TEXT,
      display_order INTEGER DEFAULT 0,
      is_primary BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (property_id) REFERENCES properties (id) ON DELETE CASCADE
    );
  `);

  // Featured properties table
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS featured_properties (
      id TEXT PRIMARY KEY,
      property_id TEXT NOT NULL,
      owner_id TEXT NOT NULL,
      feature_type TEXT NOT NULL CHECK (feature_type IN ('homepage_hero', 'premium_listing', 'sponsored')),
      start_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      end_date DATETIME,
      priority INTEGER DEFAULT 0,
      payment_amount REAL,
      payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'expired')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (property_id) REFERENCES properties (id) ON DELETE CASCADE,
      FOREIGN KEY (owner_id) REFERENCES users (id) ON DELETE CASCADE
    );
  `);

  // Property pricing table
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS property_pricing (
      id TEXT PRIMARY KEY,
      property_id TEXT NOT NULL,
      pricing_type TEXT NOT NULL CHECK (pricing_type IN ('sale', 'rent', 'lease', 'auction')),
      base_price REAL NOT NULL,
      currency TEXT DEFAULT 'USD',
      price_per TEXT,
      negotiable BOOLEAN DEFAULT 1,
      price_history TEXT DEFAULT '[]',
      special_offers TEXT DEFAULT '{}',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (property_id) REFERENCES properties (id) ON DELETE CASCADE
    );
  `);

  // Owner reviews table
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS owner_reviews (
      id TEXT PRIMARY KEY,
      owner_id TEXT NOT NULL,
      reviewer_id TEXT NOT NULL,
      property_id TEXT,
      rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
      review_text TEXT,
      response_text TEXT,
      is_verified BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (owner_id) REFERENCES users (id) ON DELETE CASCADE,
      FOREIGN KEY (reviewer_id) REFERENCES users (id) ON DELETE CASCADE,
      FOREIGN KEY (property_id) REFERENCES properties (id) ON DELETE SET NULL
    );
  `);

  // Favorites table
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS favorites (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      property_id TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
      FOREIGN KEY (property_id) REFERENCES properties (id) ON DELETE CASCADE,
      UNIQUE(user_id, property_id)
    );
  `);

  // Messages table
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      sender_id TEXT NOT NULL,
      receiver_id TEXT NOT NULL,
      property_id TEXT,
      content TEXT NOT NULL,
      read BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (sender_id) REFERENCES users (id) ON DELETE CASCADE,
      FOREIGN KEY (receiver_id) REFERENCES users (id) ON DELETE CASCADE,
      FOREIGN KEY (property_id) REFERENCES properties (id) ON DELETE CASCADE
    );
  `);

  // Create indexes for better performance
  await db.execAsync(`
    CREATE INDEX IF NOT EXISTS idx_properties_agent_id ON properties(agent_id);
    CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(type);
    CREATE INDEX IF NOT EXISTS idx_properties_location ON properties(location);
    CREATE INDEX IF NOT EXISTS idx_property_media_property_id ON property_media(property_id);
    CREATE INDEX IF NOT EXISTS idx_featured_properties_feature_type ON featured_properties(feature_type);
    CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
    CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
    CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON messages(receiver_id);
  `);

  // Insert sample data
  await insertSampleData();
}

// Insert sample data for testing
async function insertSampleData() {
  try {
    // Check if data already exists
    const existingUsers = await db.getFirstAsync('SELECT COUNT(*) as count FROM users');
    if (existingUsers && (existingUsers as any).count > 0) {
      return; // Data already exists
    }

    // Sample users
    const sampleUsers = [
      {
        id: uuid.v4() as string,
        email: 'john.doe@example.com',
        password_hash: 'hashed_password_1',
        full_name: 'John Doe',
        avatar_url: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg',
        phone: '+1234567890',
        bio: 'Experienced real estate professional',
        is_agent: 1,
        is_owner: 1,
      },
      {
        id: uuid.v4() as string,
        email: 'sarah.wilson@example.com',
        password_hash: 'hashed_password_2',
        full_name: 'Sarah Wilson',
        avatar_url: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
        phone: '+1234567891',
        bio: 'Luxury property specialist',
        is_agent: 1,
        is_owner: 1,
      },
    ];

    for (const user of sampleUsers) {
      await db.runAsync(
        `INSERT INTO users (id, email, password_hash, full_name, avatar_url, phone, bio, is_agent, is_owner)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [user.id, user.email, user.password_hash, user.full_name, user.avatar_url, user.phone, user.bio, user.is_agent, user.is_owner]
      );

      // Create owner profile
      await db.runAsync(
        `INSERT INTO owner_profiles (id, user_id, business_name, business_description, years_experience, subscription_tier)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          uuid.v4() as string,
          user.id,
          `${user.full_name} Real Estate`,
          'Professional real estate services with years of experience',
          Math.floor(Math.random() * 15) + 5,
          Math.random() > 0.5 ? 'premium' : 'basic'
        ]
      );
    }

    // Sample properties
    const sampleProperties = [
      {
        id: uuid.v4() as string,
        title: 'Luxury Villa with Ocean View',
        description: 'This stunning oceanfront villa offers breathtaking views and luxurious living spaces.',
        price: 1200000,
        type: 'sale',
        bedrooms: 4,
        bathrooms: 3.5,
        area: 3500,
        location: 'Miami Beach, FL',
        images: JSON.stringify(['https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg']),
        features: JSON.stringify(['Ocean View', 'Private Pool', 'Gourmet Kitchen']),
        agent_id: sampleUsers[0].id,
        is_premium_listing: 1,
      },
      {
        id: uuid.v4() as string,
        title: 'Modern Downtown Apartment',
        description: 'Contemporary apartment in the heart of the city with all modern amenities.',
        price: 2500,
        type: 'rent',
        bedrooms: 2,
        bathrooms: 2,
        area: 1200,
        location: 'New York, NY',
        images: JSON.stringify(['https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg']),
        features: JSON.stringify(['City View', 'Modern Kitchen', 'Gym Access']),
        agent_id: sampleUsers[1].id,
        is_premium_listing: 1,
      },
    ];

    for (const property of sampleProperties) {
      await db.runAsync(
        `INSERT INTO properties (id, title, description, price, type, bedrooms, bathrooms, area, location, images, features, agent_id, is_premium_listing)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          property.id, property.title, property.description, property.price, property.type,
          property.bedrooms, property.bathrooms, property.area, property.location,
          property.images, property.features, property.agent_id, property.is_premium_listing
        ]
      );
    }

    console.log('Sample data inserted successfully');
  } catch (error) {
    console.error('Error inserting sample data:', error);
  }
}

// Get database instance
export function getDatabase() {
  if (!db) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  return db;
}

// Utility function to generate UUID
export function generateId(): string {
  return uuid.v4() as string;
}