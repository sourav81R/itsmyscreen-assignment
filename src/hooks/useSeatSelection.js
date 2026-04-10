import { useCallback, useMemo, useState } from 'react';
import { getBestSeats } from '../services/aiService';
import { validateContiguous } from '../services/seatService';
import { useBookingStore } from '../store/useBookingStore';

export const useSeatSelection = (seats) => {
  const { selectedEvent, selectedSeats, selectedSeatCount, setSelectedSeats, toggleSeat } = useBookingStore();
  const [tooltip, setTooltip] = useState(null);

  const suggestionBudget = useMemo(
    () => Math.max((selectedEvent?.priceRange?.max ?? 4500) * selectedSeatCount, 4500),
    [selectedEvent?.priceRange?.max, selectedSeatCount],
  );

  const suggestions = useMemo(
    () => getBestSeats(seats, suggestionBudget, selectedSeatCount),
    [seats, selectedSeatCount, suggestionBudget],
  );

  const selectedSeatIds = useMemo(() => new Set(selectedSeats.map((seat) => seat.id)), [selectedSeats]);
  const suggestedIds = useMemo(
    () => new Set(suggestions.flatMap((group) => group.seats.map((seat) => seat.id))),
    [suggestions],
  );

  const applySuggestedSeats = useCallback(
    (group) => {
      setSelectedSeats(group.seats);
      setTooltip(null);
    },
    [setSelectedSeats],
  );

  const handleSeatAction = useCallback(
    (seat, position) => {
      if (seat.status === 'unavailable') {
        setTooltip({
          message: `Seat ${seat.row}${seat.number} is already taken`,
          x: position?.x ?? 0,
          y: position?.y ?? 0,
        });
        return { accepted: false, reason: 'unavailable', message: `Seat ${seat.row}${seat.number} is already taken` };
      }

      if (seat.status === 'wheelchair') {
        setTooltip({
          message: `Seat ${seat.row}${seat.number} is wheelchair accessible`,
          x: position?.x ?? 0,
          y: position?.y ?? 0,
        });
      }

      const isAlreadySelected = selectedSeatIds.has(seat.id);
      if (!isAlreadySelected && selectedSeats.length >= 10) {
        setTooltip({
          message: "You've reached the maximum of 10 seats.",
          x: position?.x ?? 0,
          y: position?.y ?? 0,
        });
        return { accepted: false, reason: 'limit', message: "You've reached the maximum of 10 seats." };
      }

      const nextSelection = isAlreadySelected
        ? selectedSeats.filter((item) => item.id !== seat.id)
        : [...selectedSeats, seat];

      if (!isAlreadySelected && nextSelection.length > selectedSeatCount) {
        setTooltip({
          message: `Choose ${selectedSeatCount} seats or increase the seat count.`,
          x: position?.x ?? 0,
          y: position?.y ?? 0,
        });
        return { accepted: false, reason: 'count', message: `Choose ${selectedSeatCount} seats or increase the seat count.` };
      }

      toggleSeat(seat);
      setTooltip(null);
      return { accepted: true, contiguous: validateContiguous(nextSelection) };
    },
    [selectedSeatCount, selectedSeatIds, selectedSeats, toggleSeat],
  );

  return {
    suggestions,
    selectedSeatIds,
    suggestedIds,
    tooltip,
    setTooltip,
    handleSeatAction,
    applySuggestedSeats,
    isContiguous: validateContiguous(selectedSeats),
  };
};
