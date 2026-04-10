import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { AlertTriangle } from 'lucide-react';

/**
 * Temporary top-right toast for submission or validation errors.
 * Props: message, onClose.
 */
function Toast({ message, onClose }) {
  useEffect(() => {
    const timeout = window.setTimeout(onClose, 4000);
    return () => window.clearTimeout(timeout);
  }, [message, onClose]);

  return (
    <div className="fixed right-6 top-24 z-50 flex items-center gap-3 rounded-2xl border border-[rgba(255,69,58,0.35)] bg-[rgba(34,14,14,0.94)] px-4 py-3 text-sm text-[var(--color-text-primary)] shadow-elevated">
      <AlertTriangle className="h-4 w-4 text-[var(--color-danger)]" aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}

Toast.propTypes = {
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Toast;
