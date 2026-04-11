import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const tenMinutes = 10 * 60 * 1000;

const defaultAttendeeInfo = {
  name: '',
  email: '',
  phone: '',
  cardNumber: '',
  cardExpiry: '',
  cardCvv: '',
  cardName: '',
  upiId: '',
  wallet: '',
};

export const useBookingStore = create(
  persist(
    (set) => ({
      selectedEvent: null,
      selectedShowtime: null,
      selectedSeats: [],
      selectedSeatCount: 2,
      seatHoldExpiry: null,
      attendeeInfo: defaultAttendeeInfo,
      paymentMethod: '',
      addOns: [],
      bookingId: '',
      setEvent: (event) => set({ selectedEvent: event }),
      setShowtime: (showtime) => set({ selectedShowtime: showtime }),
      setSeatCount: (count) => set({ selectedSeatCount: count, selectedSeats: [], seatHoldExpiry: null }),
      toggleSeat: (seat) =>
        set((state) => {
          const exists = state.selectedSeats.some((item) => item.id === seat.id);
          const selectedSeats = exists
            ? state.selectedSeats.filter((item) => item.id !== seat.id)
            : [...state.selectedSeats, seat];

          return {
            selectedSeats,
            seatHoldExpiry:
              selectedSeats.length > 0 ? state.seatHoldExpiry ?? Date.now() + tenMinutes : null,
          };
        }),
      setSelectedSeats: (selectedSeats) =>
        set({
          selectedSeats,
          seatHoldExpiry: selectedSeats.length > 0 ? Date.now() + tenMinutes : null,
        }),
      clearSeats: () => set({ selectedSeats: [], seatHoldExpiry: null }),
      setAttendeeInfo: (info) =>
        set((state) => ({
          attendeeInfo: {
            ...state.attendeeInfo,
            ...info,
          },
        })),
      setPaymentMethod: (paymentMethod) => set({ paymentMethod }),
      toggleAddOn: (addOn) =>
        set((state) => ({
          addOns: state.addOns.some((item) => item.id === addOn.id)
            ? state.addOns.filter((item) => item.id !== addOn.id)
            : [...state.addOns, addOn],
        })),
      setBookingId: (bookingId) => set({ bookingId }),
      resetBooking: () =>
        set({
          selectedEvent: null,
          selectedShowtime: null,
          selectedSeats: [],
          selectedSeatCount: 2,
          seatHoldExpiry: null,
          attendeeInfo: defaultAttendeeInfo,
          paymentMethod: '',
          addOns: [],
          bookingId: '',
        }),
    }),
    {
      name: 'itsmyscreen-booking-store',
      partialize: (state) => ({
        selectedEvent: state.selectedEvent,
        selectedShowtime: state.selectedShowtime,
        selectedSeats: state.selectedSeats,
        selectedSeatCount: state.selectedSeatCount,
        seatHoldExpiry: state.seatHoldExpiry,
        attendeeInfo: state.attendeeInfo,
        paymentMethod: state.paymentMethod,
        addOns: state.addOns,
        bookingId: state.bookingId,
      }),
    },
  ),
);
