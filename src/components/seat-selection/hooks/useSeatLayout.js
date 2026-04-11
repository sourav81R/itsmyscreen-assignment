import { useMemo } from 'react';

export const STAGE_CENTER = { x: 500, y: 115 };

const TIER_CONFIG = {
  vip: {
    rows: ['A', 'B', 'C'],
    startRadius: 170,
    rowSpacing: 42,
    angleSpreadDeg: [96, 106, 116],
    seatRadius: 8,
  },
  premium: {
    rows: ['D', 'E', 'F', 'G', 'H'],
    startRadius: 308,
    rowSpacing: 40,
    angleSpreadDeg: [124, 132, 140, 148, 154],
    seatRadius: 6.9,
  },
  general: {
    rows: ['I', 'J', 'K', 'L', 'M', 'N', 'O', 'P'],
    startRadius: 534,
    rowSpacing: 35,
    angleSpreadDeg: [154, 158, 162, 166, 170, 174, 176, 178],
    seatRadius: 5.7,
  },
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export const getViewQuality = (seat) => {
  if (!seat) {
    return 0;
  }

  const rowStars = { A: 5, B: 5, C: 4, D: 4, E: 4, F: 3, G: 3, H: 3, I: 2, J: 2, K: 2, L: 2 };
  return rowStars[seat.row] ?? 1;
};

export const getViewNote = (seat) => {
  const stars = getViewQuality(seat);

  if (seat?.status === 'unavailable') {
    return 'This seat is already taken';
  }

  if (stars >= 5) {
    return 'Close to stage';
  }

  if (stars >= 3) {
    return 'Excellent sightlines';
  }

  return 'Standard view';
};

const buildPerspectivePosition = (x, y) => {
  const offsetY = Math.max(0, y - STAGE_CENTER.y);
  const depth = clamp(offsetY / 700, 0, 1);
  const compressedY = STAGE_CENTER.y + offsetY * 0.76;
  const compressedX = STAGE_CENTER.x + (x - STAGE_CENTER.x) * (0.52 + depth * 0.58);

  return {
    x: Math.round(compressedX),
    y: Math.round(compressedY),
  };
};

export function useSeatLayout(venueSeats) {
  return useMemo(() => {
    const groupedByRow = venueSeats.reduce((acc, seat) => {
      acc[seat.row] ??= [];
      acc[seat.row].push(seat);
      return acc;
    }, {});

    Object.values(groupedByRow).forEach((rowSeats) => rowSeats.sort((left, right) => left.number - right.number));

    const rows = [];

    Object.entries(TIER_CONFIG).forEach(([tier, config]) => {
      config.rows.forEach((rowLabel, rowIndex) => {
        const rowSeats = groupedByRow[rowLabel] ?? [];
        const seatCount = rowSeats.length;

        if (seatCount === 0) {
          return;
        }

        const radius = config.startRadius + rowIndex * config.rowSpacing;
        const angleSpreadDeg = config.angleSpreadDeg[rowIndex] ?? config.angleSpreadDeg.at(-1);
        const angleSpread = (angleSpreadDeg * Math.PI) / 180;
        const startAngle = Math.PI / 2 - angleSpread / 2;
        const seatRadius = Math.max(4.8, config.seatRadius - rowIndex * 0.08);

        const seats = rowSeats.map((seat, index) => {
          const ratio = seatCount === 1 ? 0.5 : index / (seatCount - 1);
          const angle = startAngle + angleSpread * ratio;
          const arcX = Math.round(STAGE_CENTER.x + radius * Math.cos(angle));
          const arcY = Math.round(STAGE_CENTER.y + radius * Math.sin(angle));
          const perspective = buildPerspectivePosition(arcX, arcY);

          return {
            ...seat,
            tier,
            seatRadius,
            angle: ((angle * 180) / Math.PI) - 90,
            arcX,
            arcY,
            perspX: perspective.x,
            perspY: perspective.y,
          };
        });

        rows.push({
          id: `row-${rowLabel}`,
          tier,
          rowLabel,
          radius,
          seats,
        });
      });
    });

    return rows;
  }, [venueSeats]);
}
