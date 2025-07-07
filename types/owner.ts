export type OwnerProfile = {
  id: string;
  userId: string;
  businessName?: string;
  businessDescription?: string;
  businessLogo?: string;
  coverImage?: string;
  introVideo?: string;
  websiteUrl?: string;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
  businessHours?: {
    [key: string]: {
      open: string;
      close: string;
      isOpen: boolean;
    };
  };
  serviceAreas?: string[];
  specialties?: string[];
  yearsExperience?: number;
  totalProperties: number;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  subscriptionTier: 'basic' | 'premium' | 'professional';
  createdAt: string;
  updatedAt: string;
};

export type PropertyMedia = {
  id: string;
  propertyId: string;
  mediaType: 'image' | 'video' | 'virtual_tour';
  mediaUrl: string;
  thumbnailUrl?: string;
  title?: string;
  description?: string;
  displayOrder: number;
  isPrimary: boolean;
  createdAt: string;
};

export type FeaturedProperty = {
  id: string;
  propertyId: string;
  ownerId: string;
  featureType: 'homepage_hero' | 'premium_listing' | 'sponsored';
  startDate: string;
  endDate?: string;
  priority: number;
  paymentAmount?: number;
  paymentStatus: 'pending' | 'paid' | 'expired';
  createdAt: string;
};

export type PropertyPricing = {
  id: string;
  propertyId: string;
  pricingType: 'sale' | 'rent' | 'lease' | 'auction';
  basePrice: number;
  currency: string;
  pricePerPeriod?: string;
  negotiable: boolean;
  priceHistory: Array<{
    price: number;
    date: string;
    reason?: string;
  }>;
  specialOffers?: {
    discount?: number;
    validUntil?: string;
    description?: string;
  };
  createdAt: string;
  updatedAt: string;
};

export type OwnerReview = {
  id: string;
  ownerId: string;
  reviewerId: string;
  propertyId?: string;
  rating: number;
  reviewText?: string;
  responseText?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
};