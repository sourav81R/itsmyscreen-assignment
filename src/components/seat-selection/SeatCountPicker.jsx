import PropTypes from 'prop-types';
import { Minus, Plus } from 'lucide-react';

/**
 * Seat count stepper capped between one and ten selections.
 * Props: value, onChange.
 */
function SeatCountPicker({ value, onChange }) {
  return (
    <section className="editorial-panel premium-panel rounded-[28px] bg-[linear-gradient(180deg,rgba(24,24,38,0.98),rgba(14,14,24,0.98))] p-6">
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-muted)]">How many seats?</p>
        <span className="premium-chip rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-[var(--color-brand-accent)]">
          Group size
        </span>
      </div>
      <div className="premium-panel mt-4 flex items-center justify-between rounded-[24px] bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.018))] p-3">
        <button
          type="button"
          aria-label="Decrease seat count"
          onClick={() => onChange(Math.max(1, value - 1))}
          className="premium-chip rounded-full p-3 text-[var(--color-text-primary)]"
        >
          <Minus className="h-4 w-4" aria-hidden="true" />
        </button>
        <div className="text-center">
          <p className="font-display text-[2.6rem] leading-none text-[var(--color-text-primary)]">{value}</p>
          <p className="text-xs uppercase tracking-[0.16em] text-[var(--color-text-muted)]">Seats</p>
        </div>
        <button
          type="button"
          aria-label="Increase seat count"
          onClick={() => onChange(Math.min(10, value + 1))}
          className="premium-chip rounded-full p-3 text-[var(--color-text-primary)]"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}

SeatCountPicker.propTypes = {
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default SeatCountPicker;
