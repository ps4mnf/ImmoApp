import { useState, useEffect } from 'react';
import { getProperties } from '@/services/properties';
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
    async function fetchProperties() {
      try {
        setLoading(true);
        const data = await getProperties(filters);
        setProperties(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch properties'));
      } finally {
        setLoading(false);
      }
    }

    fetchProperties();
  }, [filters]);

  return { properties, loading, error };
}