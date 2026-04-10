import PropTypes from 'prop-types';
import { Navigate, useLocation } from 'react-router-dom';

/**
 * Route guard that redirects incomplete booking states back to discovery.
 * Props: canAccess, redirectTo, children.
 */
function RouteGuard({ canAccess, redirectTo, children }) {
  const location = useLocation();

  if (!canAccess) {
    return <Navigate to={redirectTo} replace state={{ from: location.pathname }} />;
  }

  return children;
}

RouteGuard.propTypes = {
  canAccess: PropTypes.bool.isRequired,
  redirectTo: PropTypes.string,
  children: PropTypes.node.isRequired,
};

RouteGuard.defaultProps = {
  redirectTo: '/discover',
};

export default RouteGuard;
