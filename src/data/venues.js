export const venues = [
  {
    id: 'venue-delhi-jln',
    name: 'Jawaharlal Nehru Stadium',
    city: 'Delhi',
    capacity: 30000,
    kind: 'stadium',
    address: 'Pragati Vihar, New Delhi, Delhi 110003',
    mapImageUrl:
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
    transportInfo: ['JLN Stadium Metro - 5 min walk', 'Dedicated cab drop zone', 'Parking Zone C available'],
    seatConfig: {
      centerX: 500,
      centerY: 70,
      horizontalScale: 1,
      verticalScale: 0.86,
    },
  },
  {
    id: 'venue-mumbai-mmrda',
    name: 'MMRDA Grounds BKC',
    city: 'Mumbai',
    capacity: 25000,
    kind: 'grounds',
    address: 'Bandra Kurla Complex, Mumbai, Maharashtra 400051',
    mapImageUrl:
      'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80',
    transportInfo: ['BKC shuttle every 15 min', 'Premium valet access', 'Western Express Highway nearby'],
    seatConfig: {
      centerX: 500,
      centerY: 72,
      horizontalScale: 1.06,
      verticalScale: 0.84,
    },
  },
  {
    id: 'venue-bengaluru-palace',
    name: 'Palace Grounds',
    city: 'Bengaluru',
    capacity: 20000,
    kind: 'grounds',
    address: 'Jayamahal Main Rd, Bengaluru, Karnataka 560006',
    mapImageUrl:
      'https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=1200&q=80',
    transportInfo: ['Cubbon Park Metro + shuttle loop', 'Dedicated bike parking', 'Food court corridor near Gate 2'],
    seatConfig: {
      centerX: 500,
      centerY: 76,
      horizontalScale: 0.98,
      verticalScale: 0.86,
    },
  },
  {
    id: 'venue-chennai-sxicc',
    name: 'SXICC',
    city: 'Chennai',
    capacity: 8000,
    kind: 'convention',
    address: 'Mount Poonamallee Rd, Chennai, Tamil Nadu 600089',
    mapImageUrl:
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=80',
    transportInfo: ['Indoor drop-off at East Lobby', 'Metro connector buses', 'Accessible parking bays'],
    seatConfig: {
      centerX: 500,
      centerY: 78,
      horizontalScale: 0.92,
      verticalScale: 0.88,
    },
  },
];

export const venueMap = Object.fromEntries(venues.map((venue) => [venue.id, venue]));
