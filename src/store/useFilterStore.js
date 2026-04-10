import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useFilterStore = create(
  persist(
    (set) => ({
      searchQuery: '',
      genres: [],
      dateRange: { from: '', to: '' },
      priceRange: { min: 0, max: 10000 },
      venue: '',
      viewMode: 'grid',
      sortBy: 'recommended',
      setFilter: (key, value) => set({ [key]: value }),
      toggleGenre: (genre) =>
        set((state) => ({
          genres: state.genres.includes(genre)
            ? state.genres.filter((item) => item !== genre)
            : [...state.genres, genre],
        })),
      resetFilters: () =>
        set({
          searchQuery: '',
          genres: [],
          dateRange: { from: '', to: '' },
          priceRange: { min: 0, max: 10000 },
          venue: '',
          sortBy: 'recommended',
        }),
      setViewMode: (mode) => set({ viewMode: mode }),
    }),
    {
      name: 'itsmyscreen-filter-store',
      partialize: (state) => ({
        viewMode: state.viewMode,
        sortBy: state.sortBy,
      }),
    },
  ),
);
