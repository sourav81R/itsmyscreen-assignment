import { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import AIRecommendedBanner from '../components/discovery/AIRecommendedBanner';
import EventCard from '../components/discovery/EventCard';
import FilterPanel from '../components/discovery/FilterPanel';
import SearchBar from '../components/discovery/SearchBar';
import ViewToggle from '../components/discovery/ViewToggle';
import Button from '../components/shared/Button';
import PageWrapper from '../components/layout/PageWrapper';
import { venues } from '../data/venues';
import { useEventFilter } from '../hooks/useEventFilter';
import { useFilterStore } from '../store/useFilterStore';

const skeletonCards = Array.from({ length: 12 }, (_, index) => `skeleton-${index}`);

/**
 * Event discovery screen with filters, AI recommendations, and browse results.
 * Props: city.
 */
function DiscoveryPage({ city }) {
  const searchQuery = useFilterStore((state) => state.searchQuery);
  const genres = useFilterStore((state) => state.genres);
  const dateRange = useFilterStore((state) => state.dateRange);
  const priceRange = useFilterStore((state) => state.priceRange);
  const venue = useFilterStore((state) => state.venue);
  const viewMode = useFilterStore((state) => state.viewMode);
  const sortBy = useFilterStore((state) => state.sortBy);
  const setFilter = useFilterStore((state) => state.setFilter);
  const resetFilters = useFilterStore((state) => state.resetFilters);
  const [isBooting, setIsBooting] = useState(true);

  useEffect(() => {
    const timeout = window.setTimeout(() => setIsBooting(false), 650);
    return () => window.clearTimeout(timeout);
  }, []);

  const filteredInputs = useMemo(
    () => ({
      searchQuery,
      genres,
      dateRange,
      priceRange,
      venue,
      viewMode,
      sortBy,
    }),
    [dateRange, genres, priceRange, searchQuery, sortBy, venue, viewMode],
  );
  const { filteredEvents, personalizedEvents } = useEventFilter(filteredInputs);

  const cityEvents = useMemo(
    () => filteredEvents.filter((event) => event.venue.city === city),
    [city, filteredEvents],
  );
  const recommendedEvents = useMemo(
    () => personalizedEvents.filter((event) => event.venue.city === city).slice(0, 5),
    [city, personalizedEvents],
  );

  return (
    <PageWrapper className="mx-auto max-w-[1440px] px-8 pb-12 pt-8">
      <div className="grid grid-cols-[300px_minmax(0,1fr)] gap-8">
        <FilterPanel venues={venues.filter((venue) => venue.city === city)} />

        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <SearchBar />
            <ViewToggle />
          </div>

          <AIRecommendedBanner events={recommendedEvents} />

          <section className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-[var(--color-text-muted)]">{city}</p>
                <h1 className="mt-2 font-display text-5xl text-[var(--color-text-primary)]">All Events</h1>
                <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                  {cityEvents.length} results curated for a premium live-night shortlist.
                </p>
              </div>
              <label className="rounded-full border border-[var(--color-border-subtle)] bg-[rgba(255,255,255,0.04)] px-4 py-3 text-sm text-[var(--color-text-secondary)]">
                <span className="mr-2 text-xs uppercase tracking-[0.18em]">Sort</span>
                <select
                  value={sortBy}
                  onChange={(event) => setFilter('sortBy', event.target.value)}
                  className="bg-transparent text-[var(--color-text-primary)] outline-none"
                >
                  <option value="recommended" className="bg-[var(--color-bg-surface)]">
                    Recommended
                  </option>
                  <option value="date" className="bg-[var(--color-bg-surface)]">
                    Date
                  </option>
                  <option value="price" className="bg-[var(--color-bg-surface)]">
                    Price
                  </option>
                  <option value="popularity" className="bg-[var(--color-bg-surface)]">
                    Popularity
                  </option>
                </select>
              </label>
            </div>

            {isBooting ? (
              <div className="grid grid-cols-4 gap-5">
                {skeletonCards.map((key) => (
                  <div
                    key={key}
                    className="h-[380px] rounded-[28px] border border-[var(--color-border-subtle)] bg-shimmer bg-[length:200%_100%] animate-shimmer"
                  />
                ))}
              </div>
            ) : cityEvents.length > 0 ? (
              <div
                className={
                  viewMode === 'grid' ? 'grid grid-cols-4 gap-5' : 'flex flex-col gap-5'
                }
              >
                {cityEvents.map((event) => (
                  <EventCard key={event.id} event={event} viewMode={viewMode} />
                ))}
              </div>
            ) : (
              <div className="editorial-panel flex min-h-[320px] flex-col items-center justify-center rounded-[32px] px-8 text-center">
                <p className="font-display text-4xl text-[var(--color-text-primary)]">No events match your filters</p>
                <p className="mt-3 max-w-xl text-[var(--color-text-secondary)]">
                  Try widening the date or price range, or reset everything to jump back into the full city lineup.
                </p>
                <Button className="mt-6" variant="secondary" onClick={resetFilters}>
                  Reset Filters
                </Button>
              </div>
            )}
          </section>
        </section>
      </div>
    </PageWrapper>
  );
}

DiscoveryPage.propTypes = {
  city: PropTypes.string.isRequired,
};

export default DiscoveryPage;
