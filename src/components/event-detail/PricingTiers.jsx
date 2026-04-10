import PropTypes from 'prop-types';
import Badge from '../shared/Badge';
import { formatPrice } from '../../utils/priceFormatter';

/**
 * Pricing tier comparison table with AI best-value emphasis.
 * Props: event.
 */
function PricingTiers({ event }) {
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
    <section className="editorial-panel premium-panel rounded-[28px] bg-[linear-gradient(180deg,rgba(19,19,30,0.98),rgba(12,12,20,0.98))] p-6 lg:p-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-[var(--color-brand-accent)]">Pricing tiers</p>
          <h2 className="mt-2.5 font-display text-3xl text-[var(--color-text-primary)]">Choose your vantage point</h2>
          <p className="mt-2.5 max-w-2xl text-[15px] leading-6 text-[var(--color-text-secondary)]">
            Compare the atmosphere, comfort, and view quality before you jump into seat selection.
          </p>
        </div>

        <div className="premium-chip rounded-full px-3 py-1.5 text-sm text-[var(--color-text-secondary)]">
          Live pricing preview
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {columns.map((column) => (
          <div
            key={column.key}
            className={`premium-panel rounded-[24px] p-5 ${
              column.highlight
                ? 'border-[rgba(255,190,92,0.34)] bg-[linear-gradient(180deg,rgba(255,149,0,0.1),rgba(255,255,255,0.03))]'
                : 'bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))]'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--color-text-muted)]">{column.eyebrow}</p>
                <p className="mt-2.5 font-display text-[1.8rem] text-[var(--color-text-primary)]">{column.label}</p>
                <p className="mt-2.5 text-[1.8rem] text-[var(--color-text-primary)]">{formatPrice(column.price)}</p>
              </div>
              {column.highlight ? <Badge label="Best Value" variant="accent" /> : null}
            </div>

            <ul className="mt-6 space-y-2.5 text-sm leading-6 text-[var(--color-text-secondary)]">
              {event.tierPerks[column.key].map((perk) => (
                <li key={perk} className="premium-chip rounded-[16px] px-3.5 py-2.5">
                  {perk}
                </li>
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
