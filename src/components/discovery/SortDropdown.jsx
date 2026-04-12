import { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { AnimatePresence, motion } from 'framer-motion';
import { Banknote, BarChart3, CalendarDays, Check, ChevronDown, Sparkles } from 'lucide-react';

const sortOptions = [
  {
    value: 'recommended',
    label: 'Recommended',
    description: 'Best overall fit based on premium picks and audience taste signals.',
    chip: 'Best match',
    icon: Sparkles,
  },
  {
    value: 'date',
    label: 'Date',
    description: 'Bring the soonest shows to the top so planning feels quicker.',
    chip: 'Soonest first',
    icon: CalendarDays,
  },
  {
    value: 'price',
    label: 'Price',
    description: 'Scan lower starting prices first when budget matters most.',
    chip: 'Lowest first',
    icon: Banknote,
  },
  {
    value: 'popularity',
    label: 'Popularity',
    description: 'Surface the busiest, fastest-moving events at a glance.',
    chip: 'Trending',
    icon: BarChart3,
  },
];

/**
 * Custom discovery sort selector with keyboard support and editorial styling.
 * Props: value, onChange, className.
 */
function SortDropdown({ value, onChange, className }) {
  const containerRef = useRef(null);
  const triggerRef = useRef(null);
  const optionRefs = useRef([]);
  const selectedIndex = Math.max(
    0,
    sortOptions.findIndex((option) => option.value === value),
  );
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(selectedIndex);

  const selectedOption = useMemo(() => sortOptions[selectedIndex] ?? sortOptions[0], [selectedIndex]);

  useEffect(() => {
    setActiveIndex(selectedIndex);
  }, [selectedIndex]);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handlePointerDown = (event) => {
      if (!containerRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      optionRefs.current[activeIndex]?.focus();
    }
  }, [activeIndex, open]);

  const openMenu = (index = selectedIndex) => {
    setActiveIndex(index);
    setOpen(true);
  };

  const closeMenu = () => {
    setOpen(false);
    window.requestAnimationFrame(() => triggerRef.current?.focus());
  };

  const selectOption = (nextValue) => {
    onChange(nextValue);
    closeMenu();
  };

  const handleTriggerKeyDown = (event) => {
    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openMenu(selectedIndex);
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      openMenu(sortOptions.length - 1);
    }
  };

  const handleOptionKeyDown = (event, index, nextValue) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((index + 1) % sortOptions.length);
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((index - 1 + sortOptions.length) % sortOptions.length);
    }

    if (event.key === 'Home') {
      event.preventDefault();
      setActiveIndex(0);
    }

    if (event.key === 'End') {
      event.preventDefault();
      setActiveIndex(sortOptions.length - 1);
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      selectOption(nextValue);
    }

    if (event.key === 'Tab') {
      setOpen(false);
    }
  };

  const SelectedIcon = selectedOption.icon;

  return (
    <div ref={containerRef} className={`relative w-full shrink-0 md:w-auto ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Sort events by ${selectedOption.label}`}
        onClick={() => (open ? closeMenu() : openMenu())}
        onKeyDown={handleTriggerKeyDown}
        className={`group flex w-full min-w-0 items-center gap-3 rounded-[20px] border px-3 py-2.5 text-left transition duration-200 xs:px-3.5 xs:py-3 md:min-w-[290px] md:rounded-[22px] ${
          open
            ? 'border-[rgba(255,190,92,0.34)] bg-[linear-gradient(135deg,rgba(255,149,0,0.16),rgba(255,255,255,0.05))] shadow-[0_20px_44px_rgba(255,149,0,0.12)]'
            : 'border-[rgba(255,149,0,0.14)] bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.025))] hover:-translate-y-0.5 hover:border-[rgba(255,190,92,0.26)] hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))]'
        }`}
      >
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[13px] border border-[rgba(255,149,0,0.16)] bg-[linear-gradient(180deg,rgba(255,149,0,0.18),rgba(255,149,0,0.06))] text-[var(--color-brand-accent)] shadow-[0_10px_24px_rgba(255,149,0,0.08)] xs:h-10 xs:w-10 xs:rounded-[14px]">
          <SelectedIcon className="h-4 w-4 xs:h-[18px] xs:w-[18px]" aria-hidden="true" />
        </span>

        <span className="min-w-0 flex-1">
          <span className="block text-[9px] uppercase tracking-[0.22em] text-[var(--color-text-muted)]">Sort results</span>
          <span className="mt-0.5 block text-[14px] font-medium text-[var(--color-text-primary)] xs:text-[15px]">
            {selectedOption.label}
          </span>
          <span className="mt-0.5 hidden truncate text-[12px] text-[var(--color-text-secondary)] sm:block">
            {selectedOption.description}
          </span>
        </span>

        <span className="hidden rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-2.5 py-1 text-[9px] uppercase tracking-[0.16em] text-[var(--color-text-muted)] xl:inline-flex">
          {selectedOption.chip}
        </span>

        <ChevronDown
          className={`h-4 w-4 shrink-0 text-[var(--color-text-secondary)] transition duration-200 ${
            open ? 'rotate-180 text-[var(--color-brand-accent)]' : 'group-hover:text-[var(--color-text-primary)]'
          }`}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.985 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute inset-x-0 top-[calc(100%+12px)] z-30 overflow-hidden rounded-[22px] border border-[rgba(255,190,92,0.2)] bg-[linear-gradient(180deg,rgba(24,24,36,0.98),rgba(13,13,22,0.98))] shadow-[0_24px_52px_rgba(0,0,0,0.34),0_0_0_1px_rgba(255,149,0,0.06)] backdrop-blur-xl sm:left-auto sm:right-0 sm:w-[320px] sm:rounded-[24px]"
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-[radial-gradient(circle_at_top,rgba(255,149,0,0.16),transparent_72%)]" />

            <div className="relative p-2">
              <div className="rounded-[18px] border border-[rgba(255,149,0,0.12)] bg-[rgba(255,255,255,0.025)] px-3.5 py-2.5">
                <p className="text-[9px] uppercase tracking-[0.2em] text-[var(--color-text-muted)]">Sort playlist</p>
                <p className="mt-1 text-[13px] font-medium leading-snug text-[var(--color-text-primary)]">Choose how the lineup is ordered</p>
                <p className="mt-1 hidden text-[12px] leading-relaxed text-[var(--color-text-secondary)] sm:block">
                  Every option updates the event rail instantly, so it is easy to compare what matters most.
                </p>
              </div>

              <div role="listbox" aria-label="Sort events" className="mt-2 space-y-1">
                {sortOptions.map((option, index) => {
                  const selected = option.value === value;
                  const Icon = option.icon;

                  return (
                    <button
                      key={option.value}
                      ref={(element) => {
                        optionRefs.current[index] = element;
                      }}
                      type="button"
                      role="option"
                      tabIndex={0}
                      aria-selected={selected}
                      onClick={() => selectOption(option.value)}
                      onMouseEnter={() => setActiveIndex(index)}
                      onKeyDown={(event) => handleOptionKeyDown(event, index, option.value)}
                      className={`flex w-full items-center gap-3 rounded-[16px] border px-3 py-2.5 text-left transition duration-200 ${
                        selected
                          ? 'border-[rgba(255,190,92,0.24)] bg-[linear-gradient(135deg,rgba(255,149,0,0.22),rgba(255,59,48,0.14))] text-[var(--color-text-primary)] shadow-[0_12px_30px_rgba(255,149,0,0.1)]'
                          : activeIndex === index
                            ? 'border-[rgba(255,149,0,0.16)] bg-[rgba(255,255,255,0.05)] text-[var(--color-text-primary)]'
                            : 'border-transparent text-[var(--color-text-secondary)] hover:border-[rgba(255,149,0,0.12)] hover:bg-[rgba(255,255,255,0.04)] hover:text-[var(--color-text-primary)]'
                      }`}
                    >
                      <span
                        className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px] border ${
                          selected
                            ? 'border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.08)] text-[var(--color-brand-accent)]'
                            : 'border-[rgba(255,149,0,0.12)] bg-[rgba(255,255,255,0.03)] text-[var(--color-text-secondary)]'
                        }`}
                      >
                        <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2">
                          <span className="text-[14px] font-medium">{option.label}</span>
                          <span className="hidden rounded-full border border-[rgba(255,255,255,0.08)] px-2 py-1 text-[9px] uppercase tracking-[0.16em] text-[var(--color-text-muted)] sm:inline-flex">
                            {option.chip}
                          </span>
                        </span>
                        <span className="mt-0.5 block text-[12px] leading-relaxed text-[var(--color-text-secondary)]">
                          {option.description}
                        </span>
                      </span>

                      {selected ? (
                        <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[rgba(255,255,255,0.08)] text-[var(--color-brand-accent)]">
                          <Check className="h-3.5 w-3.5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

SortDropdown.propTypes = {
  value: PropTypes.oneOf(sortOptions.map((option) => option.value)).isRequired,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
};

SortDropdown.defaultProps = {
  className: '',
};

export default SortDropdown;
