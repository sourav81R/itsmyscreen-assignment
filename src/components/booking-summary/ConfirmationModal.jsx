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
    <div className="fixed inset-0 z-50 overflow-hidden bg-[rgba(6,6,10,0.9)] backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-8%] top-[-6%] h-72 w-72 rounded-full bg-[rgba(255,59,48,0.14)] blur-[120px]" />
        <div className="absolute right-[-6%] top-[18%] h-80 w-80 rounded-full bg-[rgba(255,149,0,0.12)] blur-[140px]" />
        <div className="absolute bottom-[-12%] left-[34%] h-80 w-80 rounded-full bg-[rgba(98,105,255,0.08)] blur-[140px]" />
      </div>
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
          className="premium-panel relative w-full max-w-[760px] overflow-hidden rounded-[38px] bg-[linear-gradient(145deg,rgba(31,31,48,0.97),rgba(15,15,24,0.99))] p-10 text-center shadow-[0_32px_90px_rgba(0,0,0,0.5)]"
        >
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[rgba(255,190,92,0.26)] bg-[linear-gradient(135deg,rgba(255,149,0,0.12),rgba(255,59,48,0.08))] px-4 py-2 text-xs uppercase tracking-[0.24em] text-[var(--color-text-secondary)]">
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-brand-accent)] shadow-[0_0_16px_rgba(255,149,0,0.7)]" />
            Booking confirmed
          </div>
          <h2 className="mt-6 font-display text-6xl leading-[0.96] text-[var(--color-text-primary)]">See you there</h2>
          <p className="mt-4 text-lg text-[var(--color-text-secondary)]">
            {event.title} · {formatLongDate(showtime.date)} · {showtime.time}
          </p>
          <div className="mt-4 flex justify-center">
            <div className="premium-chip rounded-full px-4 py-2 text-sm text-[var(--color-text-secondary)]">
              Seats {seatLabels(seats).join(', ')}
            </div>
          </div>
          <div className="mt-8 rounded-[30px] border border-[rgba(255,190,92,0.22)] bg-[linear-gradient(145deg,rgba(255,149,0,0.08),rgba(255,255,255,0.03)_55%,rgba(255,59,48,0.06))] px-6 py-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-muted)]">Booking ID</p>
            <p className="mt-3 font-display text-[2.7rem] tracking-[0.04em] text-[var(--color-brand-accent)]">{bookingId}</p>
            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
              Keep this reference handy for entry, support, and ticket verification.
            </p>
          </div>
          <div className="mt-8 flex justify-center gap-3">
            <Button
              onClick={() => window.print()}
              className="shadow-[0_18px_40px_rgba(255,59,48,0.28)] hover:shadow-[0_22px_48px_rgba(255,59,48,0.34)]"
            >
              Download Ticket
            </Button>
            <Button
              variant="secondary"
              className="border-[rgba(255,149,0,0.16)] bg-[rgba(255,255,255,0.02)] hover:border-[rgba(255,190,92,0.38)] hover:bg-[rgba(255,149,0,0.08)]"
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
