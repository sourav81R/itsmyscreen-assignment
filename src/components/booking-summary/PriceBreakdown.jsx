import PropTypes from 'prop-types';
import { formatPrice } from '../../utils/priceFormatter';

/**
 * Receipt-style ticket total breakdown including booking fees, GST, and add-ons.
 * Props: seats, addOns.
 */
function PriceBreakdown({ seats, addOns }) {
  const base = seats.reduce((sum, seat) => sum + seat.price, 0);
  const bookingFee = seats.length * 100;
  const addOnTotal = addOns.reduce((sum, addOn) => sum + addOn.price, 0);
  const gst = Math.round((base + bookingFee + addOnTotal) * 0.18);
  const total = base + bookingFee + addOnTotal + gst;

  return (
    <section className="editorial-panel rounded-[32px] p-6">
      <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-muted)]">Price breakdown</p>
      <div className="mt-5 space-y-4 text-sm text-[var(--color-text-secondary)]">
        <div className="flex items-center justify-between">
          <span>Base price</span>
          <span>{formatPrice(base)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Booking fee</span>
          <span>{formatPrice(bookingFee)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Add-ons</span>
          <span>{formatPrice(addOnTotal)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>GST (18%)</span>
          <span>{formatPrice(gst)}</span>
        </div>
        <div className="border-t border-[var(--color-border-subtle)] pt-4">
          <div className="flex items-center justify-between font-display text-3xl text-[var(--color-text-primary)]">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

PriceBreakdown.propTypes = {
  seats: PropTypes.arrayOf(
    PropTypes.shape({
      price: PropTypes.number.isRequired,
    }),
  ).isRequired,
  addOns: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
    }),
  ).isRequired,
};

export default PriceBreakdown;
