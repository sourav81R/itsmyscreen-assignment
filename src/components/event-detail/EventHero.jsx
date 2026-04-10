import PropTypes from 'prop-types';
import { CalendarDays, MapPin } from 'lucide-react';
import Badge from '../shared/Badge';
import Button from '../shared/Button';
import { formatLongDate } from '../../utils/dateFormatter';
import { formatPrice } from '../../utils/priceFormatter';

/**
 * Full-bleed event hero with layered editorial overlays and sticky CTA bar.
 * Props: event, onSelectSeats.
 */
function EventHero({ event, onSelectSeats }) {
  const firstShowtime = event.showtimes[0];
  const headlineGenres = event.genre.slice(0, 2);

  return (
    <section className="premium-panel rounded-[30px] bg-[rgba(11,12,18,0.92)] p-3 lg:p-4">
        <div className="group relative h-[660px] overflow-hidden rounded-[28px]">
          <img
            src={event.bannerUrl}
            alt={`${event.title} hero artwork`}
            className="absolute inset-0 h-full w-full object-cover transition duration-[1400ms] group-hover:scale-[1.05]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(7,8,14,0.78),rgba(10,10,15,0.22)_44%,rgba(5,7,12,0.8))]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_78%,rgba(255,149,0,0.2),transparent_34%),radial-gradient(circle_at_84%_18%,rgba(0,195,255,0.16),transparent_28%),linear-gradient(180deg,rgba(10,10,15,0.08),rgba(10,10,15,0.58)_68%,rgba(10,10,15,0.86))]" />

          <div className="relative flex h-full flex-col justify-between p-5 lg:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex flex-wrap gap-2.5">
                <Badge
                  label={event.availability.replace('-', ' ')}
                  variant={event.availability}
                  className="premium-chip !border-[rgba(255,255,255,0.12)] !bg-[rgba(8,10,16,0.46)] backdrop-blur-md"
                />
                {headlineGenres.map((genre) => (
                  <Badge
                    key={genre}
                    label={genre}
                    variant="genre"
                    className="premium-chip !border-[rgba(255,255,255,0.1)] !bg-[rgba(8,10,16,0.38)] backdrop-blur-md"
                  />
                ))}
              </div>

              <div className="premium-chip hidden rounded-full px-3 py-1.5 text-right lg:block">
                <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-muted)]">Starting at</p>
                <p className="mt-1 text-sm font-medium text-[var(--color-text-primary)]">
                  {formatPrice(event.priceRange.min)}
                </p>
              </div>
            </div>

            <div className="grid items-end gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
            <div className="max-w-[540px]">
              <div className="premium-panel rounded-[22px] bg-[linear-gradient(180deg,rgba(9,11,18,0.48),rgba(9,11,18,0.68))] p-[18px] backdrop-blur-xl lg:p-5">
                <p className="text-[11px] uppercase tracking-[0.28em] text-[var(--color-text-secondary)]">{event.artist}</p>
                <h1 className="mt-2 max-w-[11ch] font-display text-[clamp(1.95rem,3vw,3.45rem)] leading-[0.96] text-[var(--color-text-primary)]">
                  {event.title}
                </h1>
                <p className="mt-2 max-w-[30rem] text-[13px] leading-5 text-[rgba(245,245,247,0.76)]">
                  {event.description}
                </p>

                  <div className="mt-4 flex flex-wrap gap-2 text-sm text-[var(--color-text-secondary)]">
                    <span className="premium-chip inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[13px]">
                      <MapPin className="h-4 w-4 text-[var(--color-brand-accent)]" aria-hidden="true" />
                      {event.venue.name}
                    </span>
                  {firstShowtime ? (
                      <span className="premium-chip inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[13px]">
                        <CalendarDays className="h-4 w-4 text-[var(--color-brand-accent)]" aria-hidden="true" />
                        {formatLongDate(firstShowtime.date)} - {firstShowtime.time}
                      </span>
                    ) : null}
                </div>
              </div>
            </div>

              <div className="premium-panel ml-auto w-full max-w-[260px] rounded-[22px] bg-[linear-gradient(180deg,rgba(9,11,18,0.62),rgba(9,11,18,0.84))] p-4 backdrop-blur-xl">
                <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-text-muted)]">Reserve faster</p>
                <p className="mt-2 text-[14px] font-medium text-[var(--color-text-primary)]">
                  Lock your showtime before the best pockets disappear.
                </p>
                <p className="mt-2 text-[13px] leading-5 text-[var(--color-text-secondary)]">
                  Reveal AI seat suggestions instantly and keep a live 10-minute hold timer active once seats are selected.
                </p>

                <div className="mt-3.5 grid grid-cols-2 gap-2">
                  <div className="premium-chip rounded-[14px] px-2.5 py-2">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-muted)]">Entry</p>
                    <p className="mt-1 text-sm font-medium text-[var(--color-text-primary)]">
                      {formatPrice(event.priceRange.min)}
                    </p>
                  </div>
                  <div className="premium-chip rounded-[14px] px-2.5 py-2">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-muted)]">Status</p>
                    <p className="mt-1 text-sm font-medium capitalize text-[var(--color-text-primary)]">
                      {event.availability.replace('-', ' ')}
                    </p>
                  </div>
                </div>

                <Button
                  className="mt-3.5 w-full bg-[linear-gradient(135deg,#ff5a3d,#ff3b30_55%,#ff7b33)] shadow-[0_16px_38px_rgba(255,59,48,0.28)] hover:shadow-[0_20px_44px_rgba(255,59,48,0.34)]"
                  size="sm"
                  onClick={onSelectSeats}
                >
                  Select Seats
                </Button>
              </div>
            </div>
          </div>
        </div>
    </section>
  );
}

EventHero.propTypes = {
  event: PropTypes.shape({
    title: PropTypes.string.isRequired,
    artist: PropTypes.string.isRequired,
    bannerUrl: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    availability: PropTypes.string.isRequired,
    genre: PropTypes.arrayOf(PropTypes.string).isRequired,
    priceRange: PropTypes.shape({
      min: PropTypes.number.isRequired,
    }).isRequired,
    venue: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
    showtimes: PropTypes.arrayOf(
      PropTypes.shape({
        date: PropTypes.string.isRequired,
        time: PropTypes.string.isRequired,
      }),
    ).isRequired,
  }).isRequired,
  onSelectSeats: PropTypes.func.isRequired,
};

export default EventHero;
