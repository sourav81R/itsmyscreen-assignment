import PropTypes from 'prop-types';
import { Minus, Plus } from 'lucide-react';

/**
 * Seat count stepper capped between one and ten selections.
 * Props: value, onChange.
 */
function SeatCountPicker({ value, onChange }) {
  return (
    <section className="editorial-panel rounded-[28px] p-6">
      <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-muted)]">How many seats?</p>
      <div className="mt-4 flex items-center justify-between rounded-[24px] border border-[var(--color-border-subtle)] bg-[rgba(255,255,255,0.03)] p-3">
        <button
          type="button"
          aria-label="Decrease seat count"
          onClick={() => onChange(Math.max(1, value - 1))}
          className="rounded-full bg-[rgba(255,255,255,0.05)] p-3 text-[var(--color-text-primary)]"
        >
          <Minus className="h-4 w-4" aria-hidden="true" />
        </button>
        <div className="text-center">
          <p className="font-display text-4xl text-[var(--color-text-primary)]">{value}</p>
          <p className="text-xs uppercase tracking-[0.16em] text-[var(--color-text-muted)]">Seats</p>
        </div>
        <button
          type="button"
          aria-label="Increase seat count"
          onClick={() => onChange(Math.min(10, value + 1))}
          className="rounded-full bg-[rgba(255,255,255,0.05)] p-3 text-[var(--color-text-primary)]"
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
