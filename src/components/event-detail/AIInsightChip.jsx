import PropTypes from 'prop-types';
import { Flame } from 'lucide-react';
import { getSellOutPrediction } from '../../services/aiService';

/**
 * AI urgency and sell-out prediction chip shown below the hero.
 * Props: event, onSelectSeats.
 */
function AIInsightChip({ event, onSelectSeats }) {
  const prediction = getSellOutPrediction(event);

  return (
    <div className="rounded-[28px] border-l-4 border-[var(--color-brand-accent)] bg-[rgba(255,149,0,0.08)] px-6 py-5">
      <div className="flex items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgba(255,149,0,0.12)] text-[var(--color-brand-accent)]">
            <Flame className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="font-medium text-[var(--color-text-primary)]">{prediction.label}</p>
            <p className="text-sm text-[var(--color-text-secondary)]">{event.aiInsight}</p>
          </div>
        </div>
        <button type="button" onClick={onSelectSeats} className="text-sm font-medium text-[var(--color-brand-accent)]">
          Don&apos;t miss it → Select Seats
        </button>
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
