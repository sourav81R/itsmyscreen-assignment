import { useMemo } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';

/**
 * Lightweight portal tooltip for hover or click hints.
 * Props: content, open, anchorRect, placement.
 */
function Tooltip({ content, open, anchorRect, placement }) {
  const style = useMemo(() => {
    if (!anchorRect) {
      return {};
    }

    const top = placement === 'top' ? anchorRect.top - 10 : anchorRect.bottom + 10;
    const left = anchorRect.left + anchorRect.width / 2;
    return {
      position: 'fixed',
      top,
      left,
      transform: placement === 'top' ? 'translate(-50%, -100%)' : 'translate(-50%, 0)',
      zIndex: 60,
    };
  }, [anchorRect, placement]);

  if (typeof document === 'undefined' || !open || !anchorRect) {
    return null;
  }

  return createPortal(
    <div
      style={style}
      className="pointer-events-none rounded-2xl border border-[var(--color-border-strong)] bg-[rgba(20,20,32,0.96)] px-3 py-2 text-xs text-[var(--color-text-primary)] shadow-elevated"
    >
      {content}
    </div>,
    document.body,
  );
}

Tooltip.propTypes = {
  content: PropTypes.node.isRequired,
  open: PropTypes.bool,
  anchorRect: PropTypes.shape({
    top: PropTypes.number,
    left: PropTypes.number,
    bottom: PropTypes.number,
    width: PropTypes.number,
  }),
  placement: PropTypes.oneOf(['top', 'bottom']),
};

Tooltip.defaultProps = {
  open: false,
  anchorRect: null,
  placement: 'top',
};

export default Tooltip;
