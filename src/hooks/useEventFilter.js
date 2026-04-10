import { useMemo } from 'react';
import { getEvents } from '../services/eventService';
import { getPersonalizedEvents } from '../services/aiService';

export const useEventFilter = (filters) =>
  useMemo(() => {
    const filtered = getEvents(filters);
    const personalized = getPersonalizedEvents(filtered);

    return {
      filteredEvents:
        filters.sortBy === 'price'
          ? [...filtered].sort((left, right) => left.priceRange.min - right.priceRange.min)
          : filters.sortBy === 'date'
            ? [...filtered].sort(
                (left, right) => new Date(left.showtimes[0]?.date ?? 0) - new Date(right.showtimes[0]?.date ?? 0),
              )
            : filters.sortBy === 'popularity'
              ? [...filtered].sort((left, right) => left.availabilityPercent - right.availabilityPercent)
              : personalized,
      personalizedEvents: personalized.slice(0, 5),
    };
  }, [filters]);
