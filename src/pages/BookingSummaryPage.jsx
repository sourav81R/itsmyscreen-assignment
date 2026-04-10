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
      <PageWrapper className="mx-auto max-w-[1440px] px-8 pb-12 pt-8">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.28em] text-[var(--color-text-muted)]">Step 3 of 3</p>
          <h1 className="mt-2 font-display text-5xl text-[var(--color-text-primary)]">Booking Summary</h1>
        </div>

        <div className="grid grid-cols-[0.9fr_1.1fr] gap-8">
          <div className="space-y-5">
            <OrderSummaryCard event={selectedEvent} showtime={selectedShowtime} seats={selectedSeats} />
            <PriceBreakdown seats={selectedSeats} addOns={addOns} />
          </div>

          <div className="space-y-5">
            <AttendeeForm values={attendeeInfo} errors={attendeeErrors} onChange={(key, value) => setAttendeeInfo({ [key]: value })} />
            <PaymentSelector values={attendeeInfo} errors={paymentErrors} onFieldChange={(key, value) => setAttendeeInfo({ [key]: value })} />
            <AIAddOnStrip addOns={contextualAddOns} selectedAddOns={addOns} onToggle={toggleAddOn} />

            <section className="editorial-panel rounded-[32px] p-6">
              <details>
                <summary className="cursor-pointer text-sm text-[var(--color-text-secondary)]">
                  Cancellation & refund policy
                </summary>
                <p className="mt-3 text-sm text-[var(--color-text-muted)]">
                  Tickets are non-refundable once the booking is confirmed. Date or venue changes will be communicated in-app for support handling.
                </p>
              </details>

              <div className="mt-6 flex items-center justify-between gap-4">
                <p className="text-sm text-[var(--color-text-secondary)]">
                  {formValid ? 'Ready to secure your tickets.' : 'Complete the form and pick a payment method to enable checkout.'}
                </p>
                <Button
                  onClick={handleSubmit}
                  disabled={!formValid}
                  loading={isLoading}
                  title={!formValid ? 'Complete required fields before payment.' : 'Pay now'}
                >
                  Pay Now
                </Button>
              </div>
            </section>
          </div>
        </div>
      </PageWrapper>

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
        onClose={() => {
          setActiveModal('');
          resetBooking();
        }}
      />
    </>
  );
}

export default BookingSummaryPage;
