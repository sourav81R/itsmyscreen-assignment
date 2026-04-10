import { useState } from 'react';
import PropTypes from 'prop-types';
import { Clock3, Languages, ShieldCheck } from 'lucide-react';
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
    <section className="grid grid-cols-[1.4fr_0.8fr] gap-8">
      <div className="editorial-panel rounded-[32px] p-8">
        <div className="mb-8 flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-full px-4 py-2 text-sm transition ${
                activeTab === tab
                  ? 'bg-[var(--color-brand-primary)] text-white'
                  : 'bg-[rgba(255,255,255,0.04)] text-[var(--color-text-secondary)]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'About' ? (
          <div>
            <p className={`text-[var(--color-text-secondary)] ${expanded ? '' : 'line-clamp-3'}`}>{event.description}</p>
            <button
              type="button"
              onClick={() => setExpanded((current) => !current)}
              className="mt-4 text-sm font-medium text-[var(--color-brand-accent)]"
            >
              {expanded ? 'Show less' : 'Show more'}
            </button>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                { label: 'Duration', value: event.duration, icon: Clock3 },
                { label: 'Language', value: event.language, icon: Languages },
                { label: 'Age', value: event.ageRating, icon: ShieldCheck },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="rounded-[24px] border border-[var(--color-border-subtle)] bg-[rgba(255,255,255,0.03)] p-4">
                  <Icon className="h-5 w-5 text-[var(--color-brand-accent)]" aria-hidden="true" />
                  <p className="mt-4 text-xs uppercase tracking-[0.18em] text-[var(--color-text-muted)]">{label}</p>
                  <p className="mt-2 text-lg text-[var(--color-text-primary)]">{value}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {activeTab === 'Lineup' ? (
          <div className="space-y-4">
            {event.lineup.map((slot) => (
              <div
                key={`${slot.name}-${slot.time}`}
                className="flex items-center justify-between rounded-[24px] border border-[var(--color-border-subtle)] bg-[rgba(255,255,255,0.03)] px-5 py-4"
              >
                <div>
                  <p className="font-medium text-[var(--color-text-primary)]">{slot.name}</p>
                  <p className="text-sm text-[var(--color-text-secondary)]">Live set</p>
                </div>
                <p className="text-sm uppercase tracking-[0.18em] text-[var(--color-brand-accent)]">{slot.time}</p>
              </div>
            ))}
          </div>
        ) : null}

        {activeTab === 'Venue' ? (
          <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
            <img
              src={event.venue.mapImageUrl}
              alt={`${event.venue.name} venue map preview`}
              className="h-[300px] w-full rounded-[28px] object-cover"
            />
            <div className="space-y-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-muted)]">Address</p>
                <p className="mt-2 text-lg text-[var(--color-text-primary)]">{event.venue.address}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                {event.venue.transportInfo.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-[var(--color-border-subtle)] px-4 py-2 text-sm text-[var(--color-text-secondary)]"
                  >
                    {item}
                  </span>
                ))}
              </div>
              <Button variant="secondary">Get Directions</Button>
            </div>
          </div>
        ) : null}
      </div>

      <div className="editorial-panel rounded-[32px] p-8">
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-muted)]">Tonight’s promise</p>
        <p className="mt-4 font-display text-3xl text-[var(--color-text-primary)]">A premium pacing curve</p>
        <p className="mt-4 text-[var(--color-text-secondary)]">
          The flow is deliberately short: read, decide, select seats, and checkout without leaving the same visual rhythm.
        </p>
        <div className="mt-8 flex flex-wrap gap-2">
          {event.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-[var(--color-border-subtle)] px-4 py-2 text-sm text-[var(--color-text-secondary)]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
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
