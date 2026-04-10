export const events = [
  {
    id: 'event-arijit',
    title: 'Arijit Singh Live',
    artist: 'Arijit Singh',
    genre: ['Classical', 'Bollywood'],
    bannerUrl:
      'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1600&q=80',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1501612780327-45045538702b?auto=format&fit=crop&w=900&q=80',
    description:
      'A sweeping live set that moves from intimate ballads to soaring Bollywood arrangements with a full cinematic band.',
    duration: '2h 40m',
    ageRating: '10+',
    language: 'Hindi',
    venueId: 'venue-mumbai-mmrda',
    priceRange: { min: 1200, max: 7800 },
    availability: 'fast-filling',
    availabilityPercent: 41,
    tags: ['Soulful', 'Live strings', 'Mumbai'],
    aiInsight: 'Fans who book orchestral and indie nights often save Arijit for a premium aisle section.',
    lineup: [
      { name: 'Arijit Singh', time: '8:00 PM' },
      { name: 'Live Strings Ensemble', time: '8:45 PM' },
      { name: 'Acoustic Encore', time: '10:10 PM' },
    ],
    tierPerks: {
      general: ['Festival seating', 'Quick entry lane'],
      premium: ['Closer center block', 'Dedicated beverage queue'],
      vip: ['Front rows', 'Artist merchandise gift box'],
    },
  },
  {
    id: 'event-dua-lipa',
    title: 'Dua Lipa World Tour',
    artist: 'Dua Lipa',
    genre: ['Pop', 'Dance'],
    bannerUrl:
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1600&q=80',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=900&q=80',
    description:
      'A neon-heavy pop spectacle with synchronized visuals, chart-topping singles, and a stadium-sized dance floor energy.',
    duration: '2h 15m',
    ageRating: '12+',
    language: 'English',
    venueId: 'venue-delhi-jln',
    priceRange: { min: 1600, max: 8000 },
    availability: 'available',
    availabilityPercent: 53,
    tags: ['Global tour', 'Dance pop', 'Delhi'],
    aiInsight: 'Pop lovers coming from high-energy electronic nights are converting fastest on this event.',
    lineup: [
      { name: 'Opening DJ Set', time: '7:10 PM' },
      { name: 'Dua Lipa', time: '8:30 PM' },
      { name: 'Finale Fireworks', time: '10:15 PM' },
    ],
    tierPerks: {
      general: ['Stadium bowl access', 'Merch kiosk priority'],
      premium: ['Closer bowl block', 'Fast-track security'],
      vip: ['Pit-adjacent access', 'VIP lounge'],
    },
  },
  {
    id: 'event-nucleya',
    title: 'Nucleya Bass Festival',
    artist: 'Nucleya',
    genre: ['Electronic', 'Bass'],
    bannerUrl:
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1600&q=80',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1499364615650-ec38552f4f34?auto=format&fit=crop&w=900&q=80',
    description:
      'A late-night bass festival with immersive LED walls, guest MCs, and a relentless electronic set built for crowd energy.',
    duration: '3h 00m',
    ageRating: '18+',
    language: 'English',
    venueId: 'venue-bengaluru-palace',
    priceRange: { min: 1000, max: 6500 },
    availability: 'almost-full',
    availabilityPercent: 17,
    tags: ['Bass-heavy', 'Late night', 'Bengaluru'],
    aiInsight: 'Electronic fans in your profile tend to book center premium rows here for the cleanest mix.',
    lineup: [
      { name: 'Warm-up Set', time: '8:00 PM' },
      { name: 'Nucleya', time: '9:15 PM' },
      { name: 'Guest Bass Takeover', time: '11:00 PM' },
    ],
    tierPerks: {
      general: ['Rear bowl access', 'Standing terrace'],
      premium: ['Centerline audio sweet spot', 'Priority re-entry'],
      vip: ['Front fan zone', 'VIP bar access'],
    },
  },
  {
    id: 'event-local-train',
    title: 'The Local Train Unplugged',
    artist: 'The Local Train',
    genre: ['Indie Rock', 'Rock'],
    bannerUrl:
      'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?auto=format&fit=crop&w=1600&q=80',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=900&q=80',
    description:
      'An anthemic indie rock evening with layered guitars, fan-favorite singalongs, and a stripped-back storytelling format.',
    duration: '2h 05m',
    ageRating: 'All Ages',
    language: 'Hindi',
    venueId: 'venue-mumbai-mmrda',
    priceRange: { min: 900, max: 5200 },
    availability: 'available',
    availabilityPercent: 64,
    tags: ['Indie', 'Sing-along', 'Pune crowd favorite'],
    aiInsight: 'Your rock affinity pushes this into the top tier because similar buyers often book this with groups of 3-5.',
    lineup: [
      { name: 'Acoustic Prelude', time: '7:00 PM' },
      { name: 'The Local Train', time: '8:05 PM' },
      { name: 'Encore Jam', time: '9:50 PM' },
    ],
    tierPerks: {
      general: ['Open floor access', 'Merch counter'],
      premium: ['Mid-floor reserved cluster', 'Early entry'],
      vip: ['Front pen access', 'Signed poster'],
    },
  },
  {
    id: 'event-rahman',
    title: 'A.R. Rahman Symphony',
    artist: 'A.R. Rahman',
    genre: ['Orchestral', 'World'],
    bannerUrl:
      'https://images.unsplash.com/photo-1464375117522-1311dd7d0b5c?auto=format&fit=crop&w=1600&q=80',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1507838153414-b4b713384a76?auto=format&fit=crop&w=900&q=80',
    description:
      'A symphonic reimagining of iconic scores with choir, strings, percussion, and cinematic lighting built for an elegant evening.',
    duration: '2h 50m',
    ageRating: '8+',
    language: 'English, Tamil, Hindi',
    venueId: 'venue-chennai-sxicc',
    priceRange: { min: 1800, max: 8000 },
    availability: 'almost-full',
    availabilityPercent: 21,
    tags: ['Symphony', 'Premium', 'Chennai'],
    aiInsight: 'Premium center seats here usually balance acoustics and value better than the front rows.',
    lineup: [
      { name: 'Chennai Session Orchestra', time: '7:30 PM' },
      { name: 'A.R. Rahman', time: '8:20 PM' },
      { name: 'Choir Finale', time: '9:55 PM' },
    ],
    tierPerks: {
      general: ['Rear orchestra seating', 'Printed souvenir program'],
      premium: ['Center orchestra section', 'Interval lounge access'],
      vip: ['Rows A-C', 'Meet-and-greet raffle'],
    },
  },
  {
    id: 'event-prateek',
    title: 'Prateek Kuhad Moonlight Set',
    artist: 'Prateek Kuhad',
    genre: ['Indie', 'Acoustic'],
    bannerUrl:
      'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?auto=format&fit=crop&w=1600&q=80',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2?auto=format&fit=crop&w=900&q=80',
    description:
      'Soft-focus indie storytelling with layered harmonies, intimate visuals, and a relaxed venue layout for slow-burn favorites.',
    duration: '1h 50m',
    ageRating: 'All Ages',
    language: 'English, Hindi',
    venueId: 'venue-chennai-sxicc',
    priceRange: { min: 1200, max: 5200 },
    availability: 'available',
    availabilityPercent: 70,
    tags: ['Acoustic', 'Intimate', 'Chennai'],
    aiInsight: 'Listeners who save indie-rock gigs often prefer premium side-center seats for this calmer stage mix.',
    lineup: [
      { name: 'Opening Acoustic Duo', time: '7:10 PM' },
      { name: 'Prateek Kuhad', time: '8:00 PM' },
      { name: 'Audience Requests', time: '9:20 PM' },
    ],
    tierPerks: {
      general: ['Balcony access', 'Poster pickup'],
      premium: ['Side-center seats', 'Express entry'],
      vip: ['Front acoustic pit', 'Exclusive soundcheck view'],
    },
  },
  {
    id: 'event-divine',
    title: 'DIVINE Street Verse Arena',
    artist: 'DIVINE',
    genre: ['Hip-Hop', 'Rap'],
    bannerUrl:
      'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1600&q=80',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=900&q=80',
    description:
      'A high-impact rap arena show with visual storytelling, guest cyphers, and crowd-first staging that hits hardest from the center.',
    duration: '2h 20m',
    ageRating: '16+',
    language: 'Hindi',
    venueId: 'venue-mumbai-mmrda',
    priceRange: { min: 1100, max: 6800 },
    availability: 'fast-filling',
    availabilityPercent: 29,
    tags: ['Arena rap', 'Mumbai', 'High energy'],
    aiInsight: 'Group buyers usually lock 4-seat premium blocks here because floor-side sightlines stay clearer.',
    lineup: [
      { name: 'Cypher Opener', time: '7:45 PM' },
      { name: 'DIVINE', time: '8:40 PM' },
      { name: 'Guest Verse Finale', time: '10:20 PM' },
    ],
    tierPerks: {
      general: ['Upper bowl entry', 'Beverage lane'],
      premium: ['Center side blocks', 'Fast re-entry'],
      vip: ['Front barricade zone', 'VIP merch bundle'],
    },
  },
  {
    id: 'event-shreya',
    title: 'Shreya Ghoshal Twilight Tour',
    artist: 'Shreya Ghoshal',
    genre: ['Bollywood', 'Classical'],
    bannerUrl:
      'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1600&q=80',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1516280030429-27679b3dc9cf?auto=format&fit=crop&w=900&q=80',
    description:
      'A polished twilight concert with soaring vocals, romantic arrangements, and a warm lighting palette designed for a premium seated show.',
    duration: '2h 10m',
    ageRating: 'All Ages',
    language: 'Hindi',
    venueId: 'venue-chennai-sxicc',
    priceRange: { min: 1400, max: 7600 },
    availability: 'fast-filling',
    availabilityPercent: 39,
    tags: ['Vocals', 'Evening show', 'Chennai'],
    aiInsight: 'Bollywood listeners tend to convert on VIP only when availability dips below 25%; premium is the sweet spot now.',
    lineup: [
      { name: 'String Prelude', time: '7:20 PM' },
      { name: 'Shreya Ghoshal', time: '8:00 PM' },
      { name: 'Duet Finale', time: '9:40 PM' },
    ],
    tierPerks: {
      general: ['Rear bowl seating', 'Fast access'],
      premium: ['Centered view', 'Priority concessions'],
      vip: ['Close orchestra rows', 'Signed postcard'],
    },
  },
  {
    id: 'event-ritviz',
    title: 'Ritviz Sundowner Circuit',
    artist: 'Ritviz',
    genre: ['Electronic', 'Indie Pop'],
    bannerUrl:
      'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?auto=format&fit=crop&w=1600&q=80',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1487180144351-b8472da7d491?auto=format&fit=crop&w=900&q=80',
    description:
      'An electronic sundowner with fluid house rhythms, projected artwork, and a color-soaked stage built for golden-hour energy.',
    duration: '2h 30m',
    ageRating: '16+',
    language: 'Hindi, English',
    venueId: 'venue-bengaluru-palace',
    priceRange: { min: 950, max: 6200 },
    availability: 'available',
    availabilityPercent: 51,
    tags: ['Sundowner', 'Electronic', 'Bengaluru'],
    aiInsight: 'Your electronic bias makes this a high-confidence recommendation, especially if you want a faster checkout path.',
    lineup: [
      { name: 'Sunset Warm-up', time: '6:30 PM' },
      { name: 'Ritviz', time: '8:00 PM' },
      { name: 'Closing House Set', time: '9:45 PM' },
    ],
    tierPerks: {
      general: ['Open lawn access', 'Bar lane'],
      premium: ['Center lawn reserve', 'Fast entry'],
      vip: ['Raised deck view', 'VIP host desk'],
    },
  },
  {
    id: 'event-coke',
    title: 'Coke Studio Bharat Live',
    artist: 'Multiple Artists',
    genre: ['Fusion', 'World'],
    bannerUrl:
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1600&q=80',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=900&q=80',
    description:
      'A genre-crossing showcase of collaborative sets, cinematic sound design, and one-off live arrangements from across India.',
    duration: '3h 15m',
    ageRating: 'All Ages',
    language: 'Multilingual',
    venueId: 'venue-delhi-jln',
    priceRange: { min: 1000, max: 7200 },
    availability: 'available',
    availabilityPercent: 71,
    tags: ['Fusion', 'Festival', 'Delhi'],
    aiInsight: 'Discovery-heavy listeners respond well to this because it mixes multiple genres you already browse.',
    lineup: [
      { name: 'Opening Collaboration', time: '6:30 PM' },
      { name: 'Coke Studio Residency', time: '7:40 PM' },
      { name: 'All Artist Finale', time: '9:50 PM' },
    ],
    tierPerks: {
      general: ['Bowl admission', 'Food court access'],
      premium: ['Center bowl seat', 'Priority gate'],
      vip: ['Premium pit deck', 'Hospitality lounge'],
    },
  },
  {
    id: 'event-zakir',
    title: 'Zakir Hussain Rhythms',
    artist: 'Zakir Hussain',
    genre: ['Classical', 'Percussion'],
    bannerUrl:
      'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?auto=format&fit=crop&w=1600&q=80',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=900&q=80',
    description:
      'An elevated percussion-led night with virtuosic improvisation, collaborative solos, and a premium seated listening experience.',
    duration: '2h 00m',
    ageRating: '8+',
    language: 'Instrumental',
    venueId: 'venue-chennai-sxicc',
    priceRange: { min: 1700, max: 7900 },
    availability: 'almost-full',
    availabilityPercent: 19,
    tags: ['Classical', 'Percussion', 'Premium'],
    aiInsight: 'Customers who book orchestral events often follow up with this because the acoustics reward center premium rows.',
    lineup: [
      { name: 'Tabla Prelude', time: '7:00 PM' },
      { name: 'Zakir Hussain', time: '7:45 PM' },
      { name: 'Percussion Jam', time: '9:05 PM' },
    ],
    tierPerks: {
      general: ['Rear floor section', 'Program booklet'],
      premium: ['Center acoustic zone', 'Lounge tea service'],
      vip: ['Rows A-C', 'Artist Q&A raffle'],
    },
  },
  {
    id: 'event-lucky-ali',
    title: 'Lucky Ali Midnight Caravan',
    artist: 'Lucky Ali',
    genre: ['Indie', 'Folk Rock'],
    bannerUrl:
      'https://images.unsplash.com/photo-1518972559570-7cc1309f3229?auto=format&fit=crop&w=1600&q=80',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1507838153414-b4b713384a76?auto=format&fit=crop&w=900&q=80',
    description:
      'A nostalgic folk-rock set with wide-open visuals, intimate storytelling, and singalong choruses designed for a laid-back crowd.',
    duration: '2h 00m',
    ageRating: 'All Ages',
    language: 'Hindi, English',
    venueId: 'venue-mumbai-mmrda',
    priceRange: { min: 950, max: 5800 },
    availability: 'available',
    availabilityPercent: 55,
    tags: ['Nostalgia', 'Folk rock', 'Mumbai'],
    aiInsight: 'This lands well for rock-leaning users who still want a calmer booking flow and easy premium group blocks.',
    lineup: [
      { name: 'Indie Opener', time: '7:20 PM' },
      { name: 'Lucky Ali', time: '8:10 PM' },
      { name: 'Campfire Encore', time: '9:40 PM' },
    ],
    tierPerks: {
      general: ['Rear floor access', 'Food hall'],
      premium: ['Side-center reserve', 'Early entry'],
      vip: ['Front acoustic zone', 'Collector wristband'],
    },
  },
  {
    id: 'event-sitara',
    title: 'Sitara x Kayan Dreamwave',
    artist: 'Sitara x Kayan',
    genre: ['Electronic', 'Alt Pop'],
    bannerUrl:
      'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1600&q=80',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?auto=format&fit=crop&w=900&q=80',
    description:
      'A sleek alt-pop and electronic hybrid with deep visuals, guest vocals, and pacing that rewards centerline seating.',
    duration: '2h 25m',
    ageRating: '16+',
    language: 'English',
    venueId: 'venue-bengaluru-palace',
    priceRange: { min: 1100, max: 6400 },
    availability: 'fast-filling',
    availabilityPercent: 34,
    tags: ['Alt pop', 'Electronic', 'Night show'],
    aiInsight: 'Your electronic preference and browsing history make this one of the strongest matches in Bengaluru right now.',
    lineup: [
      { name: 'Visual Prelude', time: '8:00 PM' },
      { name: 'Sitara', time: '8:45 PM' },
      { name: 'Kayan Closing Set', time: '10:10 PM' },
    ],
    tierPerks: {
      general: ['Rear lawn access', 'Standard gate'],
      premium: ['Central lawn viewing', 'Fast-track entry'],
      vip: ['Raised viewing deck', 'Private bar'],
    },
  },
];

export const eventMap = Object.fromEntries(events.map((event) => [event.id, event]));
