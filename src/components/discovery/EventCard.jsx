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
  const isList = viewMode === 'list';

  return (
    <article
      className={`group editorial-panel overflow-hidden rounded-[24px] border border-[rgba(255,255,255,0.07)] transition duration-300 hover:-translate-y-1 hover:border-[rgba(255,59,48,0.28)] hover:shadow-glow ${
        isList ? 'flex min-h-[194px]' : 'flex h-full'
      }`}
    >
      <button
        type="button"
        onClick={() => navigate(`/event/${event.id}`)}
        className={`flex w-full text-left ${isList ? 'h-full flex-col xs:flex-row' : 'flex-col'}`}
      >
        <div
          className={`relative overflow-hidden ${
            isList ? 'w-full xs:w-[38%] lg:w-[33%]' : 'w-full'
          }`}
        >
          <img
            src={event.thumbnailUrl}
            alt={`${event.title} concert poster`}
            className={`h-full w-full object-cover transition duration-500 group-hover:scale-105 ${
              isList ? 'h-48 xs:min-h-[194px] xs:h-full' : 'aspect-[4/3.25] xs:aspect-[4/3] sm:aspect-[4/2.65]'
            }`}
          />
          {!isList ? (
            <>
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,15,0.02),rgba(10,10,15,0.18)_50%,rgba(10,10,15,0.68)_100%)]" />
              <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2 xs:gap-3">
                <span className="rounded-full border border-[rgba(255,255,255,0.12)] bg-[rgba(10,10,15,0.54)] px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-primary)] backdrop-blur-sm">
                  {event.genre[0]}
                </span>
                <AvailabilityBadge availability={event.availability} className="!px-2.5 !py-1 !text-[10px]" />
              </div>
              <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-2 text-[10px] uppercase tracking-[0.16em] text-[rgba(245,245,247,0.82)] xs:text-xs">
                <span className="truncate">{event.venue.city}</span>
                <span className="shrink-0">{firstShowtime ? formatShortDate(firstShowtime.date) : 'Soon'}</span>
              </div>
            </>
          ) : null}
        </div>

        <div className={`flex min-w-0 flex-1 flex-col gap-3 ${isList ? 'p-3.5 xs:p-4' : 'p-3 xs:p-3.5'}`}>
          <div className={`space-y-2 ${isList ? '' : 'min-h-[128px] xs:min-h-[140px] sm:min-h-[150px]'}`}>
            <div className={`flex items-start justify-between gap-3 ${isList ? '' : 'hidden'}`}>
              <AvailabilityBadge availability={event.availability} className="!px-2.5 !py-1 !text-[10px]" />
            </div>

            <div className={`space-y-1 ${isList ? '' : 'min-h-[74px] xs:min-h-[88px]'}`}>
              <div>
                <p
                  className={`font-display leading-[1.04] text-[var(--color-text-primary)] ${
                    isList ? 'text-[1.55rem] xs:text-[1.72rem] sm:text-[1.78rem]' : 'text-[1.35rem] xs:text-[1.5rem] sm:text-[1.56rem]'
                  }`}
                >
                  {event.title}
                </p>
                <p className="text-[0.9rem] text-[var(--color-text-secondary)] xs:text-[0.95rem]">{event.artist}</p>
              </div>
            </div>

            <div className={`flex flex-wrap gap-1.5 ${isList ? '' : 'min-h-[30px]'}`}>
              {event.genre.slice(0, 2).map((genre) => (
                <span
                  key={genre}
                  className="rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-[var(--color-text-secondary)]"
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-auto space-y-2 border-t border-[rgba(255,255,255,0.06)] pt-2.5 text-sm text-[var(--color-text-secondary)]">
            <div className="flex items-center gap-2 truncate text-[0.95rem]">
              <MapPin className="h-4 w-4 text-[var(--color-brand-accent)]" aria-hidden="true" />
              <span className="truncate">{event.venue.name}</span>
            </div>
            <div className={`flex items-center gap-2 ${isList ? '' : 'hidden'}`}>
              <CalendarDays className="h-4 w-4 text-[var(--color-brand-accent)]" aria-hidden="true" />
              <span>{firstShowtime ? formatShortDate(firstShowtime.date) : 'Dates soon'}</span>
            </div>
            <div className="flex min-h-[42px] items-end justify-between gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-muted)]">From</p>
                <p className="font-display text-[1.3rem] leading-none text-[var(--color-text-primary)] xs:text-[1.4rem]">
                  {formatPrice(event.priceRange.min)}
                </p>
              </div>
              <span className="rounded-full bg-[rgba(255,59,48,0.08)] px-2.5 py-1 text-[9px] uppercase tracking-[0.16em] text-[var(--color-brand-primary)] xs:text-[10px] xs:tracking-[0.18em]">
                View Event
              </span>
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
