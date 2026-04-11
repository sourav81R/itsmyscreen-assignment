import PropTypes from 'prop-types';
import { AnimatePresence, motion } from 'framer-motion';
import { formatPrice } from '../../../utils/priceFormatter';

const tierColors = {
  vip: '#FFD60A',
  premium: '#30D158',
  general: '#0A84FF',
};

function SeatInfoTooltip({ tooltip }) {
  return (
    <AnimatePresence>
      {tooltip.visible ? (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className="seat-tooltip"
          style={{
            left: tooltip.screenX,
            top: tooltip.screenY,
            transform: tooltip.screenX > 420 ? 'translate(-108%, -18px)' : 'translate(14px, -18px)',
          }}
        >
          <div className="seat-tooltip-card" style={{ borderColor: `${tierColors[tooltip.seat?.tier] ?? '#434359'}55` }}>
            {tooltip.seat?.status === 'unavailable' ? (
              <>
                <p className="seat-tooltip-seat">{tooltip.seat.row}{tooltip.seat.number}</p>
                <p className="seat-tooltip-note">Already taken</p>
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
    viewQuality: PropTypes.number.isRequired,
    note: PropTypes.string.isRequired,
    seat: PropTypes.shape({
      row: PropTypes.string,
      number: PropTypes.number,
      tier: PropTypes.string,
      status: PropTypes.string,
      price: PropTypes.number,
    }),
  }).isRequired,
};

export default SeatInfoTooltip;
