import PropTypes from 'prop-types';

const variants = {
  available: 'bg-[rgba(48,209,88,0.16)] text-[var(--color-success)] border-[rgba(48,209,88,0.3)]',
  'fast-filling': 'bg-[rgba(255,149,0,0.16)] text-[var(--color-warning)] border-[rgba(255,149,0,0.3)]',
  'almost-full': 'bg-[rgba(255,69,58,0.18)] text-[#ff8a80] border-[rgba(255,69,58,0.36)]',
  'sold-out': 'bg-[rgba(255,255,255,0.08)] text-[var(--color-text-secondary)] border-[rgba(255,255,255,0.14)]',
  genre: 'bg-transparent text-[var(--color-text-secondary)] border-[var(--color-border-subtle)]',
  accent: 'bg-[rgba(255,149,0,0.12)] text-[var(--color-brand-accent)] border-[rgba(255,149,0,0.28)]',
};

/**
 * Compact badge used for availability states, genres, and AI labels.
 * Props: label, variant, className, role.
 */
function Badge({ label, variant, className, role }) {
  return (
    <span
      role={role}
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] ${variants[variant]} ${className}`}
    >
      {label}
    </span>
  );
}

Badge.propTypes = {
  label: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(['available', 'fast-filling', 'almost-full', 'sold-out', 'genre', 'accent']),
  className: PropTypes.string,
  role: PropTypes.string,
};

Badge.defaultProps = {
  variant: 'genre',
  className: '',
  role: undefined,
};

export default Badge;
