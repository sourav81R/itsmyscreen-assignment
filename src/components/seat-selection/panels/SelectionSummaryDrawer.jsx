import PropTypes from 'prop-types';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import Button from '../../shared/Button';
import { formatPrice } from '../../../utils/priceFormatter';

function SelectionSummaryDrawer({ selectedSeats, timer, total, onRemoveSeat, onProceed, disabled, loading, message }) {
  return (
    <AnimatePresence>
      {selectedSeats.length > 0 ? (
        <motion.section
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          className="selection-summary-drawer editorial-panel premium-panel"
        >
          <div className="selection-summary-main">
            <div>
              <p className="selection-summary-eyebrow">Your seats</p>
              <h2 className="selection-summary-title">{selectedSeats.length} selected</h2>
            </div>

            <div className={`selection-summary-timer ${timer.totalSeconds < 120 ? 'is-urgent' : ''}`}>
              <span>Hold timer</span>
              <strong>{timer.display}</strong>
            </div>
          </div>

          <div className="selection-summary-seats thin-scrollbar">
            {selectedSeats.map((seat) => (
              <div key={seat.id} className="selection-summary-seat">
                <div>
                  <p className="selection-summary-seat-id">{seat.row}{seat.number}</p>
                  <p className="selection-summary-seat-meta">{seat.tier.toUpperCase()} · {formatPrice(seat.price)}</p>
                </div>
                <button
                  type="button"
                  aria-label={`Remove seat ${seat.row}${seat.number}`}
                  onClick={() => onRemoveSeat(seat)}
                  className="selection-summary-remove"
                >
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>

          <div className="selection-summary-footer">
            <div>
              <p className="selection-summary-total-label">Total</p>
              <p className="selection-summary-total-value">{formatPrice(total)}</p>
              <p className="selection-summary-insight">AI notes: these seats keep strong sightlines for your chosen count.</p>
              {message ? <p className="selection-summary-warning">{message}</p> : null}
            </div>
            <Button size="lg" onClick={onProceed} disabled={disabled} loading={loading} className="min-w-[180px]">
              Continue
            </Button>
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
  onRemoveSeat: PropTypes.func.isRequired,
  onProceed: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  message: PropTypes.string,
};

SelectionSummaryDrawer.defaultProps = {
  message: '',
};

export default SelectionSummaryDrawer;
