import PropTypes from 'prop-types';
import Badge from '../shared/Badge';
import { formatPrice } from '../../utils/priceFormatter';

/**
 * Pricing tier comparison table with AI best-value emphasis.
 * Props: event.
 */
function PricingTiers({ event }) {
  const columns = [
    { key: 'general', label: 'General', price: event.priceRange.min, highlight: false },
    {
      key: 'premium',
      label: 'Premium',
      price: Math.round((event.priceRange.min + event.priceRange.max) / 2),
      highlight: true,
    },
    { key: 'vip', label: 'VIP', price: event.priceRange.max, highlight: false },
  ];

  return (
    <section className="editorial-panel rounded-[32px] p-8">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-muted)]">Pricing tiers</p>
        <h2 className="mt-2 font-display text-4xl text-[var(--color-text-primary)]">Choose your vantage point</h2>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        {columns.map((column) => (
          <div
            key={column.key}
            className={`rounded-[28px] border p-6 transition duration-300 hover:bg-[rgba(255,255,255,0.04)] ${
              column.highlight
                ? 'border-[rgba(255,149,0,0.3)] bg-[rgba(255,149,0,0.05)]'
                : 'border-[var(--color-border-subtle)] bg-[rgba(255,255,255,0.02)]'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-display text-3xl text-[var(--color-text-primary)]">{column.label}</p>
                <p className="mt-3 text-2xl text-[var(--color-text-primary)]">{formatPrice(column.price)}</p>
              </div>
              {column.highlight ? <Badge label="Best Value" variant="accent" /> : null}
            </div>
            <ul className="mt-6 space-y-3 text-sm text-[var(--color-text-secondary)]">
              {event.tierPerks[column.key].map((perk) => (
                <li key={perk}>• {perk}</li>
              ))}
            </ul>
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
};

export default PricingTiers;
