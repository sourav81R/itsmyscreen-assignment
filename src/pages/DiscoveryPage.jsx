import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import PropTypes from 'prop-types';
import AIRecommendedBanner from '../components/discovery/AIRecommendedBanner';
import EventCard from '../components/discovery/EventCard';
import FilterPanel from '../components/discovery/FilterPanel';
import SearchBar from '../components/discovery/SearchBar';
import SortDropdown from '../components/discovery/SortDropdown';
import ViewToggle from '../components/discovery/ViewToggle';
import Button from '../components/shared/Button';
import PageWrapper from '../components/layout/PageWrapper';
import { venues } from '../data/venues';
import { useEventFilter } from '../hooks/useEventFilter';
import { useIsMobile, useIsTablet } from '../hooks/useMediaQuery';
import { useFilterStore } from '../store/useFilterStore';

const skeletonCards = Array.from({ length: 12 }, (_, index) => `skeleton-${index}`);

function FilterSheet({ open, onClose, children }) {
  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            aria-label="Close filters"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-[rgba(10,10,15,0.68)] backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-[28px] px-4 pb-4 pt-3"
          >
            {children}
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}

FilterSheet.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

/**
 * Event discovery screen with filters, AI recommendations, and browse results.
 * Props: city.
 */
function DiscoveryPage({ city }) {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
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
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [tabletFiltersOpen, setTabletFiltersOpen] = useState(false);

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
  const recommendedEvents = useMemo(() => {
    const cityFirst = personalizedEvents.filter((event) => event.venue.city === city);
    const outsideCity = personalizedEvents.filter((event) => event.venue.city !== city);
    return [...cityFirst, ...outsideCity].slice(0, 10);
  }, [city, personalizedEvents]);

  const activeFilterCount = useMemo(() => {
    let count = 0;

    count += genres.length;
    count += dateRange.from ? 1 : 0;
    count += dateRange.to ? 1 : 0;
    count += venue ? 1 : 0;
    count += priceRange.min !== 0 || priceRange.max !== 10000 ? 1 : 0;

    return count;
  }, [dateRange.from, dateRange.to, genres.length, priceRange.max, priceRange.min, venue]);

  useEffect(() => {
    if (!isMobile && mobileFiltersOpen) {
      const frame = window.requestAnimationFrame(() => setMobileFiltersOpen(false));
      return () => window.cancelAnimationFrame(frame);
    }
    return undefined;
  }, [isMobile, mobileFiltersOpen]);

  useEffect(() => {
    if (!isTablet && tabletFiltersOpen) {
      const frame = window.requestAnimationFrame(() => setTabletFiltersOpen(false));
      return () => window.cancelAnimationFrame(frame);
    }
    return undefined;
  }, [isTablet, tabletFiltersOpen]);

  const showSidebar = !isMobile && (!isTablet || tabletFiltersOpen);

  return (
    <>
      <PageWrapper className="mx-auto max-w-[1440px] px-3 pb-10 pt-3 xs:px-4 md:px-6 md:pb-12 md:pt-6 xl:px-8">
        <div className="grid gap-5 md:gap-6 lg:grid-cols-[300px_minmax(0,1fr)] xl:gap-8">
          {showSidebar ? (
            <FilterPanel venues={venues.filter((venue) => venue.city === city)} className={isTablet ? 'static top-auto' : ''} />
          ) : null}

          <section className="min-w-0 space-y-5 md:space-y-8">
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <SearchBar />
              <div className="hidden md:block">
                <ViewToggle />
              </div>
            </div>

            {isMobile ? (
              <div
                className="sticky top-[72px] z-20 flex items-center justify-between gap-2 border-b border-[rgba(255,255,255,0.06)] py-2 md:hidden"
                style={{ background: '#0A0A0F' }}
              >
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(true)}
                  className="premium-chip rounded-full px-4 py-2 text-sm text-[var(--color-text-primary)]"
                >
                  Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}
                </button>
                <ViewToggle />
              </div>
            ) : null}

            {isTablet ? (
              <div className="hidden md:flex lg:hidden">
                <button
                  type="button"
                  onClick={() => setTabletFiltersOpen((current) => !current)}
                  className="premium-chip rounded-full px-4 py-2 text-sm text-[var(--color-text-primary)]"
                >
                  {tabletFiltersOpen ? 'Hide Filters' : 'Show Filters'}
                </button>
              </div>
            ) : null}

            <AIRecommendedBanner events={recommendedEvents} />

            <section className="min-w-0 space-y-5 md:space-y-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-[0.28em] text-[var(--color-text-muted)]">{city}</p>
                  <h1 className="mt-2 font-display text-[2.2rem] leading-none text-[var(--color-text-primary)] xs:text-[2.5rem] md:text-5xl">
                    All Events
                  </h1>
                  <p className="mt-2 max-w-2xl text-sm text-[var(--color-text-secondary)]">
                    {cityEvents.length} results curated for a premium live-night shortlist.
                  </p>
                </div>
                <SortDropdown value={sortBy} onChange={(nextValue) => setFilter('sortBy', nextValue)} className="w-full md:w-auto" />
              </div>

              {isBooting ? (
                <div className="grid grid-cols-1 gap-3 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {skeletonCards.map((key) => (
                    <div
                      key={key}
                      className="h-[220px] rounded-[24px] border border-[var(--color-border-subtle)] bg-shimmer bg-[length:200%_100%] animate-shimmer xs:h-[280px] sm:h-[318px]"
                    />
                  ))}
                </div>
              ) : cityEvents.length > 0 ? (
                <div
                  className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 gap-3 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                      : 'flex flex-col gap-5'
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

      <FilterSheet open={mobileFiltersOpen} onClose={() => setMobileFiltersOpen(false)}>
        <FilterPanel
          venues={venues.filter((venue) => venue.city === city)}
          className="static top-auto rounded-t-[28px] rounded-b-none border-b-0"
        />
      </FilterSheet>
    </>
  );
}

DiscoveryPage.propTypes = {
  city: PropTypes.string.isRequired,
};

export default DiscoveryPage;
