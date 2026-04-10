import { useState } from 'react';
import PropTypes from 'prop-types';
import { Clock3, Languages, MapPin, ShieldCheck } from 'lucide-react';
import Button from '../shared/Button';

const tabs = ['About', 'Lineup', 'Venue'];

/**
 * Tabbed event information area covering about, lineup, and venue details.
 * Props: event.
 */
function EventInfo({ event }) {
  const [activeTab, setActiveTab] = useState('About');
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.45fr)_320px]">
      <div className="editorial-panel premium-panel rounded-[28px] bg-[linear-gradient(180deg,rgba(19,19,30,0.98),rgba(12,12,20,0.98))] p-6 lg:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-[var(--color-brand-accent)]">Event brief</p>
            <h2 className="mt-2.5 font-display text-3xl text-[var(--color-text-primary)]">Story, lineup, and venue feel</h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`premium-chip rounded-full px-4 py-2 text-sm transition ${
                  activeTab === tab
                    ? '!border-[rgba(255,149,0,0.34)] !bg-[linear-gradient(135deg,rgba(255,149,0,0.18),rgba(255,59,48,0.12))] text-[var(--color-text-primary)]'
                    : 'text-[var(--color-text-secondary)]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6">
          {activeTab === 'About' ? (
            <div>
              <p className={`max-w-4xl text-[15px] leading-7 text-[var(--color-text-secondary)] ${expanded ? '' : 'line-clamp-4'}`}>
                {event.description}
              </p>
              <button
                type="button"
                onClick={() => setExpanded((current) => !current)}
                className="premium-chip mt-5 rounded-full px-4 py-2 text-sm font-medium text-[var(--color-brand-accent)]"
              >
                {expanded ? 'Show less' : 'Show more'}
              </button>

              <div className="mt-6 grid gap-3 md:grid-cols-3">
                {[
                  { label: 'Duration', value: event.duration, icon: Clock3 },
                  { label: 'Language', value: event.language, icon: Languages },
                  { label: 'Age rating', value: event.ageRating, icon: ShieldCheck },
                ].map(({ label, value, icon: Icon }) => (
                  <div
                    key={label}
                    className="premium-panel rounded-[22px] bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.022))] p-4"
                  >
                    <span className="premium-chip inline-flex h-10 w-10 items-center justify-center rounded-[14px] text-[var(--color-brand-accent)]">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <p className="mt-4 text-xs uppercase tracking-[0.18em] text-[rgba(185,185,200,0.78)]">{label}</p>
                    <p className="mt-1.5 text-[1.05rem] font-medium text-[rgba(245,245,247,0.98)] [text-shadow:0_1px_10px_rgba(0,0,0,0.28)]">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {activeTab === 'Lineup' ? (
            <div className="space-y-3">
              {event.lineup.map((slot, index) => (
                <div
                  key={`${slot.name}-${slot.time}`}
                  className="premium-panel flex items-center justify-between rounded-[22px] bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))] px-4 py-3.5"
                >
                  <div className="flex items-center gap-4">
                    <span className="premium-chip inline-flex h-10 w-10 items-center justify-center rounded-[14px] text-sm font-medium text-[var(--color-brand-accent)]">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <p className="font-medium text-[var(--color-text-primary)]">{slot.name}</p>
                      <p className="text-sm text-[var(--color-text-secondary)]">Live set</p>
                    </div>
                  </div>
                  <p className="text-sm uppercase tracking-[0.18em] text-[var(--color-brand-accent)]">{slot.time}</p>
                </div>
              ))}
            </div>
          ) : null}

          {activeTab === 'Venue' ? (
            <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="premium-panel overflow-hidden rounded-[24px]">
                <img
                  src={event.venue.mapImageUrl}
                  alt={`${event.venue.name} venue map preview`}
                  className="h-[270px] w-full rounded-[24px] object-cover transition duration-700 hover:scale-[1.03]"
                />
              </div>

              <div className="premium-panel rounded-[24px] bg-[linear-gradient(180deg,rgba(255,255,255,0.025),rgba(255,255,255,0.01))] p-5">
                <span className="premium-chip inline-flex h-10 w-10 items-center justify-center rounded-[14px] text-[var(--color-brand-accent)]">
                  <MapPin className="h-5 w-5" aria-hidden="true" />
                </span>
                <p className="mt-4 text-xs uppercase tracking-[0.18em] text-[var(--color-text-muted)]">Address</p>
                <p className="mt-2 text-base leading-7 text-[var(--color-text-primary)]">{event.venue.address}</p>

                <div className="mt-5 flex flex-wrap gap-3">
                  {event.venue.transportInfo.map((item) => (
                    <span
                      key={item}
                      className="premium-chip rounded-full px-4 py-2 text-sm text-[var(--color-text-secondary)]"
                    >
                      {item}
                    </span>
                  ))}
                </div>

                <Button className="mt-6" size="sm" variant="secondary">
                  Get Directions
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <aside className="editorial-panel premium-panel rounded-[28px] bg-[linear-gradient(180deg,rgba(19,19,30,0.98),rgba(12,12,20,0.98))] p-6 lg:sticky lg:top-[134px]">
        <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--color-brand-accent)]">Experience notes</p>
        <p className="mt-3 font-display text-[1.8rem] leading-tight text-[var(--color-text-primary)]">
          A premium pacing curve built for quick decisions.
        </p>
        <p className="mt-3 text-[15px] leading-7 text-[var(--color-text-secondary)]">
          The page is tuned to keep attention on the banner moment, then move naturally into context, lineup confidence,
          and seat action without visual drop-off.
        </p>

        <div className="mt-6 grid gap-2.5">
          {event.tags.map((tag) => (
            <span
              key={tag}
              className="premium-chip rounded-full px-4 py-2 text-sm text-[var(--color-text-secondary)]"
            >
              {tag}
            </span>
          ))}
        </div>
      </aside>
    </section>
  );
}

EventInfo.propTypes = {
  event: PropTypes.shape({
    description: PropTypes.string.isRequired,
    duration: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired,
    ageRating: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string).isRequired,
    lineup: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        time: PropTypes.string.isRequired,
      }),
    ).isRequired,
    venue: PropTypes.shape({
      name: PropTypes.string.isRequired,
      address: PropTypes.string.isRequired,
      mapImageUrl: PropTypes.string.isRequired,
      transportInfo: PropTypes.arrayOf(PropTypes.string).isRequired,
    }).isRequired,
  }).isRequired,
};

export default EventInfo;
