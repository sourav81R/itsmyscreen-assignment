import PropTypes from 'prop-types';
import Button from '../shared/Button';
import { formatPrice } from '../../utils/priceFormatter';

/**
 * Contextual add-on strip powered by the mock AI service.
 * Props: addOns, selectedAddOns, onToggle.
 */
function AIAddOnStrip({ addOns, selectedAddOns, onToggle }) {
  return (
    <section className="editorial-panel rounded-[32px] p-6">
      <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-muted)]">AI add-ons</p>
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {addOns.map((addOn) => {
          const active = selectedAddOns.some((item) => item.id === addOn.id);
          return (
            <div
              key={addOn.id}
              className={`rounded-[24px] border p-4 ${
                active
                  ? 'border-[var(--color-brand-primary)] bg-[rgba(255,59,48,0.08)]'
                  : 'border-[var(--color-border-subtle)] bg-[rgba(255,255,255,0.03)]'
              }`}
            >
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[rgba(255,149,0,0.12)] text-[var(--color-brand-accent)]">
                {addOn.icon}
              </div>
              <p className="mt-4 font-medium text-[var(--color-text-primary)]">{addOn.name}</p>
              <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{formatPrice(addOn.price)}</p>
              <Button className="mt-4 w-full" size="sm" variant={active ? 'secondary' : 'primary'} onClick={() => onToggle(addOn)}>
                {active ? 'Remove' : '+ Add'}
              </Button>
            </div>
          );
        })}
      </div>
    </section>
  );
}

AIAddOnStrip.propTypes = {
  addOns: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
    }),
  ).isRequired,
  selectedAddOns: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
    }),
  ).isRequired,
  onToggle: PropTypes.func.isRequired,
};

export default AIAddOnStrip;
