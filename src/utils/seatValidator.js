const sortSeatKey = (seat) => `${seat.row}-${String(seat.number).padStart(2, '0')}`;

export const areSeatsContiguous = (seats) => {
  if (seats.length <= 1) {
    return true;
  }

  const groupedByRow = seats.reduce((acc, seat) => {
    acc[seat.row] ??= [];
    acc[seat.row].push(seat.number);
    return acc;
  }, {});

  return Object.values(groupedByRow).every((numbers) => {
    const sorted = [...numbers].sort((left, right) => left - right);
    return sorted.every((number, index) => index === 0 || number - sorted[index - 1] === 1);
  });
};

export const seatLabels = (seats) => seats.map((seat) => `${seat.row}${seat.number}`).sort();

export const sortSeats = (seats) =>
  [...seats].sort((left, right) => sortSeatKey(left).localeCompare(sortSeatKey(right)));
