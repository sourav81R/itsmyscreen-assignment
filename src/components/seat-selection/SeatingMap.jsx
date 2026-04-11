import { memo, useCallback, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import Tooltip from '../shared/Tooltip';
import { isSeatBooked } from '../../services/seatService';

const tierColors = {
  vip: 'var(--color-seat-vip)',
  premium: 'var(--color-seat-premium)',
  general: 'var(--color-seat-general)',
};

const SeatNode = memo(function SeatNode({
  seat,
  isSelected,
  isSuggested,
  registerRef,
  onHover,
  onLeave,
  onSelect,
  onKeyMove,
}) {
  const seatIsBooked = isSeatBooked(seat);
  const fill =
    seatIsBooked
      ? 'var(--color-seat-unavailable)'
      : isSelected
        ? 'var(--color-seat-selected)'
        : tierColors[seat.tier];

  return (
    <motion.g
      ref={registerRef}
      tabIndex={seatIsBooked ? -1 : 0}
      role="button"
      aria-label={`Row ${seat.row}, Seat ${seat.number}, ${seat.tier}, ${seat.status}`}
      aria-selected={isSelected}
      aria-disabled={seatIsBooked}
      focusable="true"
      onFocus={onHover}
      onBlur={onLeave}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onMouseDown={(event) => event.stopPropagation()}
      onClick={(event) => {
        event.stopPropagation();
        onSelect(event);
      }}
      onDoubleClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
      }}
      onKeyDown={onKeyMove}
      animate={isSelected ? { scale: [0.8, 1.08, 1] } : { scale: 1 }}
      transition={{ duration: 0.28 }}
      transform={`translate(${seat.x} ${seat.y})`}
      className={`${seatIsBooked ? 'cursor-not-allowed' : 'cursor-pointer'} outline-none`}
    >
      {isSuggested && !isSelected ? (
        <circle cx="0" cy="0" r="10" fill="none" stroke="var(--color-seat-suggested)" strokeWidth="1.5" className="animate-pulse-ring" />
      ) : null}
      <circle
        cx="0"
        cy="0"
        r="6.4"
        fill={fill}
        stroke={seatIsBooked ? 'rgba(238,242,255,0.9)' : seat.status === 'wheelchair' ? 'white' : 'rgba(255,255,255,0.08)'}
        strokeWidth={seatIsBooked ? '1.2' : seat.status === 'wheelchair' ? '2' : '1'}
      />
      {seatIsBooked ? (
        <path
          d="M-2.6 -2.6 L2.6 2.6 M-2.6 2.6 L2.6 -2.6"
          stroke="#0F172A"
          strokeWidth="1.15"
          strokeLinecap="round"
          pointerEvents="none"
        />
      ) : null}
      {seat.status === 'wheelchair' ? (
        <text x="0" y="1.5" fill="var(--color-bg-base)" fontSize="6" textAnchor="middle">
          W
        </text>
      ) : null}
    </motion.g>
  );
});

SeatNode.propTypes = {
  seat: PropTypes.shape({
    id: PropTypes.string.isRequired,
    row: PropTypes.string.isRequired,
    number: PropTypes.number.isRequired,
    tier: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }).isRequired,
  isSelected: PropTypes.bool.isRequired,
  isSuggested: PropTypes.bool.isRequired,
  registerRef: PropTypes.func.isRequired,
  onHover: PropTypes.func.isRequired,
  onLeave: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  onKeyMove: PropTypes.func.isRequired,
};

/**
 * Interactive seating SVG with hover tooltips, keyboard navigation, and zoom/pan.
 * Props: seats, selectedSeatIds, suggestedIds, onSeatAction, soldOut.
 */
function SeatingMap({ seats, selectedSeatIds, suggestedIds, onSeatAction, soldOut }) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [tooltip, setTooltip] = useState({ open: false, anchorRect: null, content: '' });
  const refs = useRef({});

  const sortedSeats = useMemo(
    () =>
      [...seats].sort((left, right) => {
        if (left.row === right.row) {
          return left.number - right.number;
        }
        return left.row.localeCompare(right.row);
      }),
    [seats],
  );

  const rowIndexMap = useMemo(() => {
    const groups = sortedSeats.reduce((acc, seat) => {
      acc[seat.row] ??= [];
      acc[seat.row].push(seat);
      return acc;
    }, {});
    return groups;
  }, [sortedSeats]);

  const rowOrder = useMemo(() => Object.keys(rowIndexMap), [rowIndexMap]);

  const focusSeat = useCallback((seatId) => {
    refs.current[seatId]?.focus();
  }, []);

  const handleWheel = useCallback((event) => {
    event.preventDefault();
    setZoom((current) => Math.min(2.2, Math.max(0.7, current + (event.deltaY < 0 ? 0.08 : -0.08))));
  }, []);

  const beginDrag = useCallback((event) => {
    setDragging(true);
    setDragStart({ x: event.clientX - pan.x, y: event.clientY - pan.y });
  }, [pan.x, pan.y]);

  const handleMove = useCallback(
    (event) => {
      if (!dragging) {
        return;
      }

      setPan({ x: event.clientX - dragStart.x, y: event.clientY - dragStart.y });
    },
    [dragStart.x, dragStart.y, dragging],
  );

  const endDrag = useCallback(() => setDragging(false), []);

  const handleHover = useCallback((seat, target) => {
    setTooltip({
      open: true,
      anchorRect: target.getBoundingClientRect(),
      content: `Row ${seat.row}, Seat ${seat.number} — ₹${seat.price.toLocaleString('en-IN')} — ${seat.tier}`,
    });
  }, []);

  const handleSelect = useCallback(
    (seat, target) => {
      const result = onSeatAction(seat);
      if (!result.accepted) {
        setTooltip({
          open: true,
          anchorRect: target.getBoundingClientRect(),
          content: result.message,
        });
        window.setTimeout(() => {
          setTooltip((current) => ({ ...current, open: false }));
        }, 1400);
      }
    },
    [onSeatAction],
  );

  const handleDirectionalFocus = useCallback(
    (seat, key) => {
      const currentRowSeats = rowIndexMap[seat.row];
      const currentIndex = currentRowSeats.findIndex((item) => item.id === seat.id);
      const rowPosition = rowOrder.indexOf(seat.row);

      if (key === 'ArrowLeft') {
        focusSeat(currentRowSeats[Math.max(0, currentIndex - 1)].id);
      }

      if (key === 'ArrowRight') {
        focusSeat(currentRowSeats[Math.min(currentRowSeats.length - 1, currentIndex + 1)].id);
      }

      if (key === 'ArrowUp' && rowPosition > 0) {
        const previousRowSeats = rowIndexMap[rowOrder[rowPosition - 1]];
        focusSeat(previousRowSeats[Math.min(previousRowSeats.length - 1, currentIndex)].id);
      }

      if (key === 'ArrowDown' && rowPosition < rowOrder.length - 1) {
        const nextRowSeats = rowIndexMap[rowOrder[rowPosition + 1]];
        focusSeat(nextRowSeats[Math.min(nextRowSeats.length - 1, currentIndex)].id);
      }
    },
    [focusSeat, rowIndexMap, rowOrder],
  );

  return (
    <div
      className="editorial-panel premium-panel relative min-h-[760px] overflow-hidden rounded-[32px] bg-[linear-gradient(180deg,rgba(31,31,47,0.98),rgba(19,19,31,0.98))]"
      onWheel={handleWheel}
      onMouseMove={handleMove}
      onMouseUp={endDrag}
      onMouseLeave={endDrag}
    >
      {soldOut ? (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-[rgba(10,10,15,0.82)] backdrop-blur-sm">
          <div className="rounded-[28px] border border-[rgba(255,69,58,0.3)] bg-[rgba(34,14,14,0.84)] px-8 py-6 text-center">
            <p className="font-display text-4xl text-[var(--color-text-primary)]">This showtime is sold out</p>
            <p className="mt-3 text-[var(--color-text-secondary)]">Pick another time to reveal seats again.</p>
          </div>
        </div>
      ) : null}

      <div className="absolute left-6 top-6 z-10 inline-flex rounded-full border border-[var(--color-border-subtle)] bg-[rgba(10,10,15,0.78)] px-4 py-2 text-xs uppercase tracking-[0.18em] text-[var(--color-text-secondary)]">
        Scroll to zoom · drag to pan
      </div>

      <svg
        viewBox="0 0 1000 780"
        className={`h-full min-h-[760px] w-full ${dragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onMouseDown={beginDrag}
      >
        <defs>
          <linearGradient id="stageGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,149,0,0.9)" />
            <stop offset="100%" stopColor="rgba(255,59,48,0.9)" />
          </linearGradient>
          <linearGradient id="stageTopGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,214,138,0.9)" />
            <stop offset="50%" stopColor="rgba(255,248,232,0.92)" />
            <stop offset="100%" stopColor="rgba(255,193,118,0.88)" />
          </linearGradient>
          <linearGradient id="stageLipGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.22)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
          <radialGradient id="stageGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255,149,0,0.28)" />
            <stop offset="100%" stopColor="rgba(255,149,0,0)" />
          </radialGradient>
          <radialGradient id="spotlightGlow" cx="50%" cy="0%" r="80%">
            <stop offset="0%" stopColor="rgba(255,225,168,0.22)" />
            <stop offset="100%" stopColor="rgba(255,225,168,0)" />
          </radialGradient>
          <linearGradient id="guideGradient" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,208,120,0.28)" />
            <stop offset="100%" stopColor="rgba(255,208,120,0)" />
          </linearGradient>
        </defs>

        <g transform={`translate(${pan.x} ${pan.y}) scale(${zoom})`}>
          <ellipse cx="500" cy="118" rx="250" ry="78" fill="url(#stageGlow)" />
          <ellipse cx="500" cy="100" rx="180" ry="56" fill="url(#spotlightGlow)" />
          <path
            d="M500 118 L500 186"
            stroke="url(#guideGradient)"
            strokeWidth="2"
            strokeDasharray="5 9"
            strokeLinecap="round"
            opacity="0.75"
          />
          <g>
            <path
              d="M286 92C286 75.431 299.431 62 316 62H684C700.569 62 714 75.431 714 92C714 108.569 700.569 122 684 122H316C299.431 122 286 108.569 286 92Z"
              fill="rgba(11,11,18,0.36)"
            />
            <path
              d="M304 84C304 69.641 315.641 58 330 58H670C684.359 58 696 69.641 696 84C696 98.359 684.359 110 670 110H330C315.641 110 304 98.359 304 84Z"
              fill="url(#stageGradient)"
            />
            <path
              d="M320 66H680"
              stroke="url(#stageTopGradient)"
              strokeWidth="3"
              strokeLinecap="round"
              opacity="0.9"
            />
            <path
              d="M318 78H682"
              stroke="url(#stageLipGradient)"
              strokeWidth="14"
              strokeLinecap="round"
              opacity="0.75"
            />
            <path
              d="M330 110C373 124 627 124 670 110"
              stroke="rgba(255,255,255,0.18)"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.75"
            />
            <circle cx="500" cy="44" r="4" fill="rgba(255,202,110,0.95)" />
            <path
              d="M398 51C432 39 466 33 500 33C534 33 568 39 602 51"
              fill="none"
              stroke="rgba(255,214,138,0.38)"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <text
              x="500"
              y="88"
              fill="white"
              textAnchor="middle"
              fontSize="20"
              fontWeight="600"
              letterSpacing="5"
            >
              STAGE
            </text>
            <text
              x="500"
              y="45"
              fill="rgba(255,214,138,0.86)"
              textAnchor="middle"
              fontSize="10"
              letterSpacing="3.2"
            >
              CENTER VIEW
            </text>
          </g>

          {sortedSeats.map((seat) => (
            <SeatNode
              key={seat.id}
              seat={seat}
              isSelected={selectedSeatIds.has(seat.id)}
              isSuggested={suggestedIds.has(seat.id)}
              registerRef={(node) => {
                refs.current[seat.id] = node;
              }}
              onHover={(event) => handleHover(seat, event.currentTarget)}
              onLeave={() => setTooltip((current) => ({ ...current, open: false }))}
              onSelect={(event) => handleSelect(seat, event.currentTarget)}
              onKeyMove={(event) => {
                if (event.key === ' ' || event.key === 'Enter') {
                  event.preventDefault();
                  handleSelect(seat, event.currentTarget);
                }

                if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
                  event.preventDefault();
                  handleDirectionalFocus(seat, event.key);
                }
              }}
            />
          ))}
        </g>
      </svg>

      <Tooltip open={tooltip.open} anchorRect={tooltip.anchorRect} content={tooltip.content} />
    </div>
  );
}

SeatingMap.propTypes = {
  seats: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      row: PropTypes.string.isRequired,
      number: PropTypes.number.isRequired,
      tier: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
      price: PropTypes.number.isRequired,
    }),
  ).isRequired,
  selectedSeatIds: PropTypes.instanceOf(Set).isRequired,
  suggestedIds: PropTypes.instanceOf(Set).isRequired,
  onSeatAction: PropTypes.func.isRequired,
  soldOut: PropTypes.bool,
};

SeatingMap.defaultProps = {
  soldOut: false,
};

export default SeatingMap;
