import { useCallback, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { formatPrice } from '../../../utils/priceFormatter';
import StageElement from './StageElement';
import TierBoundary from './TierBoundary';
import SeatGroup from './SeatGroup';

function StageCanvas({
  seatRows,
  selectedSeats,
  selectedSeatIds,
  aiSuggestedIds,
  previewSeatIds,
  activeTierFilter,
  soldOut,
  viewMode,
  mapTransform,
  onSeatAction,
  onApplyAISuggestions,
  showTooltip,
  hideTooltip,
  announce,
}) {
  const [hoveredSeatId, setHoveredSeatId] = useState(null);
  const [focusedSeatId, setFocusedSeatId] = useState(null);
  const seatRefs = useRef({});

  const flatRows = useMemo(
    () =>
      seatRows.map((row) => ({
        rowLabel: row.rowLabel,
        seats: row.seats,
      })),
    [seatRows],
  );

  const focusSeat = useCallback((seatId) => {
    seatRefs.current[seatId]?.focus();
  }, []);

  const handleSeatClick = useCallback(
    (seat, payload) => {
      const wasSelected = selectedSeatIds.has(seat.id);
      const result = onSeatAction(seat, payload);

      if (result.accepted) {
        const nextCount = wasSelected ? selectedSeats.length - 1 : selectedSeats.length + 1;
        const currentTotal = selectedSeats.reduce((sum, item) => sum + item.price, 0);
        const nextTotal = wasSelected ? currentTotal - seat.price : currentTotal + seat.price;
        announce(
          wasSelected
            ? `Seat ${seat.row}${seat.number} deselected. ${nextCount} seats remaining.`
            : `Seat ${seat.row}${seat.number}, ${seat.tier}, ${formatPrice(seat.price)} selected. ${nextCount} seats total, ${formatPrice(nextTotal)}.`,
        );
      } else if (result.message) {
        announce(result.message);
      }
    },
    [announce, onSeatAction, selectedSeatIds, selectedSeats],
  );

  const handleDirectionalFocus = useCallback(
    (seat, key) => {
      const rowIndex = flatRows.findIndex((row) => row.rowLabel === seat.row);
      const currentRow = flatRows[rowIndex];
      const currentSeatIndex = currentRow.seats.findIndex((item) => item.id === seat.id);

      if (key === 'ArrowLeft') {
        focusSeat(currentRow.seats[Math.max(0, currentSeatIndex - 1)].id);
      }

      if (key === 'ArrowRight') {
        focusSeat(currentRow.seats[Math.min(currentRow.seats.length - 1, currentSeatIndex + 1)].id);
      }

      if (key === 'ArrowUp' && rowIndex > 0) {
        const previousRow = flatRows[rowIndex - 1];
        focusSeat(previousRow.seats[Math.min(previousRow.seats.length - 1, currentSeatIndex)].id);
      }

      if (key === 'ArrowDown' && rowIndex < flatRows.length - 1) {
        const nextRow = flatRows[rowIndex + 1];
        focusSeat(nextRow.seats[Math.min(nextRow.seats.length - 1, currentSeatIndex)].id);
      }
    },
    [flatRows, focusSeat],
  );

  const handleKeyDown = useCallback(
    (seat) => (event) => {
      if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault();
        handleSeatClick(seat);
      }

      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
        event.preventDefault();
        handleDirectionalFocus(seat, event.key);
      }
    },
    [handleDirectionalFocus, handleSeatClick],
  );

  const handleMapKeyDown = useCallback(
    (event) => {
      if (event.ctrlKey && event.key.toLowerCase() === 'a') {
        event.preventDefault();
        onApplyAISuggestions();
      }

      if (event.key === '+' || event.key === '=') {
        event.preventDefault();
        mapTransform.zoomIn();
      }

      if (event.key === '-') {
        event.preventDefault();
        mapTransform.zoomOut();
      }

      if (event.key === '0') {
        event.preventDefault();
        mapTransform.reset();
      }

      if (event.key === 'ArrowLeft' && event.altKey) {
        event.preventDefault();
        mapTransform.panBy(26, 0);
      }

      if (event.key === 'ArrowRight' && event.altKey) {
        event.preventDefault();
        mapTransform.panBy(-26, 0);
      }

      if (event.key === 'ArrowUp' && event.altKey) {
        event.preventDefault();
        mapTransform.panBy(0, 26);
      }

      if (event.key === 'ArrowDown' && event.altKey) {
        event.preventDefault();
        mapTransform.panBy(0, -26);
      }
    },
    [mapTransform, onApplyAISuggestions],
  );

  return (
    <div className="stage-canvas-shell editorial-panel premium-panel">
      {soldOut ? (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-[rgba(10,10,15,0.82)] backdrop-blur-sm">
          <div className="rounded-[28px] border border-[rgba(255,69,58,0.3)] bg-[rgba(34,14,14,0.84)] px-8 py-6 text-center">
            <p className="font-display text-4xl text-[var(--color-text-primary)]">This showtime is sold out</p>
            <p className="mt-3 text-[var(--color-text-secondary)]">Pick another time to reveal seats again.</p>
          </div>
        </div>
      ) : null}

      <div className="stage-map-helper">
        Drag to pan - scroll or pinch to zoom - Ctrl+A for AI picks
      </div>

      <div className="stage-map-inner" onKeyDown={handleMapKeyDown} tabIndex={0} {...mapTransform.bind}>
        <svg
          viewBox="0 0 1000 800"
          width="100%"
          height="auto"
          preserveAspectRatio="xMidYMid meet"
          style={{ touchAction: 'none', display: 'block' }}
          role="application"
          aria-label="Interactive seating map. Use arrow keys to move between seats and Space to select."
          className="h-full w-full"
        >
          <defs>
            <linearGradient id="stage-surface" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FF9500" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#CC6600" stopOpacity="0.72" />
            </linearGradient>
            <radialGradient id="stage-glow" cx="50%" cy="20%" r="70%" fx="50%" fy="20%">
              <stop offset="0%" stopColor="#FF9500" stopOpacity="0.25" />
              <stop offset="40%" stopColor="#FF6B00" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#FF6B00" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="stage-atmosphere" cx="50%" cy="36%" r="60%">
              <stop offset="0%" stopColor="rgba(255,149,0,0.18)" />
              <stop offset="100%" stopColor="rgba(255,149,0,0)" />
            </radialGradient>
            <radialGradient id="seat-vip" cx="35%" cy="35%" r="60%">
              <stop offset="0%" stopColor="#FFE566" />
              <stop offset="100%" stopColor="#C9960A" />
            </radialGradient>
            <radialGradient id="seat-premium" cx="35%" cy="35%" r="60%">
              <stop offset="0%" stopColor="#5AE07A" />
              <stop offset="100%" stopColor="#1A7A35" />
            </radialGradient>
            <radialGradient id="seat-general" cx="35%" cy="35%" r="60%">
              <stop offset="0%" stopColor="#4AABFF" />
              <stop offset="100%" stopColor="#0055AA" />
            </radialGradient>
            <radialGradient id="seat-selected" cx="35%" cy="35%" r="60%">
              <stop offset="0%" stopColor="#FF6B60" />
              <stop offset="100%" stopColor="#CC2010" />
            </radialGradient>
            <pattern id="seat-unavailable-hatch" patternUnits="userSpaceOnUse" width="4" height="4">
              <path d="M0 4L4 0" stroke="#2C2C3E" strokeWidth="0.8" opacity="0.5" />
            </pattern>
            <linearGradient id="spotlight" x1="0.5" y1="1" x2="0.5" y2="0">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.06" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>
            <filter id="seat-hover-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <rect x="0" y="0" width="1000" height="800" fill="transparent" />
          <StageElement />
          <TierBoundary tier="vip" label="VIP" arcRadius={222} />
          <TierBoundary tier="premium" label="Premium" arcRadius={404} />
          <TierBoundary tier="general" label="General" arcRadius={642} />

          <g
            transform={`translate(${mapTransform.state.x} ${mapTransform.state.y}) scale(${mapTransform.state.scale})`}
            style={{ willChange: 'transform', transition: 'transform 180ms ease' }}
          >
            {seatRows.map((row) => (
              <SeatGroup
                key={row.id}
                row={row}
                viewMode={viewMode}
                selectedSeatIds={selectedSeatIds}
                aiSuggestedIds={aiSuggestedIds}
                previewSeatIds={previewSeatIds}
                activeTierFilter={activeTierFilter}
                hoveredSeatId={hoveredSeatId}
                focusedSeatId={focusedSeatId}
                registerRef={(seatId) => (node) => {
                  seatRefs.current[seatId] = node;
                }}
                onSeatClick={(seat) => handleSeatClick(seat)}
                onSeatHover={(seat) => (event) => {
                  setHoveredSeatId(seat.id);
                  setFocusedSeatId(seat.id);
                  showTooltip(seat, event);
                }}
                onSeatLeave={() => {
                  setHoveredSeatId(null);
                  setFocusedSeatId(null);
                  hideTooltip();
                }}
                onSeatKeyDown={handleKeyDown}
              />
            ))}
          </g>
        </svg>
      </div>
    </div>
  );
}

StageCanvas.propTypes = {
  seatRows: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.string.isRequired, seats: PropTypes.array.isRequired })).isRequired,
  selectedSeats: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.string.isRequired, price: PropTypes.number.isRequired })).isRequired,
  selectedSeatIds: PropTypes.instanceOf(Set).isRequired,
  aiSuggestedIds: PropTypes.instanceOf(Set).isRequired,
  previewSeatIds: PropTypes.instanceOf(Set).isRequired,
  activeTierFilter: PropTypes.oneOf(['vip', 'premium', 'general', null]),
  soldOut: PropTypes.bool.isRequired,
  viewMode: PropTypes.oneOf(['birdsEye', 'perspective']).isRequired,
  mapTransform: PropTypes.shape({
    state: PropTypes.shape({
      scale: PropTypes.number.isRequired,
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
    }).isRequired,
    zoomIn: PropTypes.func.isRequired,
    zoomOut: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
    panBy: PropTypes.func.isRequired,
    bind: PropTypes.object.isRequired,
  }).isRequired,
  onSeatAction: PropTypes.func.isRequired,
  onApplyAISuggestions: PropTypes.func.isRequired,
  showTooltip: PropTypes.func.isRequired,
  hideTooltip: PropTypes.func.isRequired,
  announce: PropTypes.func.isRequired,
};

StageCanvas.defaultProps = {
  activeTierFilter: null,
};

export default StageCanvas;
