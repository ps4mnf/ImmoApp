export type User = {
  id: string;
  email: string;
  fullName: string;
  isAgent: boolean;
  isPremium: boolean;
  createdAt: string;
};

export type Property = {
  id: string;
  title: string;
  description: string;
  price: number;
  type: 'sale' | 'rent';
  bedrooms: number;
  bathrooms: number;
  area: number;
  location: string;
  images: string[];
  features: string[];
  agentId: string;
  isPremiumListing: boolean;
  createdAt: string;
};

export type Message = {
  id: string;
  senderId: string;
  receiverId: string;
  propertyId: string;
  content: string;
  createdAt: string;
  read: boolean;
};

export type Subscription = {
  id: string;
  userId: string;
  plan: 'basic' | 'premium' | 'professional';
  status: 'active' | 'cancelled' | 'expired';
  startDate: string;
  endDate: string;
};