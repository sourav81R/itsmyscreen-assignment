import PropTypes from 'prop-types';
import Badge from '../shared/Badge';
import Button from '../shared/Button';
import { formatPrice } from '../../utils/priceFormatter';

const tierColors = {
  general: 'var(--color-seat-general)',
  premium: 'var(--color-seat-premium)',
  vip: 'var(--color-seat-vip)',
};

/**
 * Pricing tier comparison table with AI best-value emphasis.
 * Props: event.
 */
function PricingTiers({ event, onSelectSeats }) {
  const columns = [
    {
      key: 'general',
      label: 'General',
      eyebrow: 'Easy entry',
      price: event.priceRange.min,
      highlight: false,
    },
    {
      key: 'premium',
      label: 'Premium',
      eyebrow: 'Best balance',
      price: Math.round((event.priceRange.min + event.priceRange.max) / 2),
      highlight: true,
    },
    {
      key: 'vip',
      label: 'VIP',
      eyebrow: 'Top access',
      price: event.priceRange.max,
      highlight: false,
    },
  ];

  return (
    <section className="editorial-panel premium-panel rounded-[22px] bg-[linear-gradient(180deg,rgba(19,19,30,0.98),rgba(12,12,20,0.98))] p-4 lg:p-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.26em] text-[var(--color-brand-accent)]">Pricing tiers</p>
          <h2 className="mt-1.5 font-display text-[1.6rem] text-[var(--color-text-primary)]">Choose your vantage point</h2>
          <p className="mt-1.5 max-w-2xl text-[13px] leading-5 text-[var(--color-text-secondary)]">
            Compare the atmosphere, comfort, and view quality before you jump into seat selection.
          </p>
        </div>

        <div className="premium-chip rounded-full px-3 py-1 text-[12px] text-[var(--color-text-secondary)]">
          Live pricing preview
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 md:grid md:grid-cols-3 md:gap-4">
        {columns.map((column) => (
          <div
            key={column.key}
            className={`premium-panel rounded-[18px] p-3.5 ${
              column.highlight
                ? 'border-[rgba(255,190,92,0.34)] bg-[linear-gradient(180deg,rgba(255,149,0,0.1),rgba(255,255,255,0.03))]'
                : 'bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))]'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-muted)]">{column.eyebrow}</p>
                <p className="mt-1.5 font-display text-[1.28rem]" style={{ color: tierColors[column.key] }}>
                  {column.label}
                </p>
                <p className="mt-1.5 text-[1.28rem] text-[var(--color-text-primary)]">{formatPrice(column.price)}</p>
              </div>
              {column.highlight ? <Badge label="Best Value" variant="accent" /> : null}
            </div>

            <ul className="mt-4 space-y-2 text-[12px] leading-5 text-[var(--color-text-secondary)]">
              {event.tierPerks[column.key].map((perk) => (
                <li key={perk} className="premium-chip rounded-[12px] px-3 py-1.5">
                  {perk}
                </li>
              ))}
            </ul>

            <Button
              size="sm"
              onClick={onSelectSeats}
              className="mt-4 h-9 w-full justify-center px-4 text-[13px] shadow-[0_10px_22px_rgba(255,59,48,0.16)]"
            >
              Book Seats
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
}

PricingTiers.propTypes = {
  event: PropTypes.shape({
    priceRange: PropTypes.shape({
      min: PropTypes.number.isRequired,
      max: PropTypes.number.isRequired,
    }).isRequired,
    tierPerks: PropTypes.shape({
      general: PropTypes.arrayOf(PropTypes.string).isRequired,
      premium: PropTypes.arrayOf(PropTypes.string).isRequired,
      vip: PropTypes.arrayOf(PropTypes.string).isRequired,
    }).isRequired,
  }).isRequired,
  onSelectSeats: PropTypes.func.isRequired,
};

export default PricingTiers;
