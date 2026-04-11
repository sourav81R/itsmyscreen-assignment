import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Button from '../shared/Button';
import { openTicketPrintWindow } from '../../services/ticketPrintService';
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
function ConfirmationModal({ open, bookingId, event, showtime, seats, attendeeInfo, addOns, onClose }) {
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
          className="group premium-panel relative w-full max-w-[600px] overflow-hidden rounded-[30px] border-[rgba(255,190,92,0.24)] bg-[linear-gradient(145deg,rgba(35,34,52,0.98),rgba(16,16,27,0.99)_58%,rgba(24,18,26,0.98))] p-6 text-center shadow-[0_32px_90px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,149,0,0.08)] transition-[border-color,box-shadow,transform,background] duration-300 hover:border-[rgba(255,190,92,0.42)] hover:shadow-[0_36px_100px_rgba(0,0,0,0.54),0_0_0_1px_rgba(255,190,92,0.18),0_0_36px_rgba(255,149,0,0.12)]"
        >
          <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="absolute inset-x-[10%] top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,190,92,0.6),transparent)]" />
            <div className="absolute right-[-8%] top-[-10%] h-44 w-44 rounded-full bg-[rgba(255,149,0,0.1)] blur-[90px]" />
            <div className="absolute bottom-[-14%] left-[-6%] h-40 w-40 rounded-full bg-[rgba(255,59,48,0.08)] blur-[80px]" />
          </div>

          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[rgba(255,190,92,0.3)] bg-[linear-gradient(135deg,rgba(255,149,0,0.16),rgba(255,59,48,0.09))] px-3.5 py-1.5 text-[11px] uppercase tracking-[0.22em] text-[rgba(244,238,228,0.96)] [text-shadow:0_1px_10px_rgba(0,0,0,0.28)]">
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-brand-accent)] shadow-[0_0_16px_rgba(255,149,0,0.7)]" />
            Booking confirmed
          </div>
          <h2 className="premium-readable-title mt-4 font-display text-[3.2rem] leading-[0.98]">See you there</h2>
          <p className="premium-readable-body mt-3 text-[0.95rem]">
            {event.title} | {formatLongDate(showtime.date)} | {showtime.time}
          </p>

          <div className="mt-4 flex justify-center">
            <div className="premium-chip rounded-full border-[rgba(255,190,92,0.24)] bg-[linear-gradient(180deg,rgba(34,34,48,0.92),rgba(255,149,0,0.05))] px-4 py-1.5 text-xs text-[rgba(240,240,246,0.95)] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] [text-shadow:0_1px_8px_rgba(0,0,0,0.24)] transition-[border-color,box-shadow,background] duration-300 hover:border-[rgba(255,190,92,0.34)] hover:bg-[linear-gradient(180deg,rgba(38,38,54,0.95),rgba(255,149,0,0.08))] hover:shadow-[0_10px_28px_rgba(255,149,0,0.08),inset_0_1px_0_rgba(255,255,255,0.08)]">
              Seats {seatLabels(seats).join(', ')}
            </div>
          </div>

          <div className="group/id premium-panel relative mt-6 overflow-hidden rounded-[24px] border-[rgba(255,190,92,0.28)] bg-[linear-gradient(145deg,rgba(44,34,28,0.92),rgba(28,27,40,0.96)_52%,rgba(38,20,22,0.92))] px-5 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_16px_36px_rgba(0,0,0,0.18)] transition-[border-color,box-shadow,background,transform] duration-300 hover:border-[rgba(255,190,92,0.44)] hover:bg-[linear-gradient(145deg,rgba(52,38,28,0.94),rgba(31,30,44,0.98)_52%,rgba(44,22,24,0.94))] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_20px_42px_rgba(0,0,0,0.22),0_0_24px_rgba(255,149,0,0.08)]">
            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/id:opacity-100">
              <div className="absolute inset-x-[12%] top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,190,92,0.65),transparent)]" />
              <div className="absolute left-[-8%] top-[18%] h-28 w-28 rounded-full bg-[rgba(255,149,0,0.08)] blur-[70px]" />
              <div className="absolute right-[-10%] bottom-[-18%] h-36 w-36 rounded-full bg-[rgba(255,59,48,0.08)] blur-[72px]" />
            </div>
            <p className="text-[11px] uppercase tracking-[0.16em] text-[rgba(226,219,208,0.78)] [text-shadow:0_1px_8px_rgba(0,0,0,0.22)]">Booking ID</p>
            <p className="premium-readable-title mt-2 font-display text-[1.85rem] tracking-[0.03em] !text-[var(--color-brand-accent)] transition-[text-shadow,color] duration-300 group-hover/id:!text-[#ffb13b] group-hover/id:[text-shadow:0_0_24px_rgba(255,149,0,0.28)]">
              {bookingId}
            </p>
            <p className="premium-readable-body mt-2 text-[12px]">
              Keep this reference handy for entry, support, and ticket verification.
            </p>
          </div>

          <div className="mt-6 flex justify-center gap-3">
            <Button
              onClick={() => {
                const opened = openTicketPrintWindow({
                  bookingId,
                  event,
                  showtime,
                  seats,
                  attendeeInfo,
                  addOns,
                });

                if (!opened) {
                  window.print();
                }
              }}
              className="shadow-[0_18px_40px_rgba(255,59,48,0.28)] hover:shadow-[0_22px_48px_rgba(255,59,48,0.34)]"
              size="sm"
            >
              Download Ticket
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="border-[rgba(255,149,0,0.16)] bg-[rgba(255,255,255,0.02)] hover:border-[rgba(255,190,92,0.38)] hover:bg-[rgba(255,149,0,0.08)]"
              onClick={() => {
                navigate('/discover', { replace: true });
                onClose();
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
    artist: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    genre: PropTypes.arrayOf(PropTypes.string).isRequired,
    bannerUrl: PropTypes.string,
    thumbnailUrl: PropTypes.string,
    tierPerks: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string)),
    venue: PropTypes.shape({
      name: PropTypes.string.isRequired,
      address: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  showtime: PropTypes.shape({
    date: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
  }).isRequired,
  attendeeInfo: PropTypes.shape({
    name: PropTypes.string,
  }),
  addOns: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string,
      label: PropTypes.string,
      price: PropTypes.number,
    }),
  ),
  seats: PropTypes.arrayOf(
    PropTypes.shape({
      row: PropTypes.string.isRequired,
      number: PropTypes.number.isRequired,
    }),
  ).isRequired,
  onClose: PropTypes.func.isRequired,
};

ConfirmationModal.defaultProps = {
  attendeeInfo: {
    name: '',
  },
  addOns: [],
};

export default ConfirmationModal;
