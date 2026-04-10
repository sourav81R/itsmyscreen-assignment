import PropTypes from 'prop-types';
import Button from '../shared/Button';
import Timer from '../shared/Timer';
import { seatLabels } from '../../utils/seatValidator';
import { formatPrice } from '../../utils/priceFormatter';

/**
 * Fixed booking summary bar with live price, timer, and proceed CTA.
 * Props: seats, total, timer, onProceed, disabled, message.
 */
function PriceSummaryBar({ seats, total, timer, onProceed, disabled, message, loading }) {
  if (seats.length === 0) {
    return null;
  }

  return (
    <div
      aria-live="polite"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[rgba(255,149,0,0.14)] bg-[linear-gradient(180deg,rgba(8,8,12,0.78),rgba(12,12,18,0.96))] px-8 py-4 backdrop-blur-xl"
    >
      <div className="premium-panel mx-auto flex max-w-[1440px] items-center justify-between gap-6 overflow-hidden rounded-[26px] bg-[linear-gradient(135deg,rgba(34,31,51,0.92),rgba(14,14,22,0.96)_58%,rgba(42,20,20,0.9))] px-6 py-4 shadow-[0_24px_54px_rgba(0,0,0,0.28)]">
        <div className="transition-transform duration-200">
          <p className="text-sm text-[var(--color-text-secondary)]">
            Selected: {seatLabels(seats).join(', ')} · {seats[0]?.tier?.toUpperCase()}
          </p>
          <p className="mt-1 font-display text-3xl text-[var(--color-text-primary)]">{formatPrice(total)}</p>
          {message ? <p className="mt-1 text-sm text-[var(--color-brand-accent)]">{message}</p> : null}
        </div>
        <div className="flex items-center gap-4">
          <div className="premium-chip rounded-full px-3 py-1.5 shadow-[0_10px_24px_rgba(0,0,0,0.16)]">
            <Timer display={timer.display} totalSeconds={timer.totalSeconds} />
          </div>
          <Button
            onClick={onProceed}
            disabled={disabled || timer.isExpired}
            loading={loading}
            className="shadow-[0_12px_28px_rgba(255,59,48,0.22)] transition-all duration-200 hover:translate-y-[-1px] hover:shadow-[0_18px_36px_rgba(255,59,48,0.3)]"
          >
            Proceed to Summary
          </Button>
        </div>
      </div>
    </div>
  );
}

PriceSummaryBar.propTypes = {
  seats: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      row: PropTypes.string.isRequired,
      number: PropTypes.number.isRequired,
      tier: PropTypes.string.isRequired,
    }),
  ).isRequired,
  total: PropTypes.number.isRequired,
  timer: PropTypes.shape({
    display: PropTypes.string.isRequired,
    totalSeconds: PropTypes.number.isRequired,
    isExpired: PropTypes.bool.isRequired,
  }).isRequired,
  onProceed: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  message: PropTypes.string,
  loading: PropTypes.bool,
};

PriceSummaryBar.defaultProps = {
  disabled: false,
  message: '',
  loading: false,
};

export default PriceSummaryBar;
