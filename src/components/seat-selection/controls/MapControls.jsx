import PropTypes from 'prop-types';
import { Expand, Minimize, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';

const buttons = [
  { id: 'zoomIn', icon: ZoomIn, label: 'Zoom in', shortcut: '+' },
  { id: 'zoomOut', icon: ZoomOut, label: 'Zoom out', shortcut: '-' },
  { id: 'reset', icon: RotateCcw, label: 'Reset view', shortcut: '0' },
];

function MapControls({ onZoomIn, onZoomOut, onReset, onToggleFullscreen, isFullscreen }) {
  return (
    <div className="map-controls premium-panel">
      {buttons.map(({ id, icon: Icon, label, shortcut }) => (
        <button
          key={id}
          type="button"
          aria-label={`${label} (${shortcut})`}
          title={`${label} (${shortcut})`}
          onClick={id === 'zoomIn' ? onZoomIn : id === 'zoomOut' ? onZoomOut : onReset}
          className="map-control-button"
        >
          <Icon className="h-4 w-4" aria-hidden="true" />
        </button>
      ))}
      <button
        type="button"
        aria-label={isFullscreen ? 'Exit fullscreen (F)' : 'Enter fullscreen (F)'}
        title={isFullscreen ? 'Exit fullscreen (F)' : 'Enter fullscreen (F)'}
        onClick={onToggleFullscreen}
        className="map-control-button"
      >
        {isFullscreen ? <Minimize className="h-4 w-4" aria-hidden="true" /> : <Expand className="h-4 w-4" aria-hidden="true" />}
      </button>
    </div>
  );
}

MapControls.propTypes = {
  onZoomIn: PropTypes.func.isRequired,
  onZoomOut: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  onToggleFullscreen: PropTypes.func.isRequired,
  isFullscreen: PropTypes.bool.isRequired,
};

export default MapControls;
