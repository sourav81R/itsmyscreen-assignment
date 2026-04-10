import PropTypes from 'prop-types';
import { LoaderCircle } from 'lucide-react';

const variants = {
  primary:
    'bg-[var(--color-brand-primary)] text-white hover:-translate-y-0.5 hover:shadow-glow border-transparent',
  secondary:
    'border-[var(--color-border-strong)] bg-transparent text-[var(--color-text-primary)] hover:border-[var(--color-brand-primary)] hover:bg-[rgba(255,59,48,0.08)]',
  ghost:
    'border-transparent bg-[rgba(255,255,255,0.04)] text-[var(--color-text-secondary)] hover:bg-[rgba(255,255,255,0.08)] hover:text-[var(--color-text-primary)]',
};

const sizes = {
  sm: 'h-10 px-4 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-14 px-7 text-base',
};

/**
 * Reusable action button with brand variants, sizes, and loading state.
 * Props: children, variant, size, loading, type, disabled, onClick, className.
 */
function Button({ children, variant, size, loading, type, disabled, onClick, className, ...props }) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-full border font-medium transition duration-200 ${variants[variant]} ${sizes[size]} ${
        disabled || loading ? 'cursor-not-allowed opacity-50' : ''
      } ${className}`}
      {...props}
    >
      {loading ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
      {children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'ghost']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  loading: PropTypes.bool,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string,
};

Button.defaultProps = {
  variant: 'primary',
  size: 'md',
  loading: false,
  type: 'button',
  disabled: false,
  onClick: undefined,
  className: '',
};

export default Button;
