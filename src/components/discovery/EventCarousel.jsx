import { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import EventCard from './EventCard';

/**
 * Horizontal discovery carousel with auto-scroll, manual arrows, and hover pause.
 * Props: events.
 */
function EventCarousel({ events }) {
  const trackRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const canLoop = events.length > 3;
  const items = useMemo(() => (events.length > 3 ? [...events, ...events] : events), [events]);

  useEffect(() => {
    const container = trackRef.current;
    if (!container || events.length <= 3) {
      return undefined;
    }
    const step = 1.1;
    let animationFrame = 0;

    const tick = () => {
      if (!isPaused) {
        container.scrollLeft += step;
        const halfway = container.scrollWidth / 2;
        if (container.scrollLeft >= halfway) {
          container.scrollLeft = 0;
        }
      }

      animationFrame = window.requestAnimationFrame(tick);
    };

    animationFrame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(animationFrame);
  }, [events.length, isPaused]);

  const scrollByAmount = (direction) => {
    const container = trackRef.current;
    if (!container) {
      return;
    }

    const cardWidth = 340;
    const nextLeft = container.scrollLeft + direction * cardWidth;
    container.scrollTo({ left: nextLeft, behavior: 'smooth' });
  };

  return (
    <section
      className="relative rounded-[34px] border border-[var(--color-border-subtle)] bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.01))] px-5 pb-6 pt-5"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-text-muted)]">Auto-scrolling picks</p>
          <p className="mt-2 font-display text-4xl text-[var(--color-text-primary)]">Tonight&apos;s lineup</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Scroll events left"
            onClick={() => scrollByAmount(-1)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(255,59,48,0.35)] bg-[rgba(255,255,255,0.04)] text-[var(--color-text-primary)] transition hover:bg-[rgba(255,59,48,0.16)]"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Scroll events right"
            onClick={() => scrollByAmount(1)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(255,59,48,0.35)] bg-[var(--color-brand-primary)] text-white transition hover:scale-[1.03]"
          >
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        className="thin-scrollbar flex snap-x gap-5 overflow-x-auto scroll-smooth pb-4"
      >
        {items.map((event, index) => (
          <div key={`${event.id}-${index}`} className="w-[320px] min-w-[320px] snap-start">
            <EventCard event={event} viewMode="carousel" />
          </div>
        ))}
      </div>

      <div className="relative mt-3 h-2 rounded-full bg-[rgba(255,255,255,0.08)]">
        <div
          className={`absolute left-0 top-0 h-2 rounded-full bg-[linear-gradient(90deg,var(--color-brand-primary),var(--color-brand-accent))] ${
            canLoop ? 'w-1/3 animate-[shimmer_5s_linear_infinite]' : 'w-2/3'
          }`}
        />
      </div>
    </section>
  );
}

EventCarousel.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default EventCarousel;
