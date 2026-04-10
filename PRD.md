# Product Requirements Document (PRD)
## itsmyscreen — Concert & Live Event Booking Platform
**Version:** 1.0  
**Owner:** UI/UX Design Team  
**Status:** Draft  
**Date:** April 2026

---

## 1. Executive Summary

itsmyscreen is a desktop-first concert and live event booking platform that enables users to discover events, explore detailed information, select seats and showtimes, and complete bookings — with AI-powered assistance integrated meaningfully throughout the journey to help users make confident decisions faster.

---

## 2. Problem Statement

Booking tickets for live events is cognitively demanding:
- Event listings are often overwhelming with little personalization.
- Seat selection interfaces are cluttered and hard to parse.
- Users lack intelligent guidance during decision-making (e.g., "Which seats give the best view for this price?").
- Booking flows have too many steps, leading to drop-offs.

**Goal:** Design and build a streamlined, AI-assisted 4-screen booking journey that reduces friction and increases user confidence.

---

## 3. Target Users

| Persona | Description |
|---|---|
| Casual concert-goer | Browses events opportunistically, needs discovery nudges |
| Planner | Knows the event, wants optimal seat selection assistance |
| Group buyer | Booking 3–8 tickets together, needs contiguous seat logic |
| Last-minute buyer | Time-sensitive, needs fast path to checkout |

---

## 4. Scope — 4 Core Screens

### Screen 1: Event Discovery (Browse/List View)
- Location-aware event listing
- Filter by: genre, date range, price range, venue
- AI Assist: Personalized "For You" section based on browsing/purchase history
- Event cards: thumbnail, name, artist, venue, date, price range, availability badge
- View toggle: Grid / List
- Search bar with autocomplete

### Screen 2: Event Detail Screen
- Hero section: event banner, artist/event name, date, time, venue
- About section: description, lineup, language, duration, age rating
- Venue info: map embed, transport options
- Pricing tiers overview
- AI Assist: "Best Value Seats" recommendation chip, crowd insights ("This event usually sells out 3 days before")
- CTA: "Select Seats" button

### Screen 3: Seat & Time Selection Screen
- Showtime selector: date tabs + time slot grid
- Interactive venue/seating map:
  - Color-coded by tier (VIP, Premium, General)
  - Seat states: Available, Selected, Unavailable/Sold, Wheelchair accessible
  - Zoom & pan on map
- Seat count picker
- AI Assist: "Best Seats for Budget" auto-suggest, contiguous seat finder for groups
- Price breakdown per tier (live update on hover/select)
- Error states: sold-out notice, max seat limit warning

### Screen 4: Booking Summary Screen
- Order summary: event name, date, time, venue, seats selected, tier, quantity
- Pricing breakdown: base price, booking fee, taxes, total
- Attendee info form: name, email, phone
- Payment section (card / UPI / wallet options)
- AI Assist: "Recommended add-ons" (parking pass, merchandise)
- Confirmation CTA
- Cancellation/refund policy note

---

## 5. AI Integration Requirements

| Screen | AI Feature | Purpose |
|---|---|---|
| Discovery | Personalized event ranking | Surface relevant events first |
| Discovery | "Trending near you" | Social proof & urgency |
| Detail | Crowd insights & sell-out prediction | Nudge timely decision |
| Detail | Best value seat chip | Reduce analysis paralysis |
| Seat Selection | Auto-suggest contiguous seats | Ease group booking |
| Seat Selection | "Best for your budget" highlight | Decision confidence |
| Summary | Smart add-on recommendations | Upsell contextually |

---

## 6. Functional Requirements

### FR-01: Event Discovery
- [ ] Display paginated list of events (20 per page)
- [ ] Filter panel: Genre (multi-select), Date (calendar range), Price (slider), Venue (dropdown)
- [ ] Search with debounced autocomplete (300ms)
- [ ] Grid / List view toggle with state persistence
- [ ] Availability badge: "Fast Filling", "Almost Full", "Available", "Sold Out"
- [ ] Location detection or manual city selector

### FR-02: Event Detail
- [ ] Sticky CTA bar on scroll
- [ ] Expandable description (show more / less)
- [ ] Image gallery (hero + thumbnails)
- [ ] Venue map (static embed)
- [ ] Showtime listing with quick-select

### FR-03: Seat & Time Selection
- [ ] SVG-based interactive seating map
- [ ] Seat state management: available / selected / unavailable
- [ ] Multi-seat selection (up to 10)
- [ ] Contiguous seat validation
- [ ] Real-time price update on seat selection
- [ ] Tier legend always visible
- [ ] Timer: 10-minute hold timer once seats are selected

### FR-04: Booking Summary
- [ ] Editable seat selection (back navigation)
- [ ] Form validation (email format, phone 10-digit)
- [ ] Order total calculation (live)
- [ ] Payment method selection
- [ ] Booking confirmation: success state with booking ID

---

## 7. Non-Functional Requirements

| Area | Requirement |
|---|---|
| Performance | Page load < 2s, seat map interactions < 100ms |
| Accessibility | WCAG 2.1 AA compliance, keyboard navigation, screen reader support |
| Responsiveness | Desktop-first (1280px+), graceful at 1024px |
| Browser Support | Chrome 100+, Firefox 100+, Safari 15+, Edge 100+ |
| Design System | Consistent tokens: colors, spacing (8px grid), typography scale |

---

## 8. Out of Scope (v1)

- Mobile / tablet views
- User authentication & account management
- Actual payment gateway integration
- Post-booking email/SMS notifications
- Admin/organizer dashboard

---

## 9. Success Metrics

| Metric | Target |
|---|---|
| Seat selection completion rate | > 80% of users who open map complete selection |
| Booking funnel drop-off | < 20% between seat selection and summary |
| AI chip interaction rate | > 30% of users click AI suggestions |
| Task completion time (discovery → confirmation) | < 4 minutes |

---

## 10. Assumptions

1. Event data (names, venues, pricing) is seeded/mocked for prototype.
2. Seating maps are SVG-based custom layouts, not third-party integrations.
3. Payment is mocked — no real transaction processing in v1.
4. AI features use rule-based logic for prototype; production would use ML models.
5. Users are assumed to be logged in (no auth flow in scope).