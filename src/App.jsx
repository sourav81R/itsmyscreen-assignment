import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import RouteGuard from './components/layout/RouteGuard';
import Toast from './components/shared/Toast';
import BookingSummaryPage from './pages/BookingSummaryPage';
import DiscoveryPage from './pages/DiscoveryPage';
import EventDetailPage from './pages/EventDetailPage';
import SeatSelectionPage from './pages/SeatSelectionPage';
import { useBookingStore } from './store/useBookingStore';
import { useUIStore } from './store/useUIStore';

function App() {
  const location = useLocation();
  const [city, setCity] = useState('Mumbai');
  const selectedEvent = useBookingStore((state) => state.selectedEvent);
  const selectedSeats = useBookingStore((state) => state.selectedSeats);
  const toast = useUIStore((state) => state.toast);
  const clearToast = useUIStore((state) => state.clearToast);

  return (
    <div className="min-h-screen bg-[var(--color-bg-base)] text-[var(--color-text-primary)]">
      <Navbar city={city} onCityChange={setCity} />
      {toast ? <Toast message={toast.message} onClose={clearToast} /> : null}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Navigate to="/discover" replace />} />
          <Route path="/discover" element={<DiscoveryPage city={city} />} />
          <Route path="/event/:eventId" element={<EventDetailPage />} />
          <Route
            path="/event/:eventId/seats"
            element={
              <RouteGuard canAccess={Boolean(selectedEvent)}>
                <SeatSelectionPage />
              </RouteGuard>
            }
          />
          <Route
            path="/booking/summary"
            element={
              <RouteGuard canAccess={Boolean(selectedEvent) && selectedSeats.length > 0}>
                <BookingSummaryPage />
              </RouteGuard>
            }
          />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;
