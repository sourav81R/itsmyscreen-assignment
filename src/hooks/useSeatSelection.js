import { useCallback, useMemo, useRef, useState } from 'react';
import { getBestSeats } from '../services/aiService';
import { isSeatBooked, validateContiguous } from '../services/seatService';
import { useBookingStore } from '../store/useBookingStore';

export const useSeatSelection = (seats) => {
  const { selectedEvent, selectedSeats, selectedSeatCount, setSelectedSeats, toggleSeat } = useBookingStore();
  const [tooltip, setTooltip] = useState(null);
  const lastSeatActionRef = useRef({ seatId: null, timestamp: 0 });

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
      const now = Date.now();
      const lastAction = lastSeatActionRef.current;

      if (lastAction.seatId === seat.id && now - lastAction.timestamp < 250) {
        return { accepted: false, reason: 'debounced' };
      }

      lastSeatActionRef.current = {
        seatId: seat.id,
        timestamp: now,
      };

      if (isSeatBooked(seat)) {
        setTooltip({
          message: `Seat ${seat.row}${seat.number} is already booked`,
          x: position?.x ?? 0,
          y: position?.y ?? 0,
        });
        return { accepted: false, reason: 'booked', message: `Seat ${seat.row}${seat.number} is already booked` };
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
