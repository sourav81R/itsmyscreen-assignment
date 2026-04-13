import { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Check, ChevronDown, MapPin } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useIsMobile, useIsTablet } from '../../hooks/useMediaQuery';
import { useBookingStore } from '../../store/useBookingStore';
import { useUIStore } from '../../store/useUIStore';

const cities = ['Mumbai', 'Delhi', 'Bengaluru', 'Chennai'];

const steps = [
  { label: 'Discover', matcher: '/discover' },
  { label: 'Seats', matcher: '/seats' },
  { label: 'Summary', matcher: '/booking/summary' },
];

function StepIndicator({ pathname, compact, className }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {steps.map((step, index) => {
        const active =
          pathname === step.matcher ||
          (step.matcher === '/seats' && pathname.endsWith('/seats')) ||
          (step.matcher === '/booking/summary' && pathname === '/booking/summary');

        return (
          <div key={step.label} className="flex items-center gap-3 text-xs uppercase tracking-[0.18em]">
            <span
              className={`inline-flex h-2.5 w-2.5 rounded-full ${
                active ? 'bg-[var(--color-brand-primary)] shadow-[0_0_18px_rgba(255,59,48,0.85)]' : 'bg-[var(--color-border-strong)]'
              }`}
            />
            <span
              className={`${compact ? 'hidden lg:inline' : ''} ${
                active ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-muted)]'
              }`}
            >
              {step.label}
            </span>
            {index < steps.length - 1 ? (
              <span className={`${compact ? 'w-5 md:w-7' : 'w-8'} h-px bg-[var(--color-border-subtle)]`} aria-hidden="true" />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

StepIndicator.propTypes = {
  pathname: PropTypes.string.isRequired,
  compact: PropTypes.bool,
  className: PropTypes.string,
};

StepIndicator.defaultProps = {
  compact: false,
  className: '',
};

function CitySelector({ city, onCityChange, menuOpen, onToggle, onClose, menuRef, className }) {
  return (
    <div ref={menuRef} className={`relative ${className}`}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={menuOpen}
        onClick={onToggle}
        className={`group flex items-center gap-3 rounded-full border px-4 py-2.5 text-sm transition duration-200 ${
          menuOpen
            ? 'border-[rgba(255,190,92,0.34)] bg-[linear-gradient(135deg,rgba(255,149,0,0.12),rgba(255,255,255,0.04))] shadow-[0_14px_30px_rgba(255,149,0,0.12)]'
            : 'border-[var(--color-border-subtle)] bg-[rgba(255,255,255,0.04)]'
        }`}
      >
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[rgba(255,149,0,0.14)] bg-[rgba(255,149,0,0.08)]">
          <MapPin className="h-4 w-4 text-[var(--color-brand-accent)]" aria-hidden="true" />
        </span>
        <span className="min-w-0 text-left">
          <span className="block text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
            City
          </span>
          <span className="block truncate font-medium text-[var(--color-text-primary)]">{city}</span>
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-[var(--color-text-secondary)] transition duration-200 ${
            menuOpen ? 'rotate-180 text-[var(--color-brand-accent)]' : 'group-hover:text-[var(--color-text-primary)]'
          }`}
          aria-hidden="true"
        />
      </button>

      {menuOpen ? (
        <div className="absolute right-0 top-[calc(100%+12px)] z-50 w-[220px] overflow-hidden rounded-[24px] border border-[rgba(255,190,92,0.24)] bg-[linear-gradient(180deg,rgba(24,24,36,0.98),rgba(13,13,22,0.98))] p-2 shadow-[0_24px_60px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,149,0,0.08)] backdrop-blur-xl">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-[radial-gradient(circle_at_top,rgba(255,149,0,0.16),transparent_70%)]" />
          <div className="relative">
            <p className="px-3 pb-2 pt-1 text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
              Choose your city
            </p>
            <div role="listbox" aria-label="Select city" className="space-y-1">
              {cities.map((option) => {
                const selected = option === city;

                return (
                  <button
                    key={option}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onClick={() => {
                      onCityChange(option);
                      onClose();
                    }}
                    className={`flex w-full items-center justify-between rounded-[18px] px-3 py-3 text-left transition duration-200 ${
                      selected
                        ? 'bg-[linear-gradient(135deg,rgba(255,149,0,0.2),rgba(255,59,48,0.16))] text-[var(--color-text-primary)] shadow-[0_12px_26px_rgba(255,149,0,0.12)]'
                        : 'text-[var(--color-text-secondary)] hover:bg-[rgba(255,255,255,0.04)] hover:text-[var(--color-text-primary)]'
                    }`}
                  >
                    <span className="font-medium">{option}</span>
                    {selected ? (
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[rgba(255,255,255,0.08)] text-[var(--color-brand-accent)]">
                        <Check className="h-4 w-4" aria-hidden="true" />
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

CitySelector.propTypes = {
  city: PropTypes.string.isRequired,
  onCityChange: PropTypes.func.isRequired,
  menuOpen: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  menuRef: PropTypes.shape({ current: PropTypes.any }),
  className: PropTypes.string,
};

CitySelector.defaultProps = {
  menuRef: null,
  className: '',
};

function MobileMenuButton({ open, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Toggle menu"
      aria-expanded={open}
      className="inline-flex items-center justify-center rounded-full border border-[var(--color-border-subtle)] bg-[rgba(255,255,255,0.04)] p-[10px] md:hidden"
      style={{ background: 'none', cursor: 'pointer' }}
    >
      <svg width="20" height="14" viewBox="0 0 20 14" fill="none" aria-hidden="true">
        <rect y="0" width="20" height="2" rx="1" fill="#F5F5F7" />
        <rect y="6" width="20" height="2" rx="1" fill="#F5F5F7" />
        <rect y="12" width="20" height="2" rx="1" fill="#F5F5F7" />
      </svg>
    </button>
  );
}

MobileMenuButton.propTypes = {
  open: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

function Navbar({ city, onCityChange }) {
  const location = useLocation();
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const selectedEvent = useBookingStore((state) => state.selectedEvent);
  const selectedSeats = useBookingStore((state) => state.selectedSeats);
  const isMobileMenuOpen = useUIStore((state) => state.isMobileMenuOpen);
  const toggleMobileMenu = useUIStore((state) => state.toggleMobileMenu);
  const closeMobileMenu = useUIStore((state) => state.closeMobileMenu);
  const showToast = useUIStore((state) => state.showToast);
  const [cityMenuOpen, setCityMenuOpen] = useState(false);
  const cityMenuRef = useRef(null);
  const headerRef = useRef(null);
  const isHeroPage = location.pathname.startsWith('/event/') && !location.pathname.endsWith('/seats');
  const inFlow = location.pathname.includes('/event/') || location.pathname.includes('/booking/');

  const mobileLinks = useMemo(
    () => [
      { label: 'Discover', to: '/discover', enabled: true },
      {
        label: 'Seats',
        to: selectedEvent ? `/event/${selectedEvent.id}/seats` : '',
        enabled: Boolean(selectedEvent),
        lockedMessage: 'Choose an event before opening seats.',
      },
      {
        label: 'Summary',
        to: selectedEvent && selectedSeats.length > 0 ? '/booking/summary' : '',
        enabled: Boolean(selectedEvent) && selectedSeats.length > 0,
        lockedMessage: selectedEvent
          ? 'Select at least one seat to continue to summary.'
          : 'Choose an event before opening summary.',
      },
    ],
    [selectedEvent, selectedSeats.length],
  );

  const handleLockedMobileLink = (message) => {
    closeMobileMenu();
    showToast({ message });
  };

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setCityMenuOpen(false);
      closeMobileMenu();
    });

    return () => window.cancelAnimationFrame(frame);
  }, [closeMobileMenu, location.pathname]);

  useEffect(() => {
    if (!isMobile) {
      closeMobileMenu();
    }
  }, [closeMobileMenu, isMobile]);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!cityMenuRef.current?.contains(event.target)) {
        setCityMenuOpen(false);
      }

      if (isMobile && isMobileMenuOpen && !headerRef.current?.contains(event.target)) {
        closeMobileMenu();
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setCityMenuOpen(false);
        closeMobileMenu();
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [closeMobileMenu, isMobile, isMobileMenuOpen]);

  return (
    <header
      className={`sticky top-0 z-40 border-b ${
        isHeroPage
          ? 'border-transparent bg-[rgba(10,10,15,0.42)] backdrop-blur-xl'
          : 'border-[var(--color-border-subtle)] bg-[rgba(10,10,15,0.9)] backdrop-blur-xl'
      }`}
    >
      <div ref={headerRef} className="safe-top relative mx-auto max-w-[1440px] px-4 xs:px-5 md:px-6 lg:px-8">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-4 md:grid-cols-[auto_minmax(0,1fr)_auto] lg:flex lg:items-center lg:justify-between lg:gap-6 lg:py-5">
          <Link to="/discover" className="flex min-w-0 items-center gap-3">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-brand-primary)] text-lg font-bold text-white">
              i
            </span>
            <div className="min-w-0">
              <div className="truncate font-display text-xl tracking-[0.14em] text-[var(--color-text-primary)] xs:text-2xl xs:tracking-[0.18em]">
                itsmyscreen
              </div>
              <div className="truncate text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-muted)] xs:text-xs xs:tracking-[0.24em]">
                concert booking
              </div>
            </div>
          </Link>

          {isTablet && inFlow ? (
            <StepIndicator pathname={location.pathname} compact className="hidden justify-self-center md:flex lg:hidden" />
          ) : (
            <div className="hidden md:block lg:hidden" />
          )}

          <div className="flex items-center gap-4 lg:gap-6">
            <div className="hidden items-center gap-6 lg:flex">
              {inFlow ? <StepIndicator pathname={location.pathname} /> : null}
            </div>

            <CitySelector
              city={city}
              onCityChange={onCityChange}
              menuOpen={cityMenuOpen}
              onToggle={() => setCityMenuOpen((current) => !current)}
              onClose={() => setCityMenuOpen(false)}
              menuRef={cityMenuRef}
              className={`${isMobile ? 'hidden' : 'block'}`}
            />

            <MobileMenuButton open={isMobileMenuOpen} onClick={toggleMobileMenu} />
          </div>
        </div>

        {isMobile && inFlow ? (
          <div className="pb-4 md:hidden">
            <StepIndicator pathname={location.pathname} compact className="justify-center" />
          </div>
        ) : null}

        {isMobile && isMobileMenuOpen ? (
          <div className="absolute inset-x-0 top-full z-50 border-t border-[rgba(255,255,255,0.08)] bg-[rgba(10,10,15,0.96)] px-4 pb-4 pt-3 shadow-[0_18px_40px_rgba(0,0,0,0.28)] backdrop-blur-xl">
            <div className="space-y-3">
              <div className="flex flex-col gap-2">
                <span className="text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
                  Navigation
                </span>
                <div className="grid gap-2">
                  {mobileLinks.map((item) =>
                    item.enabled ? (
                      <Link
                        key={item.label}
                        to={item.to}
                        onClick={closeMobileMenu}
                        className="premium-chip rounded-[18px] px-4 py-3 text-sm text-[var(--color-text-primary)]"
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => handleLockedMobileLink(item.lockedMessage)}
                        className="rounded-[18px] border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] px-4 py-3 text-left text-sm text-[var(--color-text-muted)] transition duration-200 hover:border-[rgba(255,149,0,0.22)] hover:text-[var(--color-text-secondary)]"
                      >
                        {item.label}
                      </button>
                    ),
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-muted)]">City</span>
                <CitySelector
                  city={city}
                  onCityChange={onCityChange}
                  menuOpen={cityMenuOpen}
                  onToggle={() => setCityMenuOpen((current) => !current)}
                  onClose={() => setCityMenuOpen(false)}
                  menuRef={cityMenuRef}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}

Navbar.propTypes = {
  city: PropTypes.string.isRequired,
  onCityChange: PropTypes.func.isRequired,
};

export default Navbar;
