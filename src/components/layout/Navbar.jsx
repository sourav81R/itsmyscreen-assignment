import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Check, ChevronDown, MapPin } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const cities = ['Mumbai', 'Delhi', 'Bengaluru', 'Chennai'];

const steps = [
  { label: 'Discover', matcher: '/discover' },
  { label: 'Seats', matcher: '/seats' },
  { label: 'Summary', matcher: '/booking/summary' },
];

/**
 * App-wide navigation bar with logo, city selector, and booking flow progress.
 * Props: city, onCityChange.
 */
function Navbar({ city, onCityChange }) {
  const location = useLocation();
  const [cityMenuOpen, setCityMenuOpen] = useState(false);
  const cityMenuRef = useRef(null);
  const isHeroPage = location.pathname.startsWith('/event/') && !location.pathname.endsWith('/seats');
  const inFlow = location.pathname.includes('/event/') || location.pathname.includes('/booking/');

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!cityMenuRef.current?.contains(event.target)) {
        setCityMenuOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setCityMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 border-b ${
        isHeroPage
          ? 'border-transparent bg-[rgba(10,10,15,0.42)] backdrop-blur-xl'
          : 'border-[var(--color-border-subtle)] bg-[rgba(10,10,15,0.9)] backdrop-blur-xl'
      }`}
    >
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-6 px-8 py-5">
        <Link to="/discover" className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--color-brand-primary)] text-lg font-bold text-white">
            i
          </span>
          <div>
            <div className="font-display text-2xl tracking-[0.18em] text-[var(--color-text-primary)]">
              itsmyscreen
            </div>
            <div className="text-xs uppercase tracking-[0.24em] text-[var(--color-text-muted)]">
              concert booking
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-6">
          {inFlow ? (
            <div className="hidden items-center gap-3 xl:flex">
              {steps.map((step, index) => {
                const active =
                  location.pathname === step.matcher ||
                  (step.matcher === '/seats' && location.pathname.endsWith('/seats')) ||
                  (step.matcher === '/booking/summary' && location.pathname === '/booking/summary');

                return (
                  <div key={step.label} className="flex items-center gap-3 text-xs uppercase tracking-[0.18em]">
                    <span
                      className={`inline-flex h-2.5 w-2.5 rounded-full ${
                        active ? 'bg-[var(--color-brand-primary)] shadow-[0_0_18px_rgba(255,59,48,0.85)]' : 'bg-[var(--color-border-strong)]'
                      }`}
                    />
                    <span className={active ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-muted)]'}>
                      {step.label}
                    </span>
                    {index < steps.length - 1 ? (
                      <span className="h-px w-8 bg-[var(--color-border-subtle)]" aria-hidden="true" />
                    ) : null}
                  </div>
                );
              })}
            </div>
          ) : null}

          <div ref={cityMenuRef} className="relative">
            <button
              type="button"
              aria-haspopup="listbox"
              aria-expanded={cityMenuOpen}
              onClick={() => setCityMenuOpen((current) => !current)}
              className={`group flex items-center gap-3 rounded-full border px-4 py-2.5 text-sm transition duration-200 ${
                cityMenuOpen
                  ? 'border-[rgba(255,190,92,0.34)] bg-[linear-gradient(135deg,rgba(255,149,0,0.12),rgba(255,255,255,0.04))] shadow-[0_14px_30px_rgba(255,149,0,0.12)]'
                  : 'border-[var(--color-border-subtle)] bg-[rgba(255,255,255,0.04)]'
              }`}
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[rgba(255,149,0,0.14)] bg-[rgba(255,149,0,0.08)]">
                <MapPin className="h-4 w-4 text-[var(--color-brand-accent)]" aria-hidden="true" />
              </span>
              <span className="text-left">
                <span className="block text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
                  City
                </span>
                <span className="block font-medium text-[var(--color-text-primary)]">{city}</span>
              </span>
              <ChevronDown
                className={`h-4 w-4 text-[var(--color-text-secondary)] transition duration-200 ${
                  cityMenuOpen ? 'rotate-180 text-[var(--color-brand-accent)]' : 'group-hover:text-[var(--color-text-primary)]'
                }`}
                aria-hidden="true"
              />
            </button>

            {cityMenuOpen ? (
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
                            setCityMenuOpen(false);
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
        </div>
      </div>
    </header>
  );
}

Navbar.propTypes = {
  city: PropTypes.string.isRequired,
  onCityChange: PropTypes.func.isRequired,
};

export default Navbar;
