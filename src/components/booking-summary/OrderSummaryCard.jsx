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
    <section className="editorial-panel rounded-[32px] p-6">
      <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-muted)]">Order details</p>
      <div className="mt-5 flex gap-4">
        <img src={event.thumbnailUrl} alt={`${event.title} ticket summary artwork`} className="h-28 w-24 rounded-[20px] object-cover" />
        <div>
          <p className="font-display text-3xl text-[var(--color-text-primary)]">{event.title}</p>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            {formatLongDate(showtime.date)} · {showtime.time}
          </p>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{event.venue.name}</p>
          <p className="mt-4 text-sm text-[var(--color-text-primary)]">
            Seats: {seatLabels(seats).join(', ')} · {seats[0]?.tier?.toUpperCase()} · {seats.length} tickets
          </p>
        </div>
      </div>

      <Button className="mt-6" variant="secondary" onClick={() => navigate(`/event/${event.id}/seats`)}>
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
