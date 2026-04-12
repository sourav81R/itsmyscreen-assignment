import { useMemo } from 'react';
import AIAddOnStrip from '../components/booking-summary/AIAddOnStrip';
import AttendeeForm from '../components/booking-summary/AttendeeForm';
import ConfirmationModal from '../components/booking-summary/ConfirmationModal';
import OrderSummaryCard from '../components/booking-summary/OrderSummaryCard';
import PaymentSelector from '../components/booking-summary/PaymentSelector';
import PriceBreakdown from '../components/booking-summary/PriceBreakdown';
import Button from '../components/shared/Button';
import PageWrapper from '../components/layout/PageWrapper';
import { getAddOns } from '../services/aiService';
import { useBookingStore } from '../store/useBookingStore';
import { useUIStore } from '../store/useUIStore';
import { formatPrice } from '../utils/priceFormatter';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^\d{10}$/;
const upiPattern = /^[a-zA-Z0-9.\-_]{2,}@[a-zA-Z]{2,}$/;

/**
 * Booking summary and payment screen with inline validation and success confirmation.
 */
function BookingSummaryPage() {
  const selectedEvent = useBookingStore((state) => state.selectedEvent);
  const selectedShowtime = useBookingStore((state) => state.selectedShowtime);
  const selectedSeats = useBookingStore((state) => state.selectedSeats);
  const attendeeInfo = useBookingStore((state) => state.attendeeInfo);
  const paymentMethod = useBookingStore((state) => state.paymentMethod);
  const addOns = useBookingStore((state) => state.addOns);
  const bookingId = useBookingStore((state) => state.bookingId);
  const setAttendeeInfo = useBookingStore((state) => state.setAttendeeInfo);
  const toggleAddOn = useBookingStore((state) => state.toggleAddOn);
  const setBookingId = useBookingStore((state) => state.setBookingId);
  const resetBooking = useBookingStore((state) => state.resetBooking);

  const activeModal = useUIStore((state) => state.activeModal);
  const setActiveModal = useUIStore((state) => state.setActiveModal);
  const isLoading = useUIStore((state) => state.isLoading);
  const setLoading = useUIStore((state) => state.setLoading);
  const showToast = useUIStore((state) => state.showToast);

  const contextualAddOns = useMemo(() => getAddOns(selectedEvent), [selectedEvent]);

  const attendeeErrors = useMemo(
    () => ({
      name: attendeeInfo.name.trim() ? '' : 'Full name is required.',
      email: emailPattern.test(attendeeInfo.email) ? '' : 'Enter a valid email address.',
      phone: phonePattern.test(attendeeInfo.phone) ? '' : 'Phone number must be 10 digits.',
    }),
    [attendeeInfo.email, attendeeInfo.name, attendeeInfo.phone],
  );

  const paymentErrors = useMemo(() => {
    if (paymentMethod === 'card') {
      return {
        cardNumber: attendeeInfo.cardNumber.replace(/\s/g, '').length >= 12 ? '' : 'Enter a valid card number.',
        cardName: attendeeInfo.cardName.trim() ? '' : 'Cardholder name is required.',
        cardExpiry: /^\d{2}\/\d{2}$/.test(attendeeInfo.cardExpiry) ? '' : 'Use MM/YY format.',
        cardCvv: /^\d{3,4}$/.test(attendeeInfo.cardCvv) ? '' : 'Enter a valid CVV.',
      };
    }

    if (paymentMethod === 'upi') {
      return {
        upiId: upiPattern.test(attendeeInfo.upiId) ? '' : 'Enter a valid UPI ID.',
      };
    }

    if (paymentMethod === 'wallet') {
      return {
        wallet: attendeeInfo.wallet ? '' : 'Choose a wallet option.',
      };
    }

    return {};
  }, [attendeeInfo.cardCvv, attendeeInfo.cardExpiry, attendeeInfo.cardName, attendeeInfo.cardNumber, attendeeInfo.upiId, attendeeInfo.wallet, paymentMethod]);

  const formValid =
    Object.values(attendeeErrors).every((value) => !value) &&
    paymentMethod &&
    Object.values(paymentErrors).every((value) => !value);
  const base = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
  const bookingFee = selectedSeats.length * 100;
  const addOnTotal = addOns.reduce((sum, addOn) => sum + addOn.price, 0);
  const gst = Math.round((base + bookingFee + addOnTotal) * 0.18);
  const total = base + bookingFee + addOnTotal + gst;

  if (!selectedEvent || !selectedShowtime || selectedSeats.length === 0) {
    return null;
  }

  const handleSubmit = async () => {
    if (!formValid) {
      showToast({ message: 'Complete the attendee and payment details to continue.' });
      return;
    }

    setLoading(true);
    await new Promise((resolve) => {
      window.setTimeout(resolve, 1200);
    });
    const generatedBookingId = `IMS-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
    setBookingId(generatedBookingId);
    setLoading(false);
    setActiveModal('confirmation');
  };

  return (
    <>
      <PageWrapper className="relative mx-auto max-w-[1440px] overflow-hidden px-4 pb-12 pt-4 md:px-6 md:pt-6 xl:px-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
        >
          <div className="absolute left-[-10%] top-10 h-72 w-72 rounded-full bg-[rgba(255,59,48,0.1)] blur-[110px]" />
          <div className="absolute right-[-4%] top-36 h-80 w-80 rounded-full bg-[rgba(255,149,0,0.08)] blur-[130px]" />
          <div className="absolute bottom-10 left-1/3 h-64 w-64 rounded-full bg-[rgba(80,90,255,0.07)] blur-[120px]" />
        </div>

        <div className="mb-6 flex flex-col gap-4 md:mb-8 md:flex-row md:items-end md:justify-between md:gap-6">
          <div className="max-w-[760px]">
            <p className="text-xs uppercase tracking-[0.28em] text-[var(--color-text-muted)]">Step 3 of 3</p>
            <h1 className="mt-2 font-display text-4xl text-[var(--color-text-primary)] md:text-5xl">Booking Summary</h1>
            <p className="mt-3 max-w-[620px] text-sm text-[var(--color-text-secondary)]">
              Review your seats, complete attendee details, and finish payment with a cleaner premium checkout flow.
            </p>
          </div>
          <div className="premium-chip hidden rounded-full px-4 py-2 text-sm text-[var(--color-text-secondary)] lg:inline-flex">
            Final step before confirmation
          </div>
        </div>

        <div className="flex flex-col gap-4 md:grid md:grid-cols-[0.9fr_1.1fr] md:items-start md:gap-8">
          <div className="space-y-5">
            <OrderSummaryCard event={selectedEvent} showtime={selectedShowtime} seats={selectedSeats} />
            <PriceBreakdown seats={selectedSeats} addOns={addOns} />
          </div>

          <div className="flex flex-col gap-5">
            <div className="order-1 md:order-3">
              <AIAddOnStrip addOns={contextualAddOns} selectedAddOns={addOns} onToggle={toggleAddOn} />
            </div>
            <div className="order-2 md:order-1">
              <AttendeeForm values={attendeeInfo} errors={attendeeErrors} onChange={(key, value) => setAttendeeInfo({ [key]: value })} />
            </div>
            <div className="order-3 md:order-2">
              <PaymentSelector values={attendeeInfo} errors={paymentErrors} onFieldChange={(key, value) => setAttendeeInfo({ [key]: value })} />
            </div>

            <section className="order-4 hidden rounded-[30px] bg-[linear-gradient(145deg,rgba(28,28,42,0.96),rgba(15,15,23,0.98))] p-6 md:block premium-panel">
              <details>
                <summary className="cursor-pointer text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]">
                  Cancellation & refund policy
                </summary>
                <p className="mt-3 text-sm text-[var(--color-text-muted)]">
                  Tickets are non-refundable once the booking is confirmed. Date or venue changes will be communicated in-app for support handling.
                </p>
              </details>

              <div className="mt-6 flex items-center justify-between gap-4 border-t border-[rgba(255,255,255,0.06)] pt-5">
                <p className="text-sm text-[var(--color-text-secondary)]">
                  {formValid ? 'Ready to secure your tickets.' : 'Complete the form and pick a payment method to enable checkout.'}
                </p>
                <Button
                  onClick={handleSubmit}
                  disabled={!formValid}
                  loading={isLoading}
                  title={!formValid ? 'Complete required fields before payment.' : 'Pay now'}
                  className="shadow-[0_16px_34px_rgba(255,59,48,0.24)] hover:shadow-[0_20px_42px_rgba(255,59,48,0.34)]"
                >
                  Pay Now
                </Button>
              </div>
            </section>
          </div>
        </div>
      </PageWrapper>

      <div className="safe-bottom fixed inset-x-0 bottom-0 z-50 flex items-center justify-between gap-4 border-t border-white/10 bg-[rgba(17,17,24,0.96)] px-4 pt-3 pb-3 backdrop-blur-xl md:hidden">
        <div>
          <div style={{ color: '#F5F5F7', fontWeight: 700, fontSize: 18 }}>
            {formatPrice(total)}
          </div>
          <div style={{ color: '#555568', fontSize: 11 }}>+ taxes & fees</div>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!formValid}
          loading={isLoading}
          title={!formValid ? 'Complete required fields before payment.' : 'Pay now'}
          className="w-full max-w-[200px] shadow-[0_16px_34px_rgba(255,59,48,0.24)] hover:shadow-[0_20px_42px_rgba(255,59,48,0.34)]"
        >
          Pay Now
        </Button>
      </div>

      <div className="h-24 md:hidden" />

      {isLoading ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-[rgba(10,10,15,0.64)] backdrop-blur-sm">
          <div className="editorial-panel rounded-[28px] px-8 py-6 text-center">
            <p className="font-display text-3xl text-[var(--color-text-primary)]">Processing payment</p>
            <p className="mt-2 text-[var(--color-text-secondary)]">Preparing your booking confirmation…</p>
          </div>
        </div>
      ) : null}

      <ConfirmationModal
        open={activeModal === 'confirmation'}
        bookingId={bookingId}
        event={selectedEvent}
        showtime={selectedShowtime}
        seats={selectedSeats}
        attendeeInfo={attendeeInfo}
        addOns={addOns}
        onClose={() => {
          setActiveModal('');
          resetBooking();
        }}
      />
    </>
  );
}

export default BookingSummaryPage;
