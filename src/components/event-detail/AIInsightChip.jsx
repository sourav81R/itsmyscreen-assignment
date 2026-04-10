import PropTypes from 'prop-types';
import { Flame, Sparkles } from 'lucide-react';
import { getSellOutPrediction } from '../../services/aiService';

const urgencyStyles = {
  high: {
    icon: Flame,
    accent: 'text-[#ff9b87]',
    badge: 'AI urgency',
  },
  medium: {
    icon: Sparkles,
    accent: 'text-[var(--color-brand-accent)]',
    badge: 'AI watchlist',
  },
  low: {
    icon: Sparkles,
    accent: 'text-[#8fd6ff]',
    badge: 'AI outlook',
  },
};

/**
 * AI urgency and sell-out prediction chip shown below the hero.
 * Props: event, onSelectSeats.
 */
function AIInsightChip({ event, onSelectSeats }) {
  const prediction = getSellOutPrediction(event);
  const style = urgencyStyles[prediction.urgency];
  const Icon = style.icon;

  return (
    <div className="premium-panel rounded-[24px] bg-[linear-gradient(135deg,rgba(255,149,0,0.11),rgba(255,59,48,0.08)_46%,rgba(12,14,24,0.98))] px-5 py-4 backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className={`premium-chip inline-flex h-12 w-12 items-center justify-center rounded-[16px] ${style.accent}`}>
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="max-w-[740px]">
            <p className="text-[11px] uppercase tracking-[0.24em] text-[rgba(185,185,200,0.82)]">{style.badge}</p>
            <p className="mt-1.5 text-base font-semibold text-[rgba(245,245,247,0.98)] [text-shadow:0_1px_10px_rgba(0,0,0,0.32)]">
              {prediction.label}
            </p>
            <p className="mt-1.5 text-sm leading-6 text-[rgba(233,233,241,0.9)] [text-shadow:0_1px_8px_rgba(0,0,0,0.24)]">
              {event.aiInsight}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="premium-chip hidden rounded-full px-3 py-1.5 text-sm text-[var(--color-text-secondary)] lg:block">
            Premium seat signals are live
          </div>
          <button
            type="button"
            onClick={onSelectSeats}
            className="premium-chip rounded-full px-4 py-2 text-sm font-medium text-[var(--color-brand-accent)]"
          >
            Open seat planner
          </button>
        </div>
      </div>
    </div>
  );
}

AIInsightChip.propTypes = {
  event: PropTypes.shape({
    aiInsight: PropTypes.string.isRequired,
    availabilityPercent: PropTypes.number,
  }).isRequired,
  onSelectSeats: PropTypes.func.isRequired,
};

AIInsightChip.defaultProps = {
  availabilityPercent: undefined,
};

export default AIInsightChip;
