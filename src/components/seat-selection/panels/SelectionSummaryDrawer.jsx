import PropTypes from 'prop-types';
import { AnimatePresence, motion } from 'framer-motion';
import Button from '../../shared/Button';
import Timer from '../../shared/Timer';
import { formatPrice } from '../../../utils/priceFormatter';
import { seatLabels } from '../../../utils/seatValidator';

function SelectionSummaryDrawer({ selectedSeats, timer, total, onProceed, disabled, loading, message }) {
  return (
    <AnimatePresence>
      {selectedSeats.length > 0 ? (
        <motion.section
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-[rgba(255,149,0,0.14)] bg-[linear-gradient(180deg,rgba(8,8,12,0.78),rgba(12,12,18,0.96))] px-4 py-4 backdrop-blur-xl md:px-8"
        >
          <div className="premium-panel mx-auto flex max-w-[1440px] flex-col gap-4 overflow-hidden rounded-[26px] bg-[linear-gradient(135deg,rgba(34,31,51,0.92),rgba(14,14,22,0.96)_58%,rgba(42,20,20,0.9))] px-4 py-4 shadow-[0_24px_54px_rgba(0,0,0,0.28)] md:flex-row md:items-center md:justify-between md:gap-6 md:px-6">
            <div className="min-w-0 transition-transform duration-200">
              <p className="truncate text-sm text-[var(--color-text-secondary)]">
                Selected: {seatLabels(selectedSeats).join(', ')} · {selectedSeats[0]?.tier?.toUpperCase()}
              </p>
              <p className="mt-1 font-display text-3xl text-[var(--color-text-primary)]">{formatPrice(total)}</p>
              {message ? <p className="mt-1 text-sm text-[var(--color-brand-accent)]">{message}</p> : null}
            </div>

            <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
              <div className="premium-chip rounded-full px-3 py-1.5 shadow-[0_10px_24px_rgba(0,0,0,0.16)]">
                <Timer display={timer.display} totalSeconds={timer.totalSeconds} />
              </div>
              <Button
                size="lg"
                onClick={onProceed}
                disabled={disabled || timer.totalSeconds <= 0}
                loading={loading}
                className="w-full shadow-[0_12px_28px_rgba(255,59,48,0.22)] transition-all duration-200 hover:translate-y-[-1px] hover:shadow-[0_18px_36px_rgba(255,59,48,0.3)] md:min-w-[220px]"
              >
                Proceed to Summary
              </Button>
            </div>
          </div>
        </motion.section>
      ) : null}
    </AnimatePresence>
  );
}

SelectionSummaryDrawer.propTypes = {
  selectedSeats: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      row: PropTypes.string.isRequired,
      number: PropTypes.number.isRequired,
      tier: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
    }),
  ).isRequired,
  timer: PropTypes.shape({
    display: PropTypes.string.isRequired,
    totalSeconds: PropTypes.number.isRequired,
  }).isRequired,
  total: PropTypes.number.isRequired,
  onProceed: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  message: PropTypes.string,
};

SelectionSummaryDrawer.defaultProps = {
  message: '',
};

export default SelectionSummaryDrawer;
