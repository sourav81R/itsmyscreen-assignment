import PropTypes from 'prop-types';
import { Sparkles } from 'lucide-react';
import { formatPrice } from '../../../utils/priceFormatter';

const tierMeta = {
  vip: { label: 'VIP', color: '#FFD60A' },
  premium: { label: 'Premium', color: '#30D158' },
  general: { label: 'General', color: '#0A84FF' },
};

function SeatLegend({ seats, activeTierFilter, onToggleTier }) {
  const stats = Object.entries(tierMeta).map(([tier, meta]) => {
    const tierSeats = seats.filter((seat) => seat.tier === tier);
    const available = tierSeats.filter((seat) => seat.status !== 'unavailable').length;
    const prices = tierSeats.map((seat) => seat.price);

    return {
      ...meta,
      tier,
      available,
      total: tierSeats.length,
      ratio: tierSeats.length > 0 ? available / tierSeats.length : 0,
      minPrice: Math.min(...prices),
      maxPrice: Math.max(...prices),
    };
  });

  return (
    <div className="seat-legend-bar editorial-panel premium-panel">
      <div className="seat-legend-scroll">
        {stats.map((item) => {
          const active = activeTierFilter === item.tier;

          return (
            <button
              key={item.tier}
              type="button"
              onClick={() => onToggleTier(active ? null : item.tier)}
              className={`seat-legend-chip ${active ? 'is-active' : ''}`}
            >
              <span className="seat-legend-swatch" style={{ background: item.color }} aria-hidden="true" />
              <span className="seat-legend-copy">
                <span className="seat-legend-title">
                  {item.label} - {formatPrice(item.minPrice)} to {formatPrice(item.maxPrice)}
                </span>
                <span className="seat-legend-subtitle">
                  {item.available} of {item.total} available
                </span>
                <span className="seat-legend-progress">
                  <span style={{ width: `${Math.round(item.ratio * 100)}%`, background: item.color }} />
                </span>
              </span>
            </button>
          );
        })}

        <div className="seat-legend-static">
          <span className="seat-legend-swatch seat-legend-selected" aria-hidden="true" />
          <span>Selected</span>
        </div>
        <div className="seat-legend-static seat-legend-static-unavailable">
          <span className="seat-legend-swatch seat-legend-unavailable" aria-hidden="true" />
          <span>Unavailable</span>
        </div>
        <div className="seat-legend-static">
          <Sparkles className="h-3.5 w-3.5 text-[var(--color-brand-accent)]" aria-hidden="true" />
          <span>AI suggested</span>
        </div>
      </div>
    </div>
  );
}

SeatLegend.propTypes = {
  seats: PropTypes.arrayOf(
    PropTypes.shape({
      tier: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      status: PropTypes.string.isRequired,
    }),
  ).isRequired,
  activeTierFilter: PropTypes.oneOf(['vip', 'premium', 'general', null]),
  onToggleTier: PropTypes.func.isRequired,
};

SeatLegend.defaultProps = {
  activeTierFilter: null,
};

export default SeatLegend;
