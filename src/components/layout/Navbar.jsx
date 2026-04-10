import PropTypes from 'prop-types';
import { MapPin } from 'lucide-react';
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
  const isHeroPage = location.pathname.startsWith('/event/') && !location.pathname.endsWith('/seats');
  const inFlow = location.pathname.includes('/event/') || location.pathname.includes('/booking/');

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

          <label className="flex items-center gap-3 rounded-full border border-[var(--color-border-subtle)] bg-[rgba(255,255,255,0.04)] px-4 py-2 text-sm text-[var(--color-text-secondary)]">
            <MapPin className="h-4 w-4 text-[var(--color-brand-accent)]" aria-hidden="true" />
            <span className="sr-only">Select city</span>
            <select
              value={city}
              onChange={(event) => onCityChange(event.target.value)}
              className="bg-transparent text-[var(--color-text-primary)] outline-none"
            >
              {cities.map((option) => (
                <option key={option} value={option} className="bg-[var(--color-bg-surface)]">
                  {option}
                </option>
              ))}
            </select>
          </label>
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
