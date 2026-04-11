import PropTypes from 'prop-types';
import { AnimatePresence, motion } from 'framer-motion';
import Button from '../../shared/Button';
import { isSeatBooked } from '../../../services/seatService';
import { formatPrice } from '../../../utils/priceFormatter';

const tierColors = {
  vip: '#FFD60A',
  premium: '#30D158',
  general: '#0A84FF',
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

function SeatInfoTooltip({ tooltip, selectedSeatIds, onBookSeat, onMouseEnter, onMouseLeave }) {
  const cardWidth = 220;
  const seatIsBooked = isSeatBooked(tooltip.seat);
  const cardHeight = seatIsBooked ? 118 : 248;
  const left = clamp(tooltip.screenX + 16, 12, Math.max(12, tooltip.containerWidth - cardWidth - 12));
  const top = clamp(tooltip.screenY - 26, 12, Math.max(12, tooltip.containerHeight - cardHeight - 12));
  const isSelected = Boolean(tooltip.seat?.id && selectedSeatIds.has(tooltip.seat.id));

  return (
    <AnimatePresence>
      {tooltip.visible ? (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className="seat-tooltip"
          style={{ left, top }}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <div className="seat-tooltip-card" style={{ borderColor: `${tierColors[tooltip.seat?.tier] ?? '#434359'}55` }}>
            {seatIsBooked ? (
              <>
                <p className="seat-tooltip-seat">{tooltip.seat.row}{tooltip.seat.number}</p>
                <p className="seat-tooltip-note">Already booked</p>
              </>
            ) : (
              <>
                <p className="seat-tooltip-seat">{tooltip.seat?.row}{tooltip.seat?.number}</p>
                <span
                  className="seat-tooltip-badge"
                  style={{
                    color: tierColors[tooltip.seat?.tier] ?? '#F5F5F7',
                    borderColor: `${tierColors[tooltip.seat?.tier] ?? '#F5F5F7'}55`,
                    background: `${tierColors[tooltip.seat?.tier] ?? '#F5F5F7'}1C`,
                  }}
                >
                  {tooltip.seat?.tier?.toUpperCase()}
                </span>
                <p className="seat-tooltip-price">{formatPrice(tooltip.seat?.price)}</p>
                <div className="seat-tooltip-rating">
                  <span>{'★'.repeat(tooltip.viewQuality)}{'☆'.repeat(5 - tooltip.viewQuality)}</span>
                  <span>view</span>
                </div>
                <p className="seat-tooltip-note">{tooltip.note}</p>
                <Button size="sm" className="mt-4 w-full justify-center" onClick={() => onBookSeat(tooltip.seat)}>
                  {isSelected ? 'Remove this seat' : 'Book this seat'}
                </Button>
              </>
            )}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

SeatInfoTooltip.propTypes = {
  tooltip: PropTypes.shape({
    visible: PropTypes.bool.isRequired,
    screenX: PropTypes.number.isRequired,
    screenY: PropTypes.number.isRequired,
    containerWidth: PropTypes.number.isRequired,
    containerHeight: PropTypes.number.isRequired,
    viewQuality: PropTypes.number.isRequired,
    note: PropTypes.string.isRequired,
    seat: PropTypes.shape({
      id: PropTypes.string,
      row: PropTypes.string,
      number: PropTypes.number,
      tier: PropTypes.string,
      status: PropTypes.string,
      price: PropTypes.number,
    }),
  }).isRequired,
  selectedSeatIds: PropTypes.instanceOf(Set).isRequired,
  onBookSeat: PropTypes.func.isRequired,
  onMouseEnter: PropTypes.func.isRequired,
  onMouseLeave: PropTypes.func.isRequired,
};

export default SeatInfoTooltip;
