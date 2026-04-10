# itsmyscreen

itsmyscreen is a React 18 + Vite single-page prototype for a premium concert booking flow. The experience is built around four screens:

- Discovery
- Event detail
- Seat and showtime selection
- Booking summary with confirmation

## Stack

- React 18
- Vite
- React Router v6
- Zustand
- Tailwind CSS
- Framer Motion
- Lucide React
- PropTypes

## Setup

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
```

## Flow

1. Open `/discover` to browse and filter events.
2. Select an event to view the editorial detail page.
3. Move into seat selection to choose a showtime and seats.
4. Complete attendee and payment details in `/booking/summary`.
5. Confirm the booking and download the ticket from the success modal.

## Folder Structure

```text
src/
  components/
    booking-summary/
    discovery/
    event-detail/
    layout/
    seat-selection/
    shared/
  data/
  hooks/
  pages/
  services/
  store/
  styles/
  utils/
```

## Design Decisions

- The app uses a dark luxury editorial palette defined in `src/styles/tokens.css`.
- Discovery uses an AI-ranked recommendation strip and a persistent left filter rail.
- Seat selection uses a custom SVG fan-layout map with keyboard navigation, zoom, pan, and AI suggestions.
- The booking summary keeps validation inline and treats payment as a mocked frontend-only flow.

## Assumptions

- All event, venue, showtime, and seat data is mocked locally.
- The 10-minute seat hold timer is frontend-only and not server-reserved.
- Payment methods are simulated and do not call any gateway.
- The city selector is a manual browsing context and does not use geolocation.
