import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Button from '../shared/Button';
import { seatLabels } from '../../utils/seatValidator';
import { formatLongDate } from '../../utils/dateFormatter';

const confettiClasses = [
  'left-[8%] top-[10%]',
  'left-[18%] top-[22%]',
  'left-[31%] top-[14%]',
  'left-[47%] top-[8%]',
  'left-[63%] top-[18%]',
  'left-[78%] top-[12%]',
  'left-[88%] top-[26%]',
  'left-[12%] top-[72%]',
  'left-[26%] top-[84%]',
  'left-[39%] top-[76%]',
  'left-[58%] top-[82%]',
  'left-[72%] top-[74%]',
  'left-[84%] top-[86%]',
];

/**
 * Full-screen success modal with booking id, confetti, and follow-up actions.
 * Props: open, bookingId, event, showtime, seats, onClose.
 */
function ConfirmationModal({ open, bookingId, event, showtime, seats, onClose }) {
  const navigate = useNavigate();

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-[rgba(10,10,15,0.92)] backdrop-blur-xl">
      {confettiClasses.map((className, index) => (
        <motion.span
          key={className}
          className={`absolute h-3 w-3 rounded-full ${className} ${index % 2 === 0 ? 'bg-[var(--color-brand-primary)]' : 'bg-[var(--color-brand-accent)]'}`}
          initial={{ opacity: 0, scale: 0.4, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: [0, 18, 0] }}
          transition={{ duration: 1.6, delay: index * 0.04, repeat: Infinity, repeatType: 'mirror' }}
        />
      ))}

      <div className="flex h-full items-center justify-center px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          className="editorial-panel relative w-full max-w-[720px] rounded-[36px] p-10 text-center"
        >
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-text-muted)]">Booking confirmed</p>
          <h2 className="mt-4 font-display text-6xl text-[var(--color-text-primary)]">See you there</h2>
          <p className="mt-4 text-[var(--color-text-secondary)]">
            {event.title} · {formatLongDate(showtime.date)} · {showtime.time}
          </p>
          <p className="mt-2 text-[var(--color-text-secondary)]">Seats {seatLabels(seats).join(', ')}</p>
          <div className="mt-8 rounded-[28px] border border-[rgba(255,149,0,0.24)] bg-[rgba(255,149,0,0.06)] px-6 py-5">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-muted)]">Booking ID</p>
            <p className="mt-2 font-display text-4xl text-[var(--color-brand-accent)]">{bookingId}</p>
          </div>
          <div className="mt-8 flex justify-center gap-3">
            <Button onClick={() => window.print()}>Download Ticket</Button>
            <Button
              variant="secondary"
              onClick={() => {
                onClose();
                navigate('/discover');
              }}
            >
              Browse More Events
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

ConfirmationModal.propTypes = {
  open: PropTypes.bool.isRequired,
  bookingId: PropTypes.string.isRequired,
  event: PropTypes.shape({
    title: PropTypes.string.isRequired,
  }).isRequired,
  showtime: PropTypes.shape({
    date: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
  }).isRequired,
  seats: PropTypes.arrayOf(
    PropTypes.shape({
      row: PropTypes.string.isRequired,
      number: PropTypes.number.isRequired,
    }),
  ).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ConfirmationModal;
