import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AIInsightChip from '../components/event-detail/AIInsightChip';
import EventHero from '../components/event-detail/EventHero';
import EventInfo from '../components/event-detail/EventInfo';
import PricingTiers from '../components/event-detail/PricingTiers';
import PageWrapper from '../components/layout/PageWrapper';
import Button from '../components/shared/Button';
import { useIsDesktop } from '../hooks/useMediaQuery';
import { getEventById } from '../services/eventService';
import { useBookingStore } from '../store/useBookingStore';

/**
 * Event detail screen with hero media, AI insight, venue info, and pricing.
 */
function EventDetailPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const isDesktop = useIsDesktop();
  const setEvent = useBookingStore((state) => state.setEvent);
  const setShowtime = useBookingStore((state) => state.setShowtime);
  const [event, setCurrentEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showStickyCta, setShowStickyCta] = useState(false);
  const heroCtaRef = useRef(null);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setCurrentEvent(getEventById(eventId));
      setLoading(false);
    }, 400);
    return () => window.clearTimeout(timeout);
  }, [eventId]);

  useEffect(() => {
    const target = heroCtaRef.current;

    if (!target || isDesktop) {
      return undefined;
    }

    const observer = new window.IntersectionObserver(
      ([entry]) => {
        setShowStickyCta(!entry.isIntersecting);
      },
      { threshold: 0.2 },
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [event, isDesktop, loading]);

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
      <PageWrapper className="mx-auto max-w-[1440px] px-4 pb-12 pt-4 md:px-6 md:pt-6 xl:px-8">
        <div className="h-[520px] rounded-[36px] bg-shimmer bg-[length:200%_100%] animate-shimmer" />
      </PageWrapper>
    );
  }

  if (!event) {
    return (
      <PageWrapper className="mx-auto max-w-[1440px] px-4 pb-12 pt-4 md:px-6 md:pt-6 xl:px-8">
        <div className="editorial-panel rounded-[32px] p-10 text-center">
          <p className="font-display text-4xl">Event not found</p>
        </div>
      </PageWrapper>
    );
  }

  return (
    <>
      <PageWrapper className="relative mx-auto max-w-[1440px] px-4 pb-24 pt-4 md:px-6 md:pb-14 md:pt-6 xl:px-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[760px] overflow-hidden">
        <div className="absolute -left-12 top-28 h-44 w-44 rounded-full bg-[rgba(255,149,0,0.12)] blur-3xl" />
        <div className="absolute right-8 top-16 h-52 w-52 rounded-full bg-[rgba(0,195,255,0.12)] blur-3xl" />
        <div className="absolute left-1/3 top-[400px] h-40 w-40 rounded-full bg-[rgba(255,59,48,0.12)] blur-3xl" />
      </div>

      <div className="relative z-10 space-y-6">
        <EventHero event={event} onSelectSeats={handleSelectSeats} ctaRef={heroCtaRef} />
        <div className="-mt-8 px-4">
          <AIInsightChip event={event} onSelectSeats={handleSelectSeats} />
        </div>
        <EventInfo event={event} />
        <PricingTiers event={event} onSelectSeats={handleSelectSeats} />
      </div>
      </PageWrapper>

      {showStickyCta ? (
        <div className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[rgba(17,17,24,0.96)] px-4 pt-3 pb-3 backdrop-blur-xl lg:hidden">
          <Button
            onClick={handleSelectSeats}
            className="w-full bg-[linear-gradient(135deg,#ff5a3d,#ff3b30_55%,#ff7b33)] shadow-[0_16px_38px_rgba(255,59,48,0.28)] hover:shadow-[0_20px_44px_rgba(255,59,48,0.34)]"
          >
            Select Seats
          </Button>
        </div>
      ) : null}
    </>
  );
}

export default EventDetailPage;
