import PropTypes from 'prop-types';
import { Grid2x2, Rows3 } from 'lucide-react';
import { useFilterStore } from '../../store/useFilterStore';

/**
 * Grid and list layout toggle for the discovery results section.
 * Props: className.
 */
function ViewToggle({ className }) {
  const viewMode = useFilterStore((state) => state.viewMode);
  const setViewMode = useFilterStore((state) => state.setViewMode);

  return (
    <div className={`inline-flex rounded-full border border-[var(--color-border-subtle)] bg-[rgba(255,255,255,0.04)] p-1 ${className}`}>
      {[
        { mode: 'grid', icon: Grid2x2, label: 'Grid view' },
        { mode: 'list', icon: Rows3, label: 'List view' },
      ].map(({ mode, icon: Icon, label }) => (
        <button
          key={mode}
          type="button"
          aria-label={label}
          onClick={() => setViewMode(mode)}
          className={`rounded-full px-4 py-3 transition ${viewMode === mode ? 'bg-[var(--color-brand-primary)] text-white' : 'text-[var(--color-text-secondary)]'}`}
        >
          <Icon className="h-4 w-4" aria-hidden="true" />
        </button>
      ))}
    </div>
  );
}

ViewToggle.propTypes = {
  className: PropTypes.string,
};

ViewToggle.defaultProps = {
  className: '',
};

export default ViewToggle;
