# System Architecture
## itsmyscreen — Concert Booking Platform (Frontend Prototype)
**Version:** 1.0  
**Date:** April 2026

---

## 1. Architecture Overview

This is a **client-side single-page application (SPA)** built with React. Since this is a UI/UX prototype/assignment deliverable, there is no real backend — all data is mocked locally. The architecture is structured to be backend-ready (API shape is defined) so it can be connected to real services later.

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser (Client)                      │
│                                                             │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │    Router    │───▶│    Pages     │───▶│  Components  │  │
│  │  (React      │    │  (4 screens) │    │  (UI atoms)  │  │
│  │   Router v6) │    └──────┬───────┘    └──────────────┘  │
│  └──────────────┘           │                               │
│                             ▼                               │
│                    ┌──────────────────┐                     │
│                    │   State Layer    │                     │
│                    │  (Zustand store) │                     │
│                    └────────┬─────────┘                     │
│                             │                               │
│                    ┌────────▼─────────┐                     │
│                    │   Mock Data /    │                     │
│                    │   Services Layer │                     │
│                    │  (JSON + utils)  │                     │
│                    └──────────────────┘                     │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Technology Stack

| Layer | Technology | Rationale |
|---|---|---|
| Framework | React 18 + Vite | Fast HMR, modern JSX, ecosystem |
| Routing | React Router v6 | Declarative, nested routes |
| State Management | Zustand | Lightweight, minimal boilerplate |
| Styling | Tailwind CSS + CSS Modules | Utility-first + scoped custom styles |
| Icons | Lucide React | Clean, consistent icon set |
| Seating Map | Custom SVG (React) | Full control over seat states |
| Animations | Framer Motion | Smooth page transitions & micro-interactions |
| Font | Google Fonts (Syne + DM Sans) | Distinctive display + clean body |
| Linting | ESLint + Prettier | Code quality |
| Build | Vite | Fast bundler |

---

## 3. Project Directory Structure

```
itsmyscreen/
├── public/
│   ├── favicon.ico
│   └── assets/
│       └── images/           # Event banners, artist photos (mock)
│
├── src/
│   ├── main.jsx              # App entry point
│   ├── App.jsx               # Root component + Router
│   │
│   ├── pages/                # 4 core screens (route-level components)
│   │   ├── DiscoveryPage.jsx
│   │   ├── EventDetailPage.jsx
│   │   ├── SeatSelectionPage.jsx
│   │   └── BookingSummaryPage.jsx
│   │
│   ├── components/           # Reusable UI components
│   │   ├── layout/
│   │   │   ├── Navbar.jsx
│   │   │   └── PageWrapper.jsx
│   │   ├── discovery/
│   │   │   ├── EventCard.jsx
│   │   │   ├── FilterPanel.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── ViewToggle.jsx
│   │   │   └── AIRecommendedBanner.jsx
│   │   ├── event-detail/
│   │   │   ├── EventHero.jsx
│   │   │   ├── EventInfo.jsx
│   │   │   ├── VenueMap.jsx
│   │   │   ├── PricingTiers.jsx
│   │   │   └── AIInsightChip.jsx
│   │   ├── seat-selection/
│   │   │   ├── SeatingMap.jsx       # SVG interactive map
│   │   │   ├── SeatLegend.jsx
│   │   │   ├── ShowtimeSelector.jsx
│   │   │   ├── SeatCountPicker.jsx
│   │   │   ├── PriceSummaryBar.jsx
│   │   │   └── AIBestSeats.jsx
│   │   ├── booking-summary/
│   │   │   ├── OrderSummaryCard.jsx
│   │   │   ├── AttendeeForm.jsx
│   │   │   ├── PaymentSelector.jsx
│   │   │   ├── PriceBreakdown.jsx
│   │   │   └── ConfirmationModal.jsx
│   │   └── shared/
│   │       ├── Button.jsx
│   │       ├── Badge.jsx
│   │       ├── Timer.jsx
│   │       ├── Tooltip.jsx
│   │       └── AvailabilityBadge.jsx
│   │
│   ├── store/                # Zustand state slices
│   │   ├── useBookingStore.js      # Selected event, seats, showtimes
│   │   ├── useFilterStore.js       # Discovery filter state
│   │   └── useUIStore.js           # View mode, modal state
│   │
│   ├── data/                 # Mock data
│   │   ├── events.js               # 12–15 mock events
│   │   ├── venues.js               # Venue details + seating config
│   │   └── showtimes.js            # Date/time slots per event
│   │
│   ├── services/             # Data access layer (mock)
│   │   ├── eventService.js         # getEvents(), getEventById()
│   │   ├── seatService.js          # getSeats(), holdSeats()
│   │   └── aiService.js            # getRecommendations(), getBestSeats()
│   │
│   ├── hooks/                # Custom React hooks
│   │   ├── useEventFilter.js
│   │   ├── useSeatSelection.js
│   │   └── useBookingTimer.js
│   │
│   ├── utils/                # Pure utility functions
│   │   ├── priceFormatter.js
│   │   ├── dateFormatter.js
│   │   └── seatValidator.js
│   │
│   └── styles/
│       ├── globals.css             # CSS variables, resets
│       └── tokens.css              # Design tokens (colors, spacing, type)
│
├── index.html
├── vite.config.js
├── tailwind.config.js
├── package.json
└── README.md
```

---

## 4. Routing Architecture

```
/                          → Redirect to /discover
/discover                  → DiscoveryPage
/event/:eventId            → EventDetailPage
/event/:eventId/seats      → SeatSelectionPage
/booking/summary           → BookingSummaryPage
/booking/confirmation      → Confirmation (modal or page)
```

Route guards: SeatSelectionPage requires an event to be selected in store. BookingSummaryPage requires seats to be selected. Redirect to /discover if state is missing.

---

## 5. State Architecture (Zustand)

### useBookingStore
```js
{
  selectedEvent: Event | null,
  selectedShowtime: Showtime | null,
  selectedSeats: Seat[],          // max 10
  seatHoldExpiry: Date | null,    // 10-minute timer
  attendeeInfo: AttendeeForm,
  paymentMethod: string,
  
  // Actions
  setEvent(event),
  setShowtime(showtime),
  toggleSeat(seat),
  clearSeats(),
  setAttendeeInfo(info),
  setPaymentMethod(method),
  resetBooking(),
}
```

### useFilterStore
```js
{
  searchQuery: string,
  genres: string[],
  dateRange: { from: Date, to: Date },
  priceRange: { min: number, max: number },
  venue: string,
  viewMode: 'grid' | 'list',
  
  // Actions
  setFilter(key, value),
  resetFilters(),
  setViewMode(mode),
}
```

---

## 6. Data Models

### Event
```ts
{
  id: string,
  title: string,
  artist: string,
  genre: string[],
  bannerUrl: string,
  thumbnailUrl: string,
  description: string,
  duration: string,          // e.g. "2h 30m"
  ageRating: string,
  language: string,
  venueId: string,
  showtimes: Showtime[],
  priceRange: { min: number, max: number },
  availability: 'available' | 'fast-filling' | 'almost-full' | 'sold-out',
  tags: string[],
  aiInsight?: string,        // e.g. "Usually sells out 3 days before"
}
```

### Seat
```ts
{
  id: string,               // e.g. "A12"
  row: string,
  number: number,
  tier: 'vip' | 'premium' | 'general',
  price: number,
  status: 'available' | 'selected' | 'unavailable' | 'wheelchair',
  x: number,                // SVG coordinate
  y: number,                // SVG coordinate
}
```

### Showtime
```ts
{
  id: string,
  date: string,             // ISO date
  time: string,             // e.g. "7:30 PM"
  availableSeats: number,
  totalSeats: number,
}
```

---

## 7. AI Service (Rule-Based Mock)

```js
// aiService.js

// Returns top 3 seat recommendations based on budget + tier preference
getBestSeats(seats, budget, preference) → Seat[]

// Returns personalized event ranking score
rankEvents(events, userProfile) → Event[]  

// Returns sell-out prediction
getSellOutPrediction(event) → { daysLeft: number, confidence: 'high'|'medium' }

// Returns add-on recommendations
getAddOns(event, seats) → AddOn[]
```

Production replacement: swap service methods with real API calls to an ML recommendation endpoint without changing component interfaces.

---

## 8. Component Communication Pattern

```
Page (route)
  └── Container Component (data fetching, store connection)
        └── Presentation Component (pure UI, props only)
              └── Shared UI Atoms (Button, Badge, etc.)
```

Pages own state orchestration. Components are kept as pure/dumb as possible. All booking state lives in Zustand, not component state.

---

## 9. Design Token System

Defined in `src/styles/tokens.css`:

```css
:root {
  /* Brand */
  --color-brand-primary: #FF3B30;      /* itsmyscreen red */
  --color-brand-accent: #FF9500;       /* warm amber accent */
  
  /* Neutrals */
  --color-bg-base: #0A0A0F;            /* near-black background */
  --color-bg-surface: #141420;         /* card surfaces */
  --color-bg-elevated: #1E1E30;        /* elevated/modal */
  --color-text-primary: #F5F5F7;
  --color-text-secondary: #8E8EA0;
  --color-text-muted: #4A4A60;
  
  /* Seat Tiers */
  --color-seat-vip: #FFD60A;
  --color-seat-premium: #30D158;
  --color-seat-general: #0A84FF;
  --color-seat-unavailable: #2C2C3E;
  --color-seat-selected: #FF3B30;
  
  /* Spacing (8px grid) */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;
  --space-16: 64px;
  
  /* Typography */
  --font-display: 'Syne', sans-serif;
  --font-body: 'DM Sans', sans-serif;
  
  /* Radius */
  --radius-sm: 6px;
  --radius-md: 12px;
  --radius-lg: 20px;
  --radius-full: 9999px;
  
  /* Shadows */
  --shadow-card: 0 4px 24px rgba(0,0,0,0.4);
  --shadow-elevated: 0 8px 40px rgba(0,0,0,0.6);
}
```