import { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { searchEvents } from '../../services/eventService';
import { useFilterStore } from '../../store/useFilterStore';

/**
 * Debounced discovery search with autocomplete and keyboard navigation.
 * Props: placeholder.
 */
function SearchBar({ placeholder }) {
  const navigate = useNavigate();
  const searchQuery = useFilterStore((state) => state.searchQuery);
  const setFilter = useFilterStore((state) => state.setFilter);
  const [query, setQuery] = useState(searchQuery);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setFilter('searchQuery', query);
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [query, setFilter]);

  const results = useMemo(() => searchEvents(query), [query]);

  const chooseResult = (event) => {
    setQuery(event.title);
    setFilter('searchQuery', event.title);
    setOpen(false);
    navigate(`/event/${event.id}`);
  };

  return (
    <div className="relative flex-1">
      <div className="flex items-center gap-3 rounded-full border border-[var(--color-border-subtle)] bg-[rgba(255,255,255,0.04)] px-4 py-3.5 xs:px-5 xs:py-4">
        <Search className="h-5 w-5 text-[var(--color-brand-accent)]" aria-hidden="true" />
        <input
          type="text"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
            setActiveIndex(-1);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(event) => {
            if (event.key === 'ArrowDown') {
              event.preventDefault();
              setActiveIndex((current) => Math.min(current + 1, results.length - 1));
            }
            if (event.key === 'ArrowUp') {
              event.preventDefault();
              setActiveIndex((current) => Math.max(current - 1, 0));
            }
            if (event.key === 'Enter' && results[activeIndex]) {
              event.preventDefault();
              chooseResult(results[activeIndex]);
            }
            if (event.key === 'Escape') {
              setOpen(false);
            }
          }}
          placeholder={placeholder}
          className="w-full bg-transparent text-[15px] text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-muted)] xs:text-base"
        />
      </div>

      {open && query && results.length > 0 ? (
        <div className="absolute left-0 right-0 top-[calc(100%+12px)] z-30 overflow-hidden rounded-[24px] border border-[var(--color-border-subtle)] bg-[rgba(20,20,32,0.98)] shadow-elevated">
          {results.map((event, index) => (
            <button
              key={event.id}
              type="button"
              onMouseEnter={() => setActiveIndex(index)}
              onMouseDown={() => chooseResult(event)}
              className={`flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition xs:px-5 xs:py-4 ${
                activeIndex === index ? 'bg-[rgba(255,59,48,0.12)]' : 'hover:bg-[rgba(255,255,255,0.04)]'
              }`}
            >
              <div className="min-w-0">
                <p className="font-medium text-[var(--color-text-primary)]">{event.title}</p>
                <p className="text-sm text-[var(--color-text-secondary)]">{event.artist}</p>
              </div>
              <span className="shrink-0 text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-muted)] xs:text-xs">
                {event.venue.city}
              </span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

SearchBar.propTypes = {
  placeholder: PropTypes.string,
};

SearchBar.defaultProps = {
  placeholder: 'Search artists, tours, venues',
};

export default SearchBar;
