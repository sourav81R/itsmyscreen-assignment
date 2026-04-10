import PropTypes from 'prop-types';
import { formatShortDate } from '../../utils/dateFormatter';
import { useBookingStore } from '../../store/useBookingStore';

/**
 * Date tabs and time slot selector for event showtimes.
 * Props: showtimes.
 */
function ShowtimeSelector({ showtimes }) {
  const selectedShowtime = useBookingStore((state) => state.selectedShowtime);
  const setShowtime = useBookingStore((state) => state.setShowtime);
  const selectedDate = selectedShowtime?.date ?? showtimes[0]?.date;
  const dates = [...new Set(showtimes.map((showtime) => showtime.date))];
  const dateTimes = showtimes.filter((showtime) => showtime.date === selectedDate);

  return (
    <section className="editorial-panel rounded-[28px] p-6">
      <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-muted)]">Showtime</p>
      <div className="thin-scrollbar mt-4 flex gap-3 overflow-x-auto pb-2">
        {dates.map((date) => (
          <button
            key={date}
            type="button"
            onClick={() => {
              const nextShowtime = showtimes.find((showtime) => showtime.date === date);
              setShowtime(nextShowtime);
            }}
            className={`rounded-full border px-4 py-3 text-sm transition ${
              selectedDate === date
                ? 'border-[var(--color-brand-primary)] bg-[rgba(255,59,48,0.12)] text-[var(--color-text-primary)]'
                : 'border-[var(--color-border-subtle)] bg-[rgba(255,255,255,0.03)] text-[var(--color-text-secondary)]'
            }`}
          >
            {formatShortDate(date)}
          </button>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        {dateTimes.map((showtime) => {
          const soldOut = showtime.availableSeats <= 0;
          const active = selectedShowtime?.id === showtime.id;
          return (
            <button
              key={showtime.id}
              type="button"
              disabled={soldOut}
              onClick={() => setShowtime(showtime)}
              className={`rounded-2xl border px-4 py-4 text-left transition ${
                active
                  ? 'border-[var(--color-brand-primary)] bg-[rgba(255,59,48,0.1)]'
                  : 'border-[var(--color-border-subtle)] bg-[rgba(255,255,255,0.03)]'
              } ${soldOut ? 'cursor-not-allowed opacity-40' : ''}`}
            >
              <p className="text-[var(--color-text-primary)]">{showtime.time}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                {soldOut ? 'Sold out' : `${showtime.availableSeats.toLocaleString('en-IN')} seats left`}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
}

ShowtimeSelector.propTypes = {
  showtimes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      time: PropTypes.string.isRequired,
      availableSeats: PropTypes.number.isRequired,
    }),
  ).isRequired,
};

export default ShowtimeSelector;
