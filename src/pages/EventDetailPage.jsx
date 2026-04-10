import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AIInsightChip from '../components/event-detail/AIInsightChip';
import EventHero from '../components/event-detail/EventHero';
import EventInfo from '../components/event-detail/EventInfo';
import PricingTiers from '../components/event-detail/PricingTiers';
import PageWrapper from '../components/layout/PageWrapper';
import { getEventById } from '../services/eventService';
import { useBookingStore } from '../store/useBookingStore';

/**
 * Event detail screen with hero media, AI insight, venue info, and pricing.
 */
function EventDetailPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const setEvent = useBookingStore((state) => state.setEvent);
  const setShowtime = useBookingStore((state) => state.setShowtime);
  const [event, setCurrentEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setCurrentEvent(getEventById(eventId));
      setLoading(false);
    }, 400);
    return () => window.clearTimeout(timeout);
  }, [eventId]);

  const handleSelectSeats = () => {
    if (!event) {
      return;
    }

    setEvent(event);
    setShowtime(event.showtimes[0] ?? null);
    navigate(`/event/${event.id}/seats`);
  };

  if (loading) {
    return (
      <PageWrapper className="mx-auto max-w-[1440px] px-8 pb-12 pt-8">
        <div className="h-[520px] rounded-[36px] bg-shimmer bg-[length:200%_100%] animate-shimmer" />
      </PageWrapper>
    );
  }

  if (!event) {
    return (
      <PageWrapper className="mx-auto max-w-[1440px] px-8 pb-12 pt-8">
        <div className="editorial-panel rounded-[32px] p-10 text-center">
          <p className="font-display text-4xl">Event not found</p>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper className="mx-auto max-w-[1440px] space-y-8 px-8 pb-12 pt-8">
      <EventHero event={event} onSelectSeats={handleSelectSeats} />
      <AIInsightChip event={event} onSelectSeats={handleSelectSeats} />
      <EventInfo event={event} />
      <PricingTiers event={event} />
    </PageWrapper>
  );
}

export default EventDetailPage;
