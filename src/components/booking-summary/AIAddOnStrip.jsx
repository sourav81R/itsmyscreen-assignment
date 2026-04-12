import PropTypes from 'prop-types';
import Button from '../shared/Button';
import { formatPrice } from '../../utils/priceFormatter';

/**
 * Contextual add-on strip powered by the mock AI service.
 * Props: addOns, selectedAddOns, onToggle.
 */
function AIAddOnStrip({ addOns, selectedAddOns, onToggle }) {
  return (
    <section className="premium-panel rounded-[30px] bg-[linear-gradient(145deg,rgba(31,31,48,0.96),rgba(15,15,23,0.98))] p-6">
      <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-muted)]">AI add-ons</p>
      <div className="mt-5 flex gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-3 md:overflow-visible md:pb-0">
        {addOns.map((addOn) => {
          const active = selectedAddOns.some((item) => item.id === addOn.id);
          return (
            <div
              key={addOn.id}
              className={`premium-panel min-w-[240px] rounded-[24px] p-4 transition duration-200 md:min-w-0 ${
                active
                  ? 'border-[rgba(255,190,92,0.4)] bg-[linear-gradient(145deg,rgba(255,149,0,0.16),rgba(255,59,48,0.08)_70%,rgba(255,255,255,0.03))] shadow-[0_18px_40px_rgba(255,149,0,0.08)]'
                  : 'bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0.02))]'
              }`}
            >
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[rgba(255,149,0,0.18)] bg-[rgba(255,149,0,0.12)] text-[var(--color-brand-accent)]">
                {addOn.icon}
              </div>
              <p className="mt-4 font-medium text-[var(--color-text-primary)]">{addOn.name}</p>
              <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{formatPrice(addOn.price)}</p>
              <Button
                className="mt-4 w-full shadow-[0_12px_24px_rgba(0,0,0,0.16)]"
                size="sm"
                variant={active ? 'secondary' : 'primary'}
                onClick={() => onToggle(addOn)}
              >
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
