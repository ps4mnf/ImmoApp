import { getDatabase, generateId } from './database';
import * as Crypto from 'expo-crypto';

// Current user session
let currentUser: any = null;

// Hash password
async function hashPassword(password: string): Promise<string> {
  return await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    password + 'salt_key_here'
  );
}

// Sign up new user
export async function signUp(email: string, password: string, fullName: string) {
  const db = getDatabase();
  
  try {
    // Check if user already exists
    const existingUser = await db.getFirstAsync(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );
    
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    const userId = generateId();
    const passwordHash = await hashPassword(password);

    await db.runAsync(
      `INSERT INTO users (id, email, password_hash, full_name, is_owner)
       VALUES (?, ?, ?, ?, ?)`,
      [userId, email, passwordHash, fullName, 1]
    );

    // Get the created user
    const user = await db.getFirstAsync(
      'SELECT id, email, full_name, avatar_url, phone, bio, is_agent, is_owner FROM users WHERE id = ?',
      [userId]
    );

    currentUser = user;
    return { user };
  } catch (error) {
    console.error('Sign up error:', error);
    throw error;
  }
}

// Sign in user
export async function signIn(email: string, password: string) {
  const db = getDatabase();
  
  try {
    // For demo purposes, allow login with demo credentials without password check
    if (email === 'john.doe@example.com' && password === 'password123') {
      const user = await db.getFirstAsync(
        `SELECT id, email, full_name, avatar_url, phone, bio, is_agent, is_owner 
         FROM users WHERE email = ?`,
        [email]
      );

      if (user) {
        currentUser = user;
        return { user };
      }
    }

    const passwordHash = await hashPassword(password);
    
    const user = await db.getFirstAsync(
      `SELECT id, email, full_name, avatar_url, phone, bio, is_agent, is_owner 
       FROM users WHERE email = ? AND password_hash = ?`,
      [email, passwordHash]
    );

    if (!user) {
      throw new Error('Invalid email or password');
    }

    currentUser = user;
    return { user };
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
}

// Sign out user
export async function signOut() {
  currentUser = null;
}

// Get current user
export async function getCurrentUser() {
  return currentUser;
}

// Update user profile
export async function updateUserProfile(userId: string, updates: any) {
  const db = getDatabase();
  
  try {
    const setClause = Object.keys(updates)
      .map(key => `${key} = ?`)
      .join(', ');
    
    const values = Object.values(updates);
    values.push(userId);

    await db.runAsync(
      `UPDATE users SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      values
    );

    // Get updated user
    const user = await db.getFirstAsync(
      'SELECT id, email, full_name, avatar_url, phone, bio, is_agent, is_owner FROM users WHERE id = ?',
      [userId]
    );

    if (currentUser && currentUser.id === userId) {
      currentUser = user;
    }

    return user;
  } catch (error) {
    console.error('Update user profile error:', error);
    throw error;
  }
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  return currentUser !== null;
}

// Get user session
export function getSession() {
  return currentUser ? { user: currentUser } : null;
}