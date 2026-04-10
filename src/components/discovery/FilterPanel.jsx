import PropTypes from 'prop-types';
import { CalendarDays, MapPin, SlidersHorizontal, Sparkles } from 'lucide-react';
import { useFilterStore } from '../../store/useFilterStore';
import { formatPrice } from '../../utils/priceFormatter';

const genres = ['Pop', 'Rock', 'Classical', 'Electronic', 'Jazz', 'Hip-Hop', 'Bollywood', 'Indie'];

/**
 * Persistent discovery filter sidebar connected to the filter store.
 * Props: venues.
 */
function FilterPanel({ venues }) {
  const { genres: activeGenres, dateRange, priceRange, venue, toggleGenre, setFilter, resetFilters } =
    useFilterStore();

  return (
    <aside className="sticky top-28 h-fit overflow-hidden rounded-[36px] border border-[rgba(255,255,255,0.08)] bg-[linear-gradient(180deg,rgba(31,31,49,0.96),rgba(17,17,27,0.98))] shadow-[0_24px_70px_rgba(0,0,0,0.35)]">
      <div className="absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_top_left,rgba(255,149,0,0.16),transparent_60%)]" />

      <div className="relative p-6">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-[18px] border border-[rgba(255,149,0,0.18)] bg-[linear-gradient(180deg,rgba(255,149,0,0.18),rgba(255,149,0,0.06))] text-[var(--color-brand-accent)]">
              <Sparkles className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-[var(--color-text-muted)]">Filters</p>
              <h2 className="mt-2 font-display text-[2.2rem] leading-none text-[var(--color-text-primary)]">
                Refine the night
              </h2>
              <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                Shape the lineup by genre, date, budget, and venue.
              </p>
            </div>
          </div>
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(255,149,0,0.14)] bg-[rgba(255,149,0,0.06)]">
            <SlidersHorizontal className="h-5 w-5 text-[var(--color-brand-accent)]" aria-hidden="true" />
          </span>
        </div>

        <div className="mb-6 rounded-[26px] border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.025)] px-4 py-3">
          <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-muted)]">Quick summary</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full border border-[rgba(255,255,255,0.08)] px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-secondary)]">
              {activeGenres.length || 0} genres
            </span>
            <span className="rounded-full border border-[rgba(255,255,255,0.08)] px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-secondary)]">
              {formatPrice(priceRange.min)} - {formatPrice(priceRange.max)}
            </span>
            <span className="rounded-full border border-[rgba(255,255,255,0.08)] px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-secondary)]">
              {venue ? '1 venue' : 'All venues'}
            </span>
          </div>
        </div>

        <section className="space-y-5">
          <div className="rounded-[26px] border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] p-4">
            <p className="mb-3 text-xs uppercase tracking-[0.18em] text-[var(--color-text-muted)]">Genre</p>
            <div className="flex flex-wrap gap-2">
              {genres.map((genre) => {
                const active = activeGenres.includes(genre);
                return (
                  <button
                    key={genre}
                    type="button"
                    onClick={() => toggleGenre(genre)}
                    className={`rounded-full border px-3 py-2 text-sm transition ${
                      active
                        ? 'border-[rgba(255,149,0,0.3)] bg-[linear-gradient(180deg,rgba(255,59,48,0.18),rgba(255,149,0,0.12))] text-[var(--color-text-primary)] shadow-[0_10px_24px_rgba(255,149,0,0.08)]'
                        : 'border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] text-[var(--color-text-secondary)]'
                    }`}
                  >
                    {genre}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-[26px] border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] p-4">
            <div className="mb-3 flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-[var(--color-brand-accent)]" aria-hidden="true" />
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-muted)]">Date range</p>
            </div>
            <div className="grid gap-3">
              <label className="relative block">
                <input
                  type="date"
                  value={dateRange.from}
                  onChange={(event) => setFilter('dateRange', { ...dateRange, from: event.target.value })}
                  className="w-full rounded-[20px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-4 py-3 text-[var(--color-text-primary)] outline-none transition focus:border-[rgba(255,149,0,0.35)]"
                />
              </label>
              <label className="relative block">
                <input
                  type="date"
                  value={dateRange.to}
                  onChange={(event) => setFilter('dateRange', { ...dateRange, to: event.target.value })}
                  className="w-full rounded-[20px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-4 py-3 text-[var(--color-text-primary)] outline-none transition focus:border-[rgba(255,149,0,0.35)]"
                />
              </label>
            </div>
          </div>

          <div className="rounded-[26px] border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] p-4">
            <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
              <span>Price</span>
              <span>
                {formatPrice(priceRange.min)} - {formatPrice(priceRange.max)}
              </span>
            </div>
            <div className="space-y-4">
              <input
                type="range"
                min="0"
                max="10000"
                step="100"
                value={priceRange.min}
                onChange={(event) =>
                  setFilter('priceRange', {
                    ...priceRange,
                    min: Math.min(Number(event.target.value), priceRange.max - 100),
                  })
                }
                className="w-full accent-[var(--color-brand-primary)]"
                aria-label="Minimum price"
              />
              <input
                type="range"
                min="0"
                max="10000"
                step="100"
                value={priceRange.max}
                onChange={(event) =>
                  setFilter('priceRange', {
                    ...priceRange,
                    max: Math.max(Number(event.target.value), priceRange.min + 100),
                  })
                }
                className="w-full accent-[var(--color-brand-accent)]"
                aria-label="Maximum price"
              />
            </div>
          </div>

          <div className="rounded-[26px] border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] p-4">
            <div className="mb-3 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[var(--color-brand-accent)]" aria-hidden="true" />
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-muted)]">Venue</p>
            </div>
            <select
              value={venue}
              onChange={(event) => setFilter('venue', event.target.value)}
              className="w-full rounded-[20px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-4 py-3 text-[var(--color-text-primary)] outline-none transition focus:border-[rgba(255,149,0,0.35)]"
            >
              <option value="">All venues</option>
              {venues.map((item) => (
                <option key={item.id} value={item.id} className="bg-[var(--color-bg-surface)]">
                  {item.name}
                </option>
              ))}
            </select>
          </div>
        </section>

        <button
          type="button"
          onClick={resetFilters}
          className="mt-6 inline-flex items-center gap-2 rounded-full border border-[rgba(255,149,0,0.18)] bg-[rgba(255,149,0,0.06)] px-4 py-2 text-sm font-medium text-[var(--color-brand-accent)] transition hover:bg-[rgba(255,149,0,0.12)] hover:text-[var(--color-text-primary)]"
        >
          Reset filters
        </button>
      </div>
    </aside>
  );
}

FilterPanel.propTypes = {
  venues: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default FilterPanel;
