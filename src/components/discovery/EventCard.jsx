import { memo } from 'react';
import PropTypes from 'prop-types';
import { CalendarDays, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AvailabilityBadge from '../shared/AvailabilityBadge';
import { formatShortDate } from '../../utils/dateFormatter';
import { formatPrice } from '../../utils/priceFormatter';

/**
 * Event discovery card for grid and list layouts.
 * Props: event, viewMode.
 */
function EventCard({ event, viewMode }) {
  const navigate = useNavigate();
  const firstShowtime = event.showtimes[0];

  return (
    <article
      className={`group editorial-panel overflow-hidden rounded-[28px] transition duration-300 hover:-translate-y-1 hover:shadow-glow ${
        viewMode === 'list' ? 'flex min-h-[220px]' : 'flex h-full flex-col'
      }`}
    >
      <button
        type="button"
        onClick={() => navigate(`/event/${event.id}`)}
        className={`flex w-full text-left ${viewMode === 'list' ? 'h-full' : 'flex-col'}`}
      >
        <div className={`${viewMode === 'list' ? 'w-[34%]' : 'w-full'} overflow-hidden`}>
          <img
            src={event.thumbnailUrl}
            alt={`${event.title} concert poster`}
            className={`h-full w-full object-cover transition duration-500 group-hover:scale-105 ${
              viewMode === 'list' ? 'min-h-[220px]' : 'aspect-[4/4.7]'
            }`}
          />
        </div>
        <div className="flex flex-1 flex-col justify-between gap-5 p-5">
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-display text-2xl leading-tight text-[var(--color-text-primary)]">{event.title}</p>
                <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{event.artist}</p>
              </div>
              <AvailabilityBadge availability={event.availability} />
            </div>
            <div className="flex flex-wrap gap-2">
              {event.genre.slice(0, 2).map((genre) => (
                <span
                  key={genre}
                  className="rounded-full border border-[var(--color-border-subtle)] px-3 py-1 text-xs uppercase tracking-[0.16em] text-[var(--color-text-secondary)]"
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-3 text-sm text-[var(--color-text-secondary)]">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[var(--color-brand-accent)]" aria-hidden="true" />
              <span>{event.venue.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-[var(--color-brand-accent)]" aria-hidden="true" />
              <span>{firstShowtime ? formatShortDate(firstShowtime.date) : 'Dates soon'}</span>
            </div>
            <div className="font-medium text-[var(--color-text-primary)]">
              {formatPrice(event.priceRange.min)} - {formatPrice(event.priceRange.max)}
            </div>
          </div>
        </div>
      </button>
    </article>
  );
}

EventCard.propTypes = {
  event: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    artist: PropTypes.string.isRequired,
    thumbnailUrl: PropTypes.string.isRequired,
    genre: PropTypes.arrayOf(PropTypes.string).isRequired,
    availability: PropTypes.string.isRequired,
    priceRange: PropTypes.shape({
      min: PropTypes.number.isRequired,
      max: PropTypes.number.isRequired,
    }).isRequired,
    venue: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
    showtimes: PropTypes.arrayOf(
      PropTypes.shape({
        date: PropTypes.string.isRequired,
      }),
    ).isRequired,
  }).isRequired,
  viewMode: PropTypes.oneOf(['grid', 'list']),
};

EventCard.defaultProps = {
  viewMode: 'grid',
};

export default memo(EventCard);
