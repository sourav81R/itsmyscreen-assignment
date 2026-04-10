# Task Breakdown
## itsmyscreen — Concert Booking Platform
**Format:** Ordered implementation tasks for a coding agent  
**Date:** April 2026

---

## EPIC 1: Project Setup & Foundation

### T-001: Scaffold the project
- [ ] Initialize Vite + React 18 project: `npm create vite@latest itsmyscreen -- --template react`
- [ ] Install dependencies:
  ```
  react-router-dom@6
  zustand
  framer-motion
  lucide-react
  tailwindcss
  autoprefixer
  postcss
  ```
- [ ] Configure Tailwind CSS (`tailwind.config.js`, `postcss.config.js`)
- [ ] Add Google Fonts (Syne + DM Sans) in `index.html`

### T-002: Design tokens & global styles
- [ ] Create `src/styles/tokens.css` with all CSS variables (colors, spacing, typography, radius, shadows, seat tier colors)
- [ ] Create `src/styles/globals.css` with reset, base styles, font assignments
- [ ] Import both in `main.jsx`

### T-003: Mock data
- [ ] Create `src/data/events.js` — 12 events with: id, title, artist, genre, bannerUrl, thumbnailUrl, description, duration, ageRating, language, venueId, priceRange, availability, tags, aiInsight
- [ ] Create `src/data/venues.js` — 4 venues with: id, name, address, city, mapImageUrl, transportInfo, seatConfig (rows, columns, tier layout)
- [ ] Create `src/data/showtimes.js` — 3–4 showtimes per event with: id, eventId, date, time, availableSeats, totalSeats
- [ ] Create `src/data/seats.js` — seating layout data for 2 venue types with: id, row, number, tier, price, status, x, y (SVG coordinates)

### T-004: Service layer
- [ ] Create `src/services/eventService.js`:
  - `getEvents(filters)` — returns filtered events array
  - `getEventById(id)` — returns single event
  - `searchEvents(query)` — returns filtered by title/artist
- [ ] Create `src/services/seatService.js`:
  - `getSeatsByVenue(venueId)` — returns seat array
  - `validateContiguous(seats)` — checks if selected seats are adjacent
  - `holdSeats(seatIds)` — marks seats as held (mock)
- [ ] Create `src/services/aiService.js`:
  - `getPersonalizedEvents(events, profile)` — returns re-ranked events
  - `getBestSeats(seats, budget)` — returns top 3 seat recommendations
  - `getSellOutPrediction(event)` — returns { daysLeft, label }
  - `getAddOnRecommendations(event)` — returns add-on array

### T-005: Zustand stores
- [ ] Create `src/store/useBookingStore.js` with state + actions as defined in architecture
- [ ] Create `src/store/useFilterStore.js` with filter state + actions
- [ ] Create `src/store/useUIStore.js` with: viewMode, activeModal, isLoading

### T-006: Router setup
- [ ] Create `src/App.jsx` with BrowserRouter and routes:
  - `/` → redirect to `/discover`
  - `/discover` → `<DiscoveryPage />`
  - `/event/:eventId` → `<EventDetailPage />`
  - `/event/:eventId/seats` → `<SeatSelectionPage />` (guard: requires selectedEvent)
  - `/booking/summary` → `<BookingSummaryPage />` (guard: requires selectedSeats)
- [ ] Implement route guard HOC: `src/components/layout/RouteGuard.jsx`

---

## EPIC 2: Shared Components

### T-007: Navbar
- [ ] Create `src/components/layout/Navbar.jsx`
  - Logo (itsmyscreen red square + wordmark, Syne font)
  - City selector dropdown
  - Progress indicator (step dots, only visible during booking flow)
  - Transparent on hero pages, solid on booking pages

### T-008: Shared UI atoms
- [ ] `src/components/shared/Button.jsx` — variants: primary (red fill), secondary (outline), ghost; sizes: sm, md, lg; loading state with spinner
- [ ] `src/components/shared/Badge.jsx` — variants for availability: available (green), fast-filling (amber), almost-full (orange), sold-out (red/muted); genre tags (outlined)
- [ ] `src/components/shared/Tooltip.jsx` — hover tooltip with portal rendering
- [ ] `src/components/shared/Timer.jsx` — countdown display: `MM:SS` format, turns red at < 2 minutes
- [ ] `src/components/shared/AvailabilityBadge.jsx` — wraps Badge with availability-specific logic

---

## EPIC 3: Discovery Page

### T-009: Event Card component
- [ ] Create `src/components/discovery/EventCard.jsx`
  - Grid variant: image top, info below (title, artist, venue, date, price range, availability badge)
  - List variant: image left, info right, wider layout
  - Hover state: subtle scale + glow on card border
  - Navigate to `/event/:id` on click

### T-010: Filter Panel
- [ ] Create `src/components/discovery/FilterPanel.jsx`
  - Genre: multi-select chip group (Pop, Rock, Classical, Electronic, Jazz, Hip-Hop, etc.)
  - Date: date range with two calendar inputs
  - Price: dual-handle range slider (₹0 – ₹10,000)
  - Venue: dropdown of available venues
  - "Reset Filters" link at bottom
  - Connects to `useFilterStore`

### T-011: Search Bar
- [ ] Create `src/components/discovery/SearchBar.jsx`
  - Controlled input with debounced (300ms) onChange handler
  - Autocomplete dropdown: shows top 5 event/artist matches
  - Keyboard navigation (↑↓ to navigate, Enter to select, Esc to close)
  - Connects to `useFilterStore`

### T-012: View Toggle
- [ ] Create `src/components/discovery/ViewToggle.jsx`
  - Two icon buttons: Grid (4 columns) | List
  - Active state highlight
  - Persists to `useFilterStore.viewMode`

### T-013: AI Recommended Banner
- [ ] Create `src/components/discovery/AIRecommendedBanner.jsx`
  - Horizontal scroll strip with heading "✨ Recommended for You"
  - Subtle gradient glow border (amber/red) around the strip container
  - Shows 4–5 event cards (compact variant with just image + title + badge)
  - "Why this?" tooltip on each card explaining the AI rationale (e.g., "Based on your past bookings")

### T-014: Discovery Page assembly
- [ ] Create `src/pages/DiscoveryPage.jsx`
  - Layout: sidebar (FilterPanel) + main content area
  - AI Banner strip at top of main content
  - Section heading: "All Events" with count + sort dropdown
  - Event grid/list (switches via viewMode)
  - Empty state: "No events match your filters" + reset button
  - Loading skeleton cards (3x4 grid of grey shimmer cards)

---

## EPIC 4: Event Detail Page

### T-015: Event Hero
- [ ] Create `src/components/event-detail/EventHero.jsx`
  - Full-bleed banner image (100vw, 480px height)
  - Gradient overlay (bottom 50%): transparent → `var(--color-bg-base)`
  - Event title (Syne, 48px), artist name, venue, date+time over the gradient
  - "Select Seats" CTA button (brand red, large) in hero
  - Sticky header on scroll: compact bar with event title + CTA

### T-016: Event Info tabs
- [ ] Create `src/components/event-detail/EventInfo.jsx`
  - Tab navigation: About | Lineup | Venue
  - About tab: collapsible description, key info chips (duration, language, age rating)
  - Lineup tab: list of artists with time slots
  - Venue tab: static map image + address + transport info chips

### T-017: Pricing Tiers table
- [ ] Create `src/components/event-detail/PricingTiers.jsx`
  - 3-column table: General | Premium | VIP
  - Each column: tier name, price, included perks, availability indicator
  - "Best Value" AI badge on the recommended tier (amber outlined badge)
  - Column highlighted on hover

### T-018: AI Insight Chip
- [ ] Create `src/components/event-detail/AIInsightChip.jsx`
  - Floating card below hero: fire emoji + text (e.g., "Selling fast — books out 3 days before on average")
  - Amber left border, subtle background, dark text
  - Uses `aiService.getSellOutPrediction(event)`
  - Optional "Don't miss it → Select Seats" link

### T-019: Event Detail Page assembly
- [ ] Create `src/pages/EventDetailPage.jsx`
  - Fetch event by `params.eventId` from eventService
  - Render: Navbar → EventHero → AIInsightChip → EventInfo → PricingTiers → sticky CTA bar
  - CTA navigates to `/event/:id/seats` and sets event in `useBookingStore`

---

## EPIC 5: Seat & Time Selection Page

### T-020: Showtime Selector
- [ ] Create `src/components/seat-selection/ShowtimeSelector.jsx`
  - Date tabs: horizontal scroll of date chips (e.g., "Apr 12 Sat", "Apr 13 Sun")
  - Active date highlighted (brand red underline)
  - Time slot grid below: button per available time, greyed out if soldout
  - On select: update `useBookingStore.selectedShowtime`

### T-021: Seat Count Picker
- [ ] Create `src/components/seat-selection/SeatCountPicker.jsx`
  - Label: "How many seats?"
  - Stepper: [−] [2] [+] with min 1, max 10
  - On change: clear previously selected seats from store + trigger AI suggestion

### T-022: SVG Seating Map
- [ ] Create `src/components/seat-selection/SeatingMap.jsx`
  - SVG canvas with defined viewBox
  - Render seat circles/rects per `seats` data array using `x, y` coordinates
  - Color each seat by tier + status (see seat states in PLAN.md)
  - `onClick(seat)`: if available → toggle selection; if unavailable → show tooltip
  - Show "STAGE" label at top of map
  - Zoom & pan: mouse wheel zoom + drag to pan (CSS transform)
  - AI suggested seats: pulsing gold ring animation (`@keyframes pulse`)
  - Seat tooltip on hover: "Row A, Seat 12 — ₹1,800 — General"

### T-023: Seat Legend
- [ ] Create `src/components/seat-selection/SeatLegend.jsx`
  - Fixed position at top-right of map area
  - Color swatches + labels: Available (VIP/Premium/General), Selected, Unavailable, AI Pick, Wheelchair

### T-024: AI Best Seats panel
- [ ] Create `src/components/seat-selection/AIBestSeats.jsx`
  - Panel below seat count picker
  - Label: "✨ AI Pick for your budget"
  - Shows 3 recommended seat groups with: tier, row, price per seat, total
  - "Apply" button: selects these seats in the store + highlights on map

### T-025: Price Summary Bar
- [ ] Create `src/components/seat-selection/PriceSummaryBar.jsx`
  - Fixed bottom bar (appears after first seat selected)
  - Shows: selected seat labels, tier, total price
  - Timer component (10-minute countdown)
  - "Proceed to Summary" CTA → navigates to `/booking/summary`
  - Disabled state: "Select at least 1 seat" if none selected

### T-026: Seat Selection Page assembly
- [ ] Create `src/pages/SeatSelectionPage.jsx`
  - Route guard: redirect if no selectedEvent in store
  - Layout: 2-column (left: ShowtimeSelector + SeatCountPicker + AIBestSeats; right: SeatingMap + SeatLegend)
  - Breadcrumb / step indicator at top (Step 2 of 3)
  - Load seats from `seatService.getSeatsByVenue(event.venueId)`
  - Wire all seat selection state through `useBookingStore`

---

## EPIC 6: Booking Summary Page

### T-027: Order Summary Card
- [ ] Create `src/components/booking-summary/OrderSummaryCard.jsx`
  - Event thumbnail (small), event name, date, time, venue
  - Seats: row + number list, tier, quantity
  - "Edit" link → navigate back to seat selection
  - Read-only display

### T-028: Price Breakdown
- [ ] Create `src/components/booking-summary/PriceBreakdown.jsx`
  - Line items: base price (per seat × count), booking fee (fixed ₹100/ticket), GST (18%), total
  - Bold total line with larger font
  - Updates if add-ons are added

### T-029: Attendee Form
- [ ] Create `src/components/booking-summary/AttendeeForm.jsx`
  - Fields: Full Name, Email, Phone Number
  - Inline validation: name (required), email (regex), phone (10 digits)
  - Real-time field-level error messages
  - Connects to `useBookingStore.attendeeInfo`

### T-030: Payment Selector
- [ ] Create `src/components/booking-summary/PaymentSelector.jsx`
  - Tabs: Card | UPI | Wallet
  - Card tab: Card Number (masked input), Expiry MM/YY, CVV, Name on Card
  - UPI tab: UPI ID input field
  - Wallet tab: Paytm / PhonePe / Amazon Pay option list
  - All mocked — no real validation needed except format checks

### T-031: AI Add-on Strip
- [ ] Create `src/components/booking-summary/AIAddOnStrip.jsx`
  - Horizontal strip of 2–3 add-on cards
  - Each card: icon, name, price, "+ Add" button
  - Examples: 🅿 Parking Pass (₹200), 👕 Merchandise Bundle (₹500), 📸 Photo Pass (₹350)
  - On add: append to order total in PriceBreakdown

### T-032: Confirmation Modal
- [ ] Create `src/components/booking-summary/ConfirmationModal.jsx`
  - Full-screen overlay with success animation (Framer Motion: scale in + confetti dots)
  - Booking ID displayed (auto-generated: `IMS-XXXXXXXX`)
  - Event summary (name, date, seats)
  - "Download Ticket" CTA (mocked — triggers browser print)
  - "Browse More Events" link → navigate to /discover + resetBooking()

### T-033: Booking Summary Page assembly
- [ ] Create `src/pages/BookingSummaryPage.jsx`
  - Route guard: redirect if no selectedSeats in store
  - Layout: 2-column (left: OrderSummaryCard + PriceBreakdown; right: AttendeeForm + PaymentSelector + AIAddOnStrip)
  - Step indicator at top (Step 3 of 3)
  - "Pay Now" button: disabled until form valid + payment method selected
  - On submit: show ConfirmationModal, reset booking store

---

## EPIC 7: Animations & Polish

### T-034: Page transitions
- [ ] Wrap each Page component with `<AnimatePresence>` + `<motion.div>` for fade-slide-in transitions between routes

### T-035: Seat map animations
- [ ] Pulsing gold ring on AI-suggested seats using CSS `@keyframes`
- [ ] Seat click: scale bounce (0.8 → 1.1 → 1.0) using Framer Motion

### T-036: Card hover effects
- [ ] Event cards: `translateY(-4px)` + subtle glow shadow on hover
- [ ] Pricing tier columns: background tint change on hover

### T-037: Loading states
- [ ] Skeleton shimmer for event cards on Discovery page
- [ ] Skeleton for Event Detail hero
- [ ] Spinner overlay on Pay Now submission

### T-038: Error states
- [ ] Discovery: empty state illustration + "Reset Filters" CTA
- [ ] Seat map: "This showtime is sold out" full-map overlay
- [ ] Booking: form submission error toast notification (top-right, auto-dismiss 4s)

---

## EPIC 8: Accessibility & QA

### T-039: Keyboard navigation
- [ ] All interactive elements reachable via Tab
- [ ] Seat map: arrow keys move focus between seats, Space to select
- [ ] Dropdown/autocomplete: keyboard navigable

### T-040: ARIA labels
- [ ] Add `aria-label` to icon-only buttons
- [ ] Add `role="status"` to availability badges
- [ ] Add `aria-selected` to seat map items
- [ ] Add `aria-live="polite"` to price summary bar

### T-041: Color contrast check
- [ ] All text on dark backgrounds meets WCAG AA (4.5:1 ratio minimum)
- [ ] Seat states not relying on color alone (add shape/icon differentiation)

### T-042: Cross-browser testing
- [ ] Chrome 100+ ✓
- [ ] Firefox 100+ ✓
- [ ] Safari 15+ ✓
- [ ] Edge 100+ ✓

---

## EPIC 9: Documentation & Handoff

### T-043: README
- [ ] Project overview
- [ ] Setup instructions (`npm install`, `npm run dev`)
- [ ] Folder structure explanation
- [ ] Design decisions summary
- [ ] Assumptions log

### T-044: Design notes in code
- [ ] JSDoc comments on all service functions
- [ ] Comment blocks above each component explaining its purpose and props