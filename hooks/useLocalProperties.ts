import { useState, useEffect } from 'react';
import { getProperties } from '@/services/localProperties';
import type { Property } from '@/types';

export function useProperties(filters?: {
  type?: 'sale' | 'rent';
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  location?: string;
}) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchProperties();
  }, [filters]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProperties(filters);
      setProperties(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch properties'));
    } finally {
      setLoading(false);
    }
  };

  return { 
    properties, 
    loading, 
    error,
    refetch: fetchProperties 
  };
}