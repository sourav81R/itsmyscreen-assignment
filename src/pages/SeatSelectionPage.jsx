import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AIBestSeats from '../components/seat-selection/AIBestSeats';
import PriceSummaryBar from '../components/seat-selection/PriceSummaryBar';
import SeatCountPicker from '../components/seat-selection/SeatCountPicker';
import SeatLegend from '../components/seat-selection/SeatLegend';
import SeatingMap from '../components/seat-selection/SeatingMap';
import ShowtimeSelector from '../components/seat-selection/ShowtimeSelector';
import PageWrapper from '../components/layout/PageWrapper';
import { useBookingTimer } from '../hooks/useBookingTimer';
import { useSeatSelection } from '../hooks/useSeatSelection';
import { getSeatsByVenue, holdSeats } from '../services/seatService';
import { useBookingStore } from '../store/useBookingStore';

/**
 * Seat and showtime selection screen with interactive SVG map and AI seat recommendations.
 */
function SeatSelectionPage() {
  const navigate = useNavigate();
  const selectedEvent = useBookingStore((state) => state.selectedEvent);
  const selectedShowtime = useBookingStore((state) => state.selectedShowtime);
  const selectedSeats = useBookingStore((state) => state.selectedSeats);
  const selectedSeatCount = useBookingStore((state) => state.selectedSeatCount);
  const seatHoldExpiry = useBookingStore((state) => state.seatHoldExpiry);
  const setSeatCount = useBookingStore((state) => state.setSeatCount);
  const [loading, setLoading] = useState(false);
  const seats = useMemo(() => getSeatsByVenue(selectedEvent?.venueId), [selectedEvent?.venueId]);

  const { suggestions, selectedSeatIds, suggestedIds, handleSeatAction, applySuggestedSeats, isContiguous } =
    useSeatSelection(seats);
  const timer = useBookingTimer(seatHoldExpiry);
  const total = useMemo(() => selectedSeats.reduce((sum, seat) => sum + seat.price, 0), [selectedSeats]);
  const soldOut = (selectedShowtime?.availableSeats ?? 0) <= 0;

  const handleProceed = async () => {
    setLoading(true);
    await holdSeats(selectedSeats.map((seat) => seat.id));
    setLoading(false);
    navigate('/booking/summary');
  };

  return (
    <PageWrapper className="relative mx-auto max-w-[1440px] px-8 pb-40 pt-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[680px] overflow-hidden">
        <div className="absolute left-8 top-10 h-44 w-44 rounded-full bg-[rgba(255,149,0,0.08)] blur-3xl" />
        <div className="absolute right-24 top-28 h-56 w-56 rounded-full bg-[rgba(255,59,48,0.08)] blur-3xl" />
        <div className="absolute left-1/2 top-[300px] h-60 w-60 -translate-x-1/2 rounded-full bg-[rgba(0,195,255,0.07)] blur-3xl" />
      </div>

      <div className="relative z-10 mb-7 flex items-end justify-between gap-6">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-[var(--color-text-muted)]">Step 2 of 3</p>
          <h1 className="mt-2 font-display text-[4rem] leading-none text-[var(--color-text-primary)]">Select Seats</h1>
          <p className="mt-3 text-[var(--color-text-secondary)]">
            {selectedEvent?.title} · {selectedEvent?.venue?.name}
          </p>
        </div>

        <div className="premium-chip hidden rounded-full px-4 py-2 text-sm text-[var(--color-text-secondary)] xl:block">
          Drag map, compare tiers, lock your view
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-[360px_minmax(0,1fr)] gap-8">
        <div className="space-y-5">
          <ShowtimeSelector showtimes={selectedEvent?.showtimes ?? []} />
          <SeatCountPicker value={selectedSeatCount} onChange={setSeatCount} />
          <AIBestSeats suggestions={suggestions} onApply={applySuggestedSeats} />
        </div>

        <div className="space-y-4">
          <SeatLegend />
          <SeatingMap
            seats={seats}
            selectedSeatIds={selectedSeatIds}
            suggestedIds={suggestedIds}
            onSeatAction={handleSeatAction}
            soldOut={soldOut}
          />
        </div>
      </div>

      <PriceSummaryBar
        seats={selectedSeats}
        total={total}
        timer={timer}
        onProceed={handleProceed}
        disabled={!isContiguous || soldOut}
        message={!isContiguous ? 'Selected seats should stay contiguous for a smoother group booking.' : ''}
        loading={loading}
      />
    </PageWrapper>
  );
}

export default SeatSelectionPage;
