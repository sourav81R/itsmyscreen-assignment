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
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--color-premium-border)] bg-[linear-gradient(180deg,rgba(10,10,15,0.96),rgba(14,14,22,0.98))] px-8 py-4 backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-6 rounded-[24px] border border-[rgba(255,149,0,0.14)] bg-[rgba(255,255,255,0.02)] px-5 py-3 shadow-[0_18px_42px_rgba(0,0,0,0.22)]">
        <div>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Selected: {seatLabels(seats).join(', ')} · {seats[0]?.tier?.toUpperCase()}
          </p>
          <p className="mt-1 font-display text-3xl text-[var(--color-text-primary)]">{formatPrice(total)}</p>
          {message ? <p className="mt-1 text-sm text-[var(--color-brand-accent)]">{message}</p> : null}
        </div>
        <div className="flex items-center gap-4">
          <Timer display={timer.display} totalSeconds={timer.totalSeconds} />
          <Button
            onClick={onProceed}
            disabled={disabled || timer.isExpired}
            loading={loading}
            className="shadow-[0_12px_28px_rgba(255,59,48,0.22)]"
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
