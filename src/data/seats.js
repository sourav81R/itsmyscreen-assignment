import { venues } from './venues';

const tierDefinitions = [
  { tier: 'vip', rows: ['A', 'B', 'C'], seatCount: 20, minPrice: 5000, maxPrice: 8000 },
  { tier: 'premium', rows: ['D', 'E', 'F', 'G', 'H'], seatCount: 30, minPrice: 2500, maxPrice: 4000 },
  { tier: 'general', rows: ['I', 'J', 'K', 'L', 'M', 'N', 'O', 'P'], seatCount: 40, minPrice: 800, maxPrice: 1500 },
];

const allRows = tierDefinitions.flatMap((definition) => definition.rows);

const deterministicStatus = (venueId, row, number) => {
  if ((row === 'O' || row === 'P') && (number === 1 || number === 2 || number === 39 || number === 40)) {
    return 'wheelchair';
  }

  const charCode = row.charCodeAt(0);
  const seed = (venueId.length * 13 + charCode * 7 + number * 11) % 100;
  return seed < 15 ? 'unavailable' : 'available';
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const interpolate = (min, max, step, totalSteps) => {
  if (totalSteps <= 1) {
    return max;
  }

  return Math.round(max - ((max - min) * step) / (totalSteps - 1));
};

const createSeatLayout = (venue) => {
  const seats = [];
  const totalRows = allRows.length;

  tierDefinitions.forEach((definition) => {
    definition.rows.forEach((row) => {
      const rowIndex = allRows.indexOf(row);
      const rowRadius = 145 + rowIndex * 24;
      const angleSpread = clamp(114 - rowIndex * 2.6, 68, 114);
      const tierRowIndex = definition.rows.indexOf(row);
      const seatPrice = interpolate(
        definition.minPrice,
        definition.maxPrice,
        tierRowIndex,
        definition.rows.length,
      );

      for (let seatNumber = 1; seatNumber <= definition.seatCount; seatNumber += 1) {
        const angle = (-angleSpread / 2) + ((seatNumber - 1) * angleSpread) / (definition.seatCount - 1);
        const radians = (angle * Math.PI) / 180;
        const x =
          venue.seatConfig.centerX +
          Math.cos(radians) * rowRadius * 1.35 * venue.seatConfig.horizontalScale;
        const y =
          venue.seatConfig.centerY +
          Math.sin(radians) * rowRadius * venue.seatConfig.verticalScale +
          120 +
          (rowIndex / totalRows) * 26;

        seats.push({
          id: `${venue.id}-${row}${seatNumber}`,
          venueId: venue.id,
          row,
          number: seatNumber,
          tier: definition.tier,
          price: seatPrice,
          status: deterministicStatus(venue.id, row, seatNumber),
          x: Number(x.toFixed(2)),
          y: Number(y.toFixed(2)),
        });
      }
    });
  });

  return seats;
};

export const seatLayouts = venues.reduce((acc, venue) => {
  acc[venue.id] = createSeatLayout(venue);
  return acc;
}, {});
