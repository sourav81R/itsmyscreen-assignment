import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import Button from '../shared/Button';
import { formatLongDate } from '../../utils/dateFormatter';
import { seatLabels } from '../../utils/seatValidator';

/**
 * Read-only booking recap card with edit navigation back to seats.
 * Props: event, showtime, seats.
 */
function OrderSummaryCard({ event, showtime, seats }) {
  const navigate = useNavigate();

  return (
    <section className="premium-panel group rounded-[30px] bg-[linear-gradient(145deg,rgba(31,31,48,0.96),rgba(15,15,24,0.98))] p-6">
      <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-muted)]">Order details</p>
      <div className="mt-5 flex gap-4">
        <div className="overflow-hidden rounded-[22px] border border-[rgba(255,149,0,0.14)] bg-[rgba(255,255,255,0.03)]">
          <img
            src={event.thumbnailUrl}
            alt={`${event.title} ticket summary artwork`}
            className="h-28 w-24 object-cover transition duration-300 group-hover:scale-[1.04]"
          />
        </div>
        <div>
          <p className="font-display text-[2.05rem] leading-[1.05] text-[var(--color-text-primary)]">{event.title}</p>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            {formatLongDate(showtime.date)} · {showtime.time}
          </p>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{event.venue.name}</p>
          <p className="mt-4 inline-flex rounded-full border border-[rgba(255,149,0,0.14)] bg-[rgba(255,255,255,0.03)] px-3 py-1.5 text-sm text-[var(--color-text-primary)] transition duration-200 group-hover:border-[rgba(255,190,92,0.34)]">
            Seats: {seatLabels(seats).join(', ')} · {seats[0]?.tier?.toUpperCase()} · {seats.length} tickets
          </p>
        </div>
      </div>

      <Button
        className="mt-6 border-[rgba(255,149,0,0.16)] bg-[rgba(255,255,255,0.02)] hover:border-[rgba(255,190,92,0.38)] hover:bg-[rgba(255,149,0,0.08)]"
        variant="secondary"
        onClick={() => navigate(`/event/${event.id}/seats`)}
      >
        Edit Seats
      </Button>
    </section>
  );
}

OrderSummaryCard.propTypes = {
  event: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    thumbnailUrl: PropTypes.string.isRequired,
    venue: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  showtime: PropTypes.shape({
    date: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
  }).isRequired,
  seats: PropTypes.arrayOf(
    PropTypes.shape({
      row: PropTypes.string.isRequired,
      number: PropTypes.number.isRequired,
      tier: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default OrderSummaryCard;
