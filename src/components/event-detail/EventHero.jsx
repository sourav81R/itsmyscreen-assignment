import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { CalendarDays, MapPin } from 'lucide-react';
import Button from '../shared/Button';
import { formatLongDate } from '../../utils/dateFormatter';

/**
 * Full-bleed event hero with scroll-reactive sticky CTA bar.
 * Props: event, onSelectSeats.
 */
function EventHero({ event, onSelectSeats }) {
  const [showSticky, setShowSticky] = useState(false);
  const firstShowtime = event.showtimes[0];

  useEffect(() => {
    const onScroll = () => setShowSticky(window.scrollY > 260);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <section className="relative overflow-hidden rounded-[36px]">
        <img
          src={event.bannerUrl}
          alt={`${event.title} hero artwork`}
          className="h-[520px] w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,15,0.1),rgba(10,10,15,0.4)_42%,rgba(10,10,15,0.95))]" />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-8 p-10">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.28em] text-[var(--color-text-secondary)]">{event.artist}</p>
            <h1 className="mt-3 font-display text-6xl leading-none text-[var(--color-text-primary)]">
              {event.title}
            </h1>
            <div className="mt-5 flex flex-wrap gap-4 text-sm text-[var(--color-text-secondary)]">
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border-subtle)] px-4 py-2">
                <MapPin className="h-4 w-4 text-[var(--color-brand-accent)]" aria-hidden="true" />
                {event.venue.name}
              </span>
              {firstShowtime ? (
                <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border-subtle)] px-4 py-2">
                  <CalendarDays className="h-4 w-4 text-[var(--color-brand-accent)]" aria-hidden="true" />
                  {formatLongDate(firstShowtime.date)} · {firstShowtime.time}
                </span>
              ) : null}
            </div>
          </div>

          <div className="w-[280px] rounded-[28px] border border-[var(--color-border-subtle)] bg-[rgba(10,10,15,0.64)] p-5 backdrop-blur-lg">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-muted)]">Reserve faster</p>
            <p className="mt-3 text-sm text-[var(--color-text-secondary)]">
              Lock showtime, reveal AI seat suggestions, and keep a live 10-minute hold timer once seats are selected.
            </p>
            <Button className="mt-5 w-full" size="lg" onClick={onSelectSeats}>
              Select Seats
            </Button>
          </div>
        </div>
      </section>

      {showSticky ? (
        <div className="fixed inset-x-0 top-[88px] z-30 border-b border-[var(--color-border-subtle)] bg-[rgba(10,10,15,0.92)] px-8 py-4 backdrop-blur-xl">
          <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-6">
            <div>
              <p className="font-display text-2xl text-[var(--color-text-primary)]">{event.title}</p>
              <p className="text-sm text-[var(--color-text-secondary)]">
                {event.venue.name} · {firstShowtime?.time}
              </p>
            </div>
            <Button onClick={onSelectSeats}>Select Seats</Button>
          </div>
        </div>
      ) : null}
    </>
  );
}

EventHero.propTypes = {
  event: PropTypes.shape({
    title: PropTypes.string.isRequired,
    artist: PropTypes.string.isRequired,
    bannerUrl: PropTypes.string.isRequired,
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
