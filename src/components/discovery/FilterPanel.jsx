import PropTypes from 'prop-types';
import { SlidersHorizontal } from 'lucide-react';
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
    <aside className="editorial-panel sticky top-28 h-fit rounded-[32px] p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-[var(--color-text-muted)]">Filters</p>
          <h2 className="mt-2 font-display text-3xl text-[var(--color-text-primary)]">Refine the night</h2>
        </div>
        <SlidersHorizontal className="h-5 w-5 text-[var(--color-brand-accent)]" aria-hidden="true" />
      </div>

      <section className="space-y-5">
        <div>
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
                      ? 'border-[var(--color-brand-primary)] bg-[rgba(255,59,48,0.14)] text-[var(--color-text-primary)]'
                      : 'border-[var(--color-border-subtle)] bg-[rgba(255,255,255,0.03)] text-[var(--color-text-secondary)]'
                  }`}
                >
                  {genre}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <p className="mb-3 text-xs uppercase tracking-[0.18em] text-[var(--color-text-muted)]">Date range</p>
          <div className="grid gap-3">
            <input
              type="date"
              value={dateRange.from}
              onChange={(event) => setFilter('dateRange', { ...dateRange, from: event.target.value })}
              className="rounded-2xl border border-[var(--color-border-subtle)] bg-[rgba(255,255,255,0.04)] px-4 py-3 text-[var(--color-text-primary)] outline-none"
            />
            <input
              type="date"
              value={dateRange.to}
              onChange={(event) => setFilter('dateRange', { ...dateRange, to: event.target.value })}
              className="rounded-2xl border border-[var(--color-border-subtle)] bg-[rgba(255,255,255,0.04)] px-4 py-3 text-[var(--color-text-primary)] outline-none"
            />
          </div>
        </div>

        <div>
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

        <div>
          <p className="mb-3 text-xs uppercase tracking-[0.18em] text-[var(--color-text-muted)]">Venue</p>
          <select
            value={venue}
            onChange={(event) => setFilter('venue', event.target.value)}
            className="w-full rounded-2xl border border-[var(--color-border-subtle)] bg-[rgba(255,255,255,0.04)] px-4 py-3 text-[var(--color-text-primary)] outline-none"
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
        className="mt-8 text-sm font-medium text-[var(--color-brand-accent)] transition hover:text-[var(--color-text-primary)]"
      >
        Reset filters
      </button>
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
