import { useState } from 'react';
import PropTypes from 'prop-types';
import { Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AvailabilityBadge from '../shared/AvailabilityBadge';
import Tooltip from '../shared/Tooltip';

/**
 * Personalized event strip with compact cards and AI rationale tooltips.
 * Props: events.
 */
function AIRecommendedBanner({ events }) {
  const navigate = useNavigate();
  const [tooltip, setTooltip] = useState({ open: false, anchorRect: null });

  return (
    <section className="rounded-[32px] border border-[rgba(255,149,0,0.35)] bg-[linear-gradient(135deg,rgba(255,149,0,0.08),rgba(255,59,48,0.06))] p-[1px] shadow-[0_0_40px_rgba(255,149,0,0.08)]">
      <div className="thin-scrollbar overflow-x-auto rounded-[31px] bg-[rgba(13,13,20,0.96)] p-6">
        <div className="mb-5 flex items-center gap-3">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[rgba(255,149,0,0.12)] text-[var(--color-brand-accent)]">
            <Sparkles className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="font-display text-3xl text-[var(--color-text-primary)]">Recommended for You</p>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Tuned to a mock taste profile that leans toward rock and electronic nights.
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          {events.map((event) => (
            <button
              key={event.id}
              type="button"
              onClick={() => navigate(`/event/${event.id}`)}
              className="group relative min-w-[260px] overflow-hidden rounded-[28px] border border-[var(--color-border-subtle)] bg-[rgba(255,255,255,0.03)] text-left transition duration-300 hover:-translate-y-1 hover:border-[rgba(255,149,0,0.35)]"
            >
              <img
                src={event.thumbnailUrl}
                alt={`${event.title} recommended event artwork`}
                className="h-40 w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="space-y-4 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-2xl leading-tight text-[var(--color-text-primary)]">{event.title}</p>
                    <p className="text-sm text-[var(--color-text-secondary)]">{event.artist}</p>
                  </div>
                  <AvailabilityBadge availability={event.availability} />
                </div>
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
                  className="text-xs uppercase tracking-[0.18em] text-[var(--color-brand-accent)]"
                >
                  Why this?
                </button>
              </div>
            </button>
          ))}
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
    }),
  ).isRequired,
};

export default AIRecommendedBanner;
