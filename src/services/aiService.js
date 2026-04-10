import { venueMap } from '../data/venues';
import { sortSeats } from '../utils/seatValidator';

const affinityWeights = {
  Rock: 4,
  'Indie Rock': 4,
  Electronic: 5,
  'Alt Pop': 2,
  'Indie Pop': 2,
  Bass: 3,
};

const tierOrder = ['general', 'premium', 'vip'];

/**
 * Returns the top three contiguous seat groups that best match a group size and budget.
 * @param {Array} seats
 * @param {number} budget
 * @param {number} count
 * @returns {Array}
 */
export const getBestSeats = (seats, budget = 5000, count = 2) => {
  const availableSeats = seats.filter((seat) => seat.status === 'available');
  const groupedRows = availableSeats.reduce((acc, seat) => {
    acc[seat.row] ??= [];
    acc[seat.row].push(seat);
    return acc;
  }, {});

  const candidateGroups = Object.values(groupedRows)
    .flatMap((rowSeats) => {
      const sorted = [...rowSeats].sort((left, right) => left.number - right.number);
      const groups = [];

      for (let index = 0; index <= sorted.length - count; index += 1) {
        const slice = sorted.slice(index, index + count);
        const contiguous = slice.every(
          (seat, sliceIndex) => sliceIndex === 0 || seat.number - slice[sliceIndex - 1].number === 1,
        );
        const total = slice.reduce((sum, seat) => sum + seat.price, 0);
        if (contiguous && total <= budget) {
          const rowDepthScore = 26 - slice[0].row.charCodeAt(0);
          const budgetFitScore = Math.max(0, budget - total) / 300;

          groups.push({
            seats: slice,
            total,
            score: rowDepthScore + budgetFitScore,
          });
        }
      }

      return groups;
    });

  const recommendations = tierOrder
    .map((tier) =>
      candidateGroups
        .filter((group) => group.seats[0].tier === tier)
        .sort((left, right) => right.score - left.score)[0],
    )
    .filter(Boolean);

  return recommendations;
};

/**
 * Returns a personalized event ranking for a mock user profile that prefers rock and electronic music.
 * @param {Array} events
 * @returns {Array}
 */
export const getPersonalizedEvents = (events) =>
  [...events]
    .map((event) => ({
      ...event,
      personalizationScore: event.genre.reduce((score, genre) => score + (affinityWeights[genre] ?? 0), 0),
    }))
    .sort((left, right) => {
      if (right.personalizationScore !== left.personalizationScore) {
        return right.personalizationScore - left.personalizationScore;
      }
      return (right.availabilityPercent ?? 0) - (left.availabilityPercent ?? 0);
    });

/**
 * Returns a sell-out label based on remaining availability percentage.
 * @param {Object} event
 * @returns {{label: string, urgency: 'high' | 'medium' | 'low'}}
 */
export const getSellOutPrediction = (event) => {
  const availability = event.availabilityPercent ?? 100;

  if (availability < 20) {
    return { label: '🔥 Only a few seats left!', urgency: 'high' };
  }

  if (availability < 50) {
    return { label: 'Filling fast — book soon', urgency: 'medium' };
  }

  return { label: 'Good availability', urgency: 'low' };
};

/**
 * Returns contextual add-ons based on venue type.
 * @param {Object} event
 * @returns {Array}
 */
export const getAddOns = (event) => {
  const venue = venueMap[event.venueId];
  const byVenueKind = {
    stadium: [
      { id: 'parking', icon: 'P', name: 'Parking Pass', price: 200 },
      { id: 'merch', icon: 'M', name: 'Merchandise Bundle', price: 500 },
      { id: 'photo', icon: 'C', name: 'Photo Pass', price: 350 },
    ],
    grounds: [
      { id: 'fastlane', icon: 'F', name: 'Fast Lane Entry', price: 250 },
      { id: 'drink', icon: 'D', name: 'Drink Voucher', price: 300 },
      { id: 'poster', icon: 'P', name: 'Limited Poster Set', price: 450 },
    ],
    convention: [
      { id: 'lounge', icon: 'L', name: 'Lounge Upgrade', price: 400 },
      { id: 'souvenir', icon: 'S', name: 'Souvenir Program', price: 250 },
      { id: 'valet', icon: 'V', name: 'Valet Access', price: 300 },
    ],
  };

  return byVenueKind[venue.kind] ?? byVenueKind.grounds;
};

export const buildSeatGroupLabel = (group) => {
  const sorted = sortSeats(group.seats);
  return `${sorted[0].row}${sorted[0].number}-${sorted.at(-1).number}`;
};
