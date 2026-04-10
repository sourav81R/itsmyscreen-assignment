# Design & Build Plan
## itsmyscreen — Concert Booking Platform
**Version:** 1.0  
**Date:** April 2026

---

## 1. Project Philosophy

> "A booking experience that feels like discovering music itself — dark, electric, and alive."

The visual direction is **dark luxury editorial**: deep near-black backgrounds, electric brand red, crisp typography (Syne for display, DM Sans for body), and micro-interactions that reward curiosity. AI features are woven in as **contextual chips and tooltips** — never intrusive overlays.

---

## 2. Design Decisions Per Screen

---

### Screen 1: Event Discovery

**Design Decisions:**
- Dark-themed card grid with high-contrast event thumbnails creates a "concert poster wall" feeling.
- Left sidebar filter panel keeps screen real estate organized without tabs/accordions overhead.
- AI "For You" horizontal scroll strip sits above the main grid — distinguished by a subtle gradient glow border so users understand it's personalized.
- Availability badge uses color + text label (not color alone) for accessibility compliance.
- View toggle (grid/list) persists across sessions via localStorage.

**UX Decisions:**
- Search with 300ms debounce autocomplete prevents excessive re-renders.
- "Fast Filling" badge creates urgency without being deceptive — it's only shown when < 20% seats remain.
- Default sort: Recommended (AI-ranked) with user-switchable options: Date, Price, Popularity.
- Empty state: illustrated "No events found" with filter reset CTA.

**Wireframe Notes (Lo-Fi):**
```
┌──────────────────────────────────────────────────┐
│ [Logo]  [Search Bar                    ] [City ▾]│
├───────────┬──────────────────────────────────────┤
│ FILTERS   │  For You ──────── [scroll] ─────────▶│
│ Genre     │  ┌────┐ ┌────┐ ┌────┐               │
│ Date      │  │ AI │ │ AI │ │ AI │               │
│ Price     │  └────┘ └────┘ └────┘               │
│ Venue     │  ─────────────────────────────────── │
│           │  All Events        [Grid] [List]      │
│           │  ┌──┐ ┌──┐ ┌──┐  ┌──┐ ┌──┐ ┌──┐   │
│           │  │  │ │  │ │  │  │  │ │  │ │  │   │
│           │  └──┘ └──┘ └──┘  └──┘ └──┘ └──┘   │
└───────────┴──────────────────────────────────────┘
```

---

### Screen 2: Event Detail

**Design Decisions:**
- Full-bleed hero with artist image + gradient overlay at bottom for text legibility.
- Sticky top bar on scroll: compact event name + "Select Seats" CTA always accessible.
- Tabbed detail sections (About | Lineup | Venue) prevent information overload.
- AI Insight chip: amber-colored floating card below the hero — e.g., "🔥 Selling fast. Usually books out 3 days before."
- "Best Value" pricing chip: AI-highlighted tier recommendation in the pricing table.

**UX Decisions:**
- "Select Seats" CTA appears in 2 places: hero section + sticky bottom bar. Both scroll to the same action.
- Venue map is static embed with a "Get Directions" link — no interactive iframe for perf.
- Show full description only on "Show More" tap — default collapse at 3 lines.
- Pricing tiers table uses visual hierarchy: most popular tier gets visual emphasis.

**Wireframe Notes (Lo-Fi):**
```
┌──────────────────────────────────────────────────┐
│ [← Back]                                         │
│ ┌────────────── Hero Image ────────────────────┐ │
│ │                         Event Name           │ │
│ │                         Artist | Venue | Date│ │
│ │                         [Select Seats  CTA ] │ │
│ └──────────────────────────────────────────────┘ │
│ [🔥 AI Insight chip: "Usually sells out in 3d"] │
│ [About] [Lineup] [Venue]                         │
│ Description...                 [Venue Map]        │
│ Pricing Tiers:                                   │
│ General | Premium ★ Best Value | VIP             │
└──────────────────────────────────────────────────┘
```

---

### Screen 3: Seat & Time Selection

**Design Decisions:**
- 2-column layout: left = showtime + seat info panel; right = SVG seating map.
- Showtime selector as date tabs (horizontal scroll) + time slots grid below.
- Seating map color legend always pinned at top-right of the map.
- Selected seat summary bar at bottom of page updates live as seats are selected.
- 10-minute countdown timer appears after first seat is selected, driving urgency.
- AI "Best Seats" suggestion: a highlighted pulse animation on the 3 recommended seats.

**UX Decisions:**
- Users select number of seats first → map highlights contiguous available blocks.
- Clicking an unavailable seat shows a tooltip: "Seat A12 is already taken" not a generic error.
- Maximum 10 seats enforced with clear feedback: "You've reached the maximum of 10 seats."
- Wheelchair accessible seats are marked with ♿ icon and a dedicated filter toggle.
- On mobile (graceful degradation): map becomes scrollable/zoomable.

**Seat States:**
| State | Color | Label |
|---|---|---|
| Available | Tier color (blue/green/yellow) | — |
| Selected | Brand Red (#FF3B30) | ✓ |
| Unavailable | Dark grey (#2C2C3E) | — |
| AI Suggested | Pulsing gold ring | ✨ |
| Wheelchair | Tier color + ♿ | ♿ |

**Wireframe Notes (Lo-Fi):**
```
┌──────────────────────────────────────────────────┐
│ [← Event Detail]  Step 2 of 3: Select Seats      │
│  Event Name | Venue | Date                       │
├───────────────┬──────────────────────────────────┤
│ Showtime:     │    [Stage]                        │
│ [Apr 12][13]  │ ●●●●●●●●●●●●  VIP               │
│ [7:30][9:00]  │ ●●●●●●●●●●●●  Premium            │
│               │ ○○○●○●○●○●○●  General            │
│ Seats: [2 ▾] │                                  │
│               │ [Legend: ■Avail ■Sel ■Unavail]   │
│ AI Suggest:   │                                  │
│ [✨ Best for  │                                  │
│  ₹2000 budget]│                                  │
├───────────────┴──────────────────────────────────┤
│ Selected: A12, A13 | ₹3,800 | [⏱ 9:42] [Proceed]│
└──────────────────────────────────────────────────┘
```

---

### Screen 4: Booking Summary

**Design Decisions:**
- 2-column layout: left = order details; right = payment panel.
- Order details card is read-only with an "Edit" link to go back to seat selection.
- Price breakdown as an itemized receipt-style list: base price, booking fee, GST, total.
- Payment method tabs: Card | UPI | Wallet — tab switching doesn't lose entered data.
- AI add-on strip: contextual 2–3 cards (parking, merchandise) with one-tap add.
- Confirmation state: full-screen success animation with booking ID and download ticket CTA.

**UX Decisions:**
- Form validation is inline (field-level), not after submission.
- "Pay Now" button is disabled until form is valid — with a tooltip explaining why.
- Policy note (cancellation/refund) is collapsible at bottom — present but not intrusive.
- Booking ID is copyable with one click.

**Wireframe Notes (Lo-Fi):**
```
┌──────────────────────────────────────────────────┐
│ [← Seats]  Step 3 of 3: Booking Summary          │
├─────────────────────┬────────────────────────────┤
│ ORDER DETAILS       │ PAYMENT                    │
│ Event Name          │ [Card] [UPI] [Wallet]      │
│ Date | Time | Venue │ Card No: [____________]    │
│ Seat: A12, A13      │ Expiry: [__] CVV: [___]   │
│ General | 2 tickets │                            │
│ [Edit seats]        │ Name on card: [________]  │
│                     │                            │
│ PRICE BREAKDOWN     │ ─────────────────────────  │
│ 2 × ₹1,800 = ₹3,600│ Total: ₹4,200              │
│ Booking fee: ₹200   │ [    PAY NOW    ]          │
│ GST (18%): ₹400     │                            │
│ ─────────────────── │ AI Add-ons:               │
│ Total: ₹4,200       │ [🅿 Parking ₹200 +Add]    │
│                     │ [👕 Merch Bundle ₹500 +Add]│
└─────────────────────┴────────────────────────────┘
```

---

## 3. Phase Plan

### Phase 1 — Foundation (Days 1–2)
- Project scaffolding (Vite + React + Tailwind)
- Design token setup
- Routing structure
- Mock data creation (events, venues, seats, showtimes)
- Zustand store setup
- Shared components: Button, Badge, Navbar

### Phase 2 — Screen Implementation (Days 3–7)
- Day 3: Discovery Page (cards, filters, search, AI strip)
- Day 4: Event Detail Page (hero, info tabs, pricing, AI chip)
- Day 5–6: Seat Selection Page (showtime selector, SVG map, seat logic)
- Day 7: Booking Summary Page (form, payment, price breakdown, confirmation)

### Phase 3 — Polish & AI Features (Days 8–9)
- AI service integration (best seats, recommendations, insights)
- Animations (Framer Motion page transitions, seat pulse)
- Error states, empty states, loading states
- Accessibility audit (keyboard nav, ARIA labels)

### Phase 4 — Review & Handoff (Day 10)
- Cross-browser testing
- Design QA against wireframes
- Documentation update
- Final build

---

## 4. Assumptions Log

| # | Assumption | Impact |
|---|---|---|
| A1 | Users are pre-authenticated | No login screen needed |
| A2 | Seating maps are unique per venue, SVG-designed manually | Dev time for SVG |
| A3 | AI features use rule-based heuristics, not real ML | Simpler service layer |
| A4 | Payment is mocked — no real gateway | No security concerns |
| A5 | All prices in INR | Currency formatting |
| A6 | Events data is static JSON | No API integration needed |
| A7 | Max 10 seats per booking | Enforced in seat service |
| A8 | 10-minute seat hold is frontend timer only (no backend reservation) | Timer is cosmetic |