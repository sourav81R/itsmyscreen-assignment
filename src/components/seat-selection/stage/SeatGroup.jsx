import { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import SeatCircle from './SeatCircle';

const SeatGroup = memo(function SeatGroup({
  row,
  isMobile,
  viewMode,
  selectedSeatIds,
  aiSuggestedIds,
  previewSeatIds,
  activeTierFilter,
  hoveredSeatId,
  focusedSeatId,
  registerRef,
  onSeatClick,
  onSeatHover,
  onSeatLeave,
  onSeatKeyDown,
}) {
  const rowPositions = useMemo(
    () =>
      row.seats.map((seat) => ({
        id: seat.id,
        x: viewMode === 'perspective' ? seat.perspX : seat.arcX,
        y: viewMode === 'perspective' ? seat.perspY : seat.arcY,
      })),
    [row.seats, viewMode],
  );

  const firstPosition = rowPositions[0];
  const lastPosition = rowPositions[rowPositions.length - 1];

  return (
    <g role="group" aria-label={`${row.tier} section row ${row.rowLabel}`}>
      <text
        x={firstPosition.x - 24}
        y={firstPosition.y + 4}
        fill="rgba(245,245,247,0.44)"
        fontSize="10"
        letterSpacing="2"
        textAnchor="middle"
      >
        {row.rowLabel}
      </text>
      <text
        x={lastPosition.x + 24}
        y={lastPosition.y + 4}
        fill="rgba(245,245,247,0.44)"
        fontSize="10"
        letterSpacing="2"
        textAnchor="middle"
      >
        {row.rowLabel}
      </text>

      {row.seats.map((seat, index) => {
        const hasPreview = previewSeatIds?.size > 0;
        const dimmed =
          (activeTierFilter && activeTierFilter !== seat.tier) ||
          (hasPreview && !previewSeatIds.has(seat.id));

        return (
          <SeatCircle
            key={seat.id}
            seat={seat}
            isMobile={isMobile}
            position={rowPositions[index]}
            isSelected={selectedSeatIds.has(seat.id)}
            isAISuggested={aiSuggestedIds.has(seat.id) || previewSeatIds.has(seat.id)}
            isHovered={hoveredSeatId === seat.id}
            isFocused={focusedSeatId === seat.id}
            dimmed={Boolean(dimmed)}
            registerRef={registerRef(seat.id)}
            onClick={onSeatClick}
            onHoverStart={onSeatHover(seat)}
            onHoverEnd={onSeatLeave}
            onKeyDown={onSeatKeyDown(seat)}
          />
        );
      })}
    </g>
  );
});

SeatGroup.propTypes = {
  row: PropTypes.shape({
    rowLabel: PropTypes.string.isRequired,
    tier: PropTypes.string.isRequired,
    seats: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        arcX: PropTypes.number.isRequired,
        arcY: PropTypes.number.isRequired,
        perspX: PropTypes.number.isRequired,
        perspY: PropTypes.number.isRequired,
      }),
    ).isRequired,
  }).isRequired,
  isMobile: PropTypes.bool,
  viewMode: PropTypes.oneOf(['birdsEye', 'perspective']).isRequired,
  selectedSeatIds: PropTypes.instanceOf(Set).isRequired,
  aiSuggestedIds: PropTypes.instanceOf(Set).isRequired,
  previewSeatIds: PropTypes.instanceOf(Set).isRequired,
  activeTierFilter: PropTypes.oneOf(['vip', 'premium', 'general', null]),
  hoveredSeatId: PropTypes.string,
  focusedSeatId: PropTypes.string,
  registerRef: PropTypes.func.isRequired,
  onSeatClick: PropTypes.func.isRequired,
  onSeatHover: PropTypes.func.isRequired,
  onSeatLeave: PropTypes.func.isRequired,
  onSeatKeyDown: PropTypes.func.isRequired,
};

SeatGroup.defaultProps = {
  activeTierFilter: null,
  hoveredSeatId: null,
  focusedSeatId: null,
  isMobile: false,
};

export default SeatGroup;
