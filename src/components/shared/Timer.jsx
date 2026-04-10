import PropTypes from 'prop-types';
import { Clock3 } from 'lucide-react';

/**
 * Countdown timer label used in the seat hold bar.
 * Props: display, totalSeconds.
 */
function Timer({ display, totalSeconds }) {
  const isUrgent = totalSeconds <= 120;

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm ${
        isUrgent
          ? 'border-[rgba(255,69,58,0.4)] bg-[rgba(255,69,58,0.12)] text-[var(--color-danger)]'
          : 'border-[var(--color-border-subtle)] bg-[rgba(255,255,255,0.04)] text-[var(--color-text-primary)]'
      }`}
    >
      <Clock3 className="h-4 w-4" aria-hidden="true" />
      {display}
    </div>
  );
}

Timer.propTypes = {
  display: PropTypes.string.isRequired,
  totalSeconds: PropTypes.number.isRequired,
};

export default Timer;
