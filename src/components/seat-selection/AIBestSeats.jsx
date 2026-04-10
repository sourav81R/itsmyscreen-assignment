import PropTypes from 'prop-types';
import Button from '../shared/Button';
import { buildSeatGroupLabel } from '../../services/aiService';
import { formatPrice } from '../../utils/priceFormatter';

/**
 * AI seat recommendation panel with quick-apply actions.
 * Props: suggestions, onApply.
 */
function AIBestSeats({ suggestions, onApply }) {
  return (
    <section className="editorial-panel premium-panel rounded-[28px] bg-[linear-gradient(180deg,rgba(24,24,38,0.98),rgba(14,14,24,0.98))] p-6">
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-muted)]">AI Picks Across Tiers</p>
        <span className="premium-chip rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-[var(--color-brand-accent)]">
          Smart match
        </span>
      </div>

      <div className="mt-4 space-y-3">
        {suggestions.map((group) => (
          <div
            key={`${group.seats[0].id}-${group.seats.length}`}
            className="premium-panel rounded-[24px] bg-[linear-gradient(135deg,rgba(255,149,0,0.08),rgba(255,255,255,0.02))] p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-medium text-[var(--color-text-primary)]">
                  {group.seats[0].tier.toUpperCase()} · Row {buildSeatGroupLabel(group)}
                </p>
                <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                  {formatPrice(group.seats[0].price)} each · {formatPrice(group.total)} total
                </p>
              </div>
              <Button
                size="sm"
                className="shadow-[0_10px_24px_rgba(255,59,48,0.18)]"
                onClick={() => onApply(group)}
              >
                Apply
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

AIBestSeats.propTypes = {
  suggestions: PropTypes.arrayOf(
    PropTypes.shape({
      total: PropTypes.number.isRequired,
      seats: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          tier: PropTypes.string.isRequired,
          price: PropTypes.number.isRequired,
          row: PropTypes.string.isRequired,
        }),
      ).isRequired,
    }),
  ).isRequired,
  onApply: PropTypes.func.isRequired,
};

export default AIBestSeats;
