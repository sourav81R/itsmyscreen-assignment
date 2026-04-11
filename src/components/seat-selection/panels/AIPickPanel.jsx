import PropTypes from 'prop-types';
import { Sparkles } from 'lucide-react';
import Button from '../../shared/Button';
import { buildSeatGroupLabel } from '../../../services/aiService';
import { formatPrice } from '../../../utils/priceFormatter';

const tierColors = {
  general: '#0A84FF',
  premium: '#30D158',
  vip: '#FFD60A',
};

function AIPickPanel({ suggestions, onApply, onPreviewChange }) {
  return (
    <section className="editorial-panel premium-panel rounded-[28px] bg-[linear-gradient(180deg,rgba(24,24,38,0.98),rgba(14,14,24,0.98))] p-6">
      <div className="flex items-center justify-between gap-4">
        <p className="max-w-[180px] text-xs uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
          AI Picks Across Tiers
        </p>
        <span className="premium-chip inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-[var(--color-brand-accent)]">
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
          Smart match
        </span>
      </div>

      <div className="mt-5 space-y-3">
        {suggestions.map((group) => {
          const firstSeat = group.seats[0];
          const suggestionIds = new Set(group.seats.map((seat) => seat.id));

          return (
            <div
              key={`${firstSeat.id}-${group.seats.length}`}
              className="premium-panel rounded-[24px] bg-[linear-gradient(135deg,rgba(255,149,0,0.08),rgba(255,255,255,0.02))] p-4"
              onMouseEnter={() => onPreviewChange(suggestionIds)}
              onMouseLeave={() => onPreviewChange(new Set())}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-[var(--color-text-primary)]">
                    <span style={{ color: tierColors[firstSeat.tier] ?? 'var(--color-text-primary)' }}>
                      {firstSeat.tier.toUpperCase()}
                    </span>{' '}
                    · Row {buildSeatGroupLabel(group)}
                  </p>
                  <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                    {formatPrice(firstSeat.price)} each · {formatPrice(group.total)} total
                  </p>
                </div>
                <Button
                  size="sm"
                  className="min-w-[92px] shrink-0 shadow-[0_10px_24px_rgba(255,59,48,0.18)]"
                  onClick={() => onApply(group)}
                >
                  Apply
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

AIPickPanel.propTypes = {
  suggestions: PropTypes.arrayOf(
    PropTypes.shape({
      total: PropTypes.number.isRequired,
      seats: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          row: PropTypes.string.isRequired,
          number: PropTypes.number.isRequired,
          tier: PropTypes.string.isRequired,
          price: PropTypes.number.isRequired,
        }),
      ).isRequired,
    }),
  ).isRequired,
  onApply: PropTypes.func.isRequired,
  onPreviewChange: PropTypes.func.isRequired,
};

export default AIPickPanel;
