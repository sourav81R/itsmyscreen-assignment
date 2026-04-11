import { seatLayouts } from '../data/seats';
import { areSeatsContiguous } from '../utils/seatValidator';

/**
 * Returns a fresh seat array for a venue so component state does not mutate the seed data.
 * @param {string} venueId
 * @returns {Array}
 */
export const getSeatsByVenue = (venueId) => JSON.parse(JSON.stringify(seatLayouts[venueId] ?? []));

/**
 * Returns whether a seat is already booked and cannot be selected.
 * Supports older unavailable status values for compatibility.
 * @param {Object} seat
 * @returns {boolean}
 */
export const isSeatBooked = (seat) => seat?.status === 'booked' || seat?.status === 'unavailable';

/**
 * Validates that selected seats are adjacent inside their rows.
 * @param {Array} seats
 * @returns {boolean}
 */
export const validateContiguous = (seats) => areSeatsContiguous(seats);

/**
 * Mocks a seat hold request by returning the ids that would be placed on hold.
 * @param {Array<string>} seatIds
 * @returns {Promise<Array<string>>}
 */
export const holdSeats = async (seatIds) => {
  await new Promise((resolve) => {
    window.setTimeout(resolve, 250);
  });
  return seatIds;
};
