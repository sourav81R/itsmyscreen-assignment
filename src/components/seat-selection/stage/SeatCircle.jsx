import { memo } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { formatPrice } from '../../../utils/priceFormatter';

const fillMap = {
  vip: 'url(#seat-vip)',
  premium: 'url(#seat-premium)',
  general: 'url(#seat-general)',
  selected: 'url(#seat-selected)',
};

const strokeMap = {
  vip: '#FFD60A',
  premium: '#30D158',
  general: '#0A84FF',
  selected: '#FF3B30',
  unavailable: '#1E1E2A',
};

const SeatCircle = memo(function SeatCircle({
  seat,
  position,
  isSelected,
  isAISuggested,
  isHovered,
  isFocused,
  dimmed,
  registerRef,
  onClick,
  onHoverStart,
  onHoverEnd,
  onKeyDown,
}) {
  const isUnavailable = seat.status === 'unavailable';
  const mainFill = isSelected ? fillMap.selected : fillMap[seat.tier];
  const seatOpacity = dimmed ? 0.24 : isUnavailable ? 0.36 : 1;

  return (
    <motion.g
      ref={registerRef}
      initial={false}
      animate={
        isSelected
          ? { x: position.x, y: position.y, scale: [1, 1.34, 1.06] }
          : { x: position.x, y: position.y, scale: isHovered && !isUnavailable ? 1.16 : 1 }
      }
      transition={{ duration: isSelected ? 0.26 : 0.18, ease: 'easeOut' }}
      className={isUnavailable ? 'cursor-not-allowed' : 'cursor-pointer'}
      role="button"
      aria-label={`Seat ${seat.row}${seat.number}, ${seat.tier} tier, ${formatPrice(seat.price)}, ${seat.status}`}
      aria-selected={isSelected}
      tabIndex={isUnavailable ? -1 : 0}
      onClick={() => !isUnavailable && onClick(seat)}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      onPointerDown={onHoverStart}
      onFocus={onHoverStart}
      onBlur={onHoverEnd}
      onKeyDown={onKeyDown}
      style={{ opacity: seatOpacity }}
    >
      {isAISuggested && !isSelected ? (
        <>
          <circle r={seat.seatRadius + 4} fill="none" stroke="#FF9500" strokeWidth="1.4" className="ai-pulse-ring" />
          <circle
            r={seat.seatRadius + 2.4}
            fill="none"
            stroke="rgba(255,176,32,0.7)"
            strokeWidth="1"
            className="ai-pulse-ring ai-pulse-ring-delayed"
          />
        </>
      ) : null}

      {isFocused ? (
        <circle r={seat.seatRadius + 5} fill="none" stroke="white" strokeWidth="1.8" strokeDasharray="3 2" opacity="0.96" />
      ) : null}

      {isSelected ? (
        <circle r={seat.seatRadius + 3.2} fill="none" stroke="#FF3B30" strokeWidth="1.6" opacity="0.82" />
      ) : null}

      {isHovered && !isUnavailable ? (
        <circle r={seat.seatRadius + 4.4} fill={strokeMap[seat.tier]} opacity="0.16" filter="url(#seat-hover-glow)" />
      ) : null}

      <circle
        r={seat.seatRadius}
        fill={isUnavailable ? '#1E1E2A' : mainFill}
        stroke={isUnavailable ? strokeMap.unavailable : isSelected ? strokeMap.selected : strokeMap[seat.tier]}
        strokeWidth={isSelected ? 1.4 : isUnavailable ? 0.7 : 0.95}
      />

      {isUnavailable ? <circle r={seat.seatRadius} fill="url(#seat-unavailable-hatch)" opacity="0.7" /> : null}

      {seat.status === 'wheelchair' ? (
        <text textAnchor="middle" dominantBaseline="central" fontSize={seat.seatRadius * 1.05} fill="#FFFFFF" pointerEvents="none">
          W
        </text>
      ) : null}

      {isSelected ? (
        <text
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={seat.seatRadius * 1.08}
          fill="#FFFFFF"
          fontWeight="700"
          pointerEvents="none"
          y="0.5"
        >
          ✓
        </text>
      ) : null}
    </motion.g>
  );
});

SeatCircle.propTypes = {
  seat: PropTypes.shape({
    id: PropTypes.string.isRequired,
    row: PropTypes.string.isRequired,
    number: PropTypes.number.isRequired,
    tier: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    seatRadius: PropTypes.number.isRequired,
  }).isRequired,
  position: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }).isRequired,
  isSelected: PropTypes.bool.isRequired,
  isAISuggested: PropTypes.bool.isRequired,
  isHovered: PropTypes.bool.isRequired,
  isFocused: PropTypes.bool.isRequired,
  dimmed: PropTypes.bool.isRequired,
  registerRef: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  onHoverStart: PropTypes.func.isRequired,
  onHoverEnd: PropTypes.func.isRequired,
  onKeyDown: PropTypes.func.isRequired,
};

export default SeatCircle;
