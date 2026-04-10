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
    <section className="editorial-panel premium-panel rounded-[28px] bg-[linear-gradient(180deg,rgba(24,24,38,0.98),rgba(14,14,24,0.98))] p-6">
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-muted)]">Showtime</p>
        <span className="premium-chip rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-[var(--color-brand-accent)]">
          Live slots
        </span>
      </div>
      <div className="thin-scrollbar mt-4 flex gap-3 overflow-x-auto pb-2">
        {dates.map((date) => (
          <button
            key={date}
            type="button"
            onClick={() => {
              const nextShowtime = showtimes.find((showtime) => showtime.date === date);
              setShowtime(nextShowtime);
            }}
            className={`premium-chip rounded-full px-4 py-3 text-sm transition ${
              selectedDate === date
                ? '!border-[rgba(255,149,0,0.4)] !bg-[linear-gradient(135deg,rgba(255,149,0,0.16),rgba(255,59,48,0.1))] text-[var(--color-text-primary)]'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
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
            className={`premium-panel rounded-[20px] px-4 py-4 text-left transition ${
              active
                  ? 'border-[rgba(255,149,0,0.4)] bg-[linear-gradient(135deg,rgba(255,149,0,0.12),rgba(255,59,48,0.08))]'
                  : 'bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))] hover:border-[rgba(255,149,0,0.28)] hover:bg-[rgba(255,255,255,0.05)]'
              } ${soldOut ? 'cursor-not-allowed opacity-40' : ''}`}
            >
              <p className="font-medium text-[var(--color-text-primary)]">{showtime.time}</p>
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
