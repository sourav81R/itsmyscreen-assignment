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
    <section className="editorial-panel rounded-[28px] p-6">
      <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-muted)]">AI Picks Across Tiers</p>
      <div className="mt-4 space-y-3">
        {suggestions.map((group) => (
          <div
            key={`${group.seats[0].id}-${group.seats.length}`}
            className="rounded-[24px] border border-[rgba(255,149,0,0.22)] bg-[rgba(255,149,0,0.06)] p-4"
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
              <Button size="sm" onClick={() => onApply(group)}>
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
