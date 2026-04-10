import { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { CalendarDays, ChevronLeft, ChevronRight, MapPin, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AvailabilityBadge from '../shared/AvailabilityBadge';
import Tooltip from '../shared/Tooltip';
import { formatShortDate } from '../../utils/dateFormatter';

/**
 * Personalized event strip with compact cards and AI rationale tooltips.
 * Props: events.
 */
function AIRecommendedBanner({ events }) {
  const navigate = useNavigate();
  const [tooltip, setTooltip] = useState({ open: false, anchorRect: null });
  const [isPaused, setIsPaused] = useState(false);
  const trackRef = useRef(null);
  const canLoop = events.length > 4;
  const items = useMemo(() => (canLoop ? [...events, ...events] : events), [canLoop, events]);

  useEffect(() => {
    const container = trackRef.current;
    if (!container || !canLoop) {
      return undefined;
    }

    let animationFrame = 0;
    const step = 1.8;

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
  }, [canLoop, isPaused]);

  const scrollByAmount = (direction) => {
    const container = trackRef.current;
    if (!container) {
      return;
    }

    container.scrollTo({
      left: container.scrollLeft + direction * 320,
      behavior: 'smooth',
    });
  };

  return (
    <section
      className="relative overflow-hidden rounded-[36px] border border-[rgba(255,149,0,0.24)] bg-[linear-gradient(135deg,rgba(255,149,0,0.12),rgba(255,59,48,0.08)_45%,rgba(10,10,15,0.3))] p-[1px] shadow-[0_0_50px_rgba(255,149,0,0.08)]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="absolute inset-x-0 top-0 h-28 bg-[radial-gradient(circle_at_top_left,rgba(255,149,0,0.2),transparent_52%)]" />
      <div className="rounded-[35px] bg-[linear-gradient(180deg,rgba(18,18,28,0.98),rgba(11,11,18,0.98))] p-5">
        <div className="mb-5 flex items-center gap-4">
          <div className="flex items-start gap-4">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-[20px] border border-[rgba(255,149,0,0.18)] bg-[linear-gradient(180deg,rgba(255,149,0,0.18),rgba(255,149,0,0.08))] text-[var(--color-brand-accent)] shadow-[0_14px_30px_rgba(255,149,0,0.08)]">
              <Sparkles className="h-6 w-6" aria-hidden="true" />
            </span>
            <div>
              <div className="flex items-center gap-3">
                <p className="font-display text-[2.35rem] leading-none text-[var(--color-text-primary)]">
                  Recommended for You
                </p>
                <span className="rounded-full border border-[rgba(255,149,0,0.2)] bg-[rgba(255,149,0,0.08)] px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-[var(--color-brand-accent)]">
                  Auto Mix
                </span>
              </div>
              <p className="mt-2 max-w-2xl text-sm text-[var(--color-text-secondary)]">
                Tuned to a mock taste profile that leans toward rock and electronic nights.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full border border-[rgba(255,255,255,0.08)] px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                  Live ranking
                </span>
                <span className="rounded-full border border-[rgba(255,255,255,0.08)] px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                  Genre affinity
                </span>
                <span className="rounded-full border border-[rgba(255,255,255,0.08)] px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                  Premium picks
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative">
          <button
            type="button"
            aria-label="Scroll recommended events left"
            onClick={() => scrollByAmount(-1)}
            className="absolute left-2 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[rgba(255,149,0,0.24)] bg-[rgba(14,14,22,0.86)] text-[var(--color-text-primary)] shadow-[0_12px_30px_rgba(0,0,0,0.28)] backdrop-blur-sm transition hover:bg-[rgba(255,149,0,0.12)]"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>

          <button
            type="button"
            aria-label="Scroll recommended events right"
            onClick={() => scrollByAmount(1)}
            className="absolute right-2 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[rgba(255,149,0,0.24)] bg-[linear-gradient(180deg,rgba(255,149,0,0.22),rgba(255,149,0,0.08))] text-[var(--color-brand-accent)] shadow-[0_12px_30px_rgba(0,0,0,0.28)] backdrop-blur-sm transition hover:scale-[1.03]"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>

          <div ref={trackRef} className="thin-scrollbar overflow-x-auto scroll-smooth px-10 pb-4">
          <div className="flex gap-4">
            {items.map((event, index) => (
              <button
                key={`${event.id}-${index}`}
                type="button"
                onClick={() => navigate(`/event/${event.id}`)}
                className="group relative min-w-[290px] overflow-hidden rounded-[28px] border border-[rgba(255,255,255,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))] text-left transition duration-300 hover:-translate-y-1.5 hover:border-[rgba(255,149,0,0.35)] hover:shadow-[0_18px_42px_rgba(0,0,0,0.28)]"
              >
                <div className="relative">
                  <img
                    src={event.thumbnailUrl}
                    alt={`${event.title} recommended event artwork`}
                    className="h-40 w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,15,0.06),rgba(10,10,15,0.28)_55%,rgba(10,10,15,0.82)_100%)]" />
                  <div className="absolute inset-x-4 top-4 flex items-start justify-between gap-3">
                    <span className="rounded-full border border-[rgba(255,255,255,0.14)] bg-[rgba(10,10,15,0.4)] px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-primary)] backdrop-blur-sm">
                      {event.genre[0]}
                    </span>
                    <AvailabilityBadge availability={event.availability} className="!px-2.5 !py-1 !text-[10px]" />
                  </div>
                  <div className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-3 text-[11px] uppercase tracking-[0.22em] text-[rgba(245,245,247,0.8)]">
                    <span className="inline-flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-[var(--color-brand-accent)]" aria-hidden="true" />
                      {event.venue.city}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <CalendarDays className="h-3.5 w-3.5 text-[var(--color-brand-accent)]" aria-hidden="true" />
                      {event.showtimes[0] ? formatShortDate(event.showtimes[0].date) : 'Soon'}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 p-4">
                  <div className="space-y-1">
                    <div>
                      <p className="font-display text-[1.75rem] leading-[1.02] text-[var(--color-text-primary)]">
                        {event.title}
                      </p>
                      <p className="mt-1 text-[0.95rem] text-[var(--color-text-secondary)]">{event.artist}</p>
                    </div>
                    <p className="text-[13px] leading-relaxed text-[var(--color-text-muted)]">
                      High-confidence recommendation based on your saved taste profile and recent premium browsing behavior.
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-4 border-t border-[rgba(255,255,255,0.06)] pt-3">
                    <button
                      type="button"
                      onClick={(action) => action.stopPropagation()}
                      onMouseEnter={(action) =>
                        setTooltip({
                          open: true,
                          anchorRect: action.currentTarget.getBoundingClientRect(),
                        })
                      }
                      onMouseLeave={() => setTooltip({ open: false, anchorRect: null })}
                      className="text-xs uppercase tracking-[0.22em] text-[var(--color-brand-accent)]"
                    >
                      Why this?
                    </button>
                    <span className="rounded-full bg-[rgba(255,149,0,0.08)] px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-[var(--color-brand-accent)]">
                      AI Match
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
        </div>

        <div className="mt-2 h-2 rounded-full bg-[rgba(255,255,255,0.06)]">
          <div
            className={`h-2 rounded-full bg-[linear-gradient(90deg,var(--color-brand-primary),var(--color-brand-accent))] shadow-[0_8px_24px_rgba(255,149,0,0.24)] ${
              canLoop ? 'w-1/3 animate-[shimmer_5s_linear_infinite]' : 'w-2/3'
            }`}
          />
        </div>
      </div>
      <Tooltip
        open={tooltip.open}
        anchorRect={tooltip.anchorRect}
        content="Based on your saved rock and electronic preferences plus recent premium seat behavior."
      />
    </section>
  );
}

AIRecommendedBanner.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      artist: PropTypes.string.isRequired,
      thumbnailUrl: PropTypes.string.isRequired,
      availability: PropTypes.string.isRequired,
      genre: PropTypes.arrayOf(PropTypes.string).isRequired,
      venue: PropTypes.shape({
        city: PropTypes.string.isRequired,
      }).isRequired,
      showtimes: PropTypes.arrayOf(
        PropTypes.shape({
          date: PropTypes.string.isRequired,
        }),
      ).isRequired,
    }),
  ).isRequired,
};

export default AIRecommendedBanner;
