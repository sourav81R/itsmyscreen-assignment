import PropTypes from 'prop-types';
import Badge from './Badge';

const labels = {
  available: 'Available',
  'fast-filling': 'Fast Filling',
  'almost-full': 'Almost Full',
  'sold-out': 'Sold Out',
};

/**
 * Availability-aware badge wrapper with accessible status role.
 * Props: availability, className.
 */
function AvailabilityBadge({ availability, className }) {
  return <Badge label={labels[availability] ?? 'Available'} variant={availability} role="status" className={className} />;
}

AvailabilityBadge.propTypes = {
  availability: PropTypes.oneOf(['available', 'fast-filling', 'almost-full', 'sold-out']).isRequired,
  className: PropTypes.string,
};

AvailabilityBadge.defaultProps = {
  className: '',
};

export default AvailabilityBadge;
