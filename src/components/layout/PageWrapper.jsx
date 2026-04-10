import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

/**
 * Shared page transition shell for route-level screens.
 * Props: children, className.
 */
function PageWrapper({ children, className }) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.main>
  );
}

PageWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

PageWrapper.defaultProps = {
  className: '',
};

export default PageWrapper;
