import { events } from '../data/events';
import { showtimesByEvent } from '../data/showtimes';
import { venueMap } from '../data/venues';

const hydrateEvent = (event) => ({
  ...event,
  venue: venueMap[event.venueId],
  showtimes: showtimesByEvent[event.id] ?? [],
});

/**
 * Returns filtered events based on discovery filters.
 * @param {Object} filters
 * @returns {Array}
 */
export const getEvents = (filters = {}) => {
  const {
    searchQuery = '',
    genres = [],
    priceRange = { min: 0, max: 10000 },
    venue = '',
    dateRange = { from: '', to: '' },
  } = filters;

  return events
    .map(hydrateEvent)
    .filter((event) => {
      const matchesSearch =
        !searchQuery ||
        `${event.title} ${event.artist}`.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGenres = genres.length === 0 || genres.some((genre) => event.genre.includes(genre));
      const matchesPrice =
        event.priceRange.max >= priceRange.min && event.priceRange.min <= priceRange.max;
      const matchesVenue = !venue || event.venueId === venue;
      const matchesDate =
        !dateRange.from ||
        !dateRange.to ||
        event.showtimes.some((showtime) => showtime.date >= dateRange.from && showtime.date <= dateRange.to);

      return matchesSearch && matchesGenres && matchesPrice && matchesVenue && matchesDate;
    });
};

/**
 * Returns a single event by id.
 * @param {string} id
 * @returns {Object | undefined}
 */
export const getEventById = (id) => {
  const event = events.find((item) => item.id === id);
  return event ? hydrateEvent(event) : undefined;
};

/**
 * Returns top title and artist matches for autocomplete.
 * @param {string} query
 * @returns {Array}
 */
export const searchEvents = (query = '') => {
  if (!query.trim()) {
    return [];
  }

  return events
    .filter((event) => `${event.title} ${event.artist}`.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 5)
    .map(hydrateEvent);
};
