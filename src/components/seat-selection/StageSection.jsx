import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import ShowtimeSelector from './ShowtimeSelector';
import SeatCountPicker from './SeatCountPicker';
import StageCanvas from './stage/StageCanvas';
import SeatLegend from './controls/SeatLegend';
import MapControls from './controls/MapControls';
import ViewAngleToggle from './controls/ViewAngleToggle';
import SeatInfoTooltip from './panels/SeatInfoTooltip';
import SelectionSummaryDrawer from './panels/SelectionSummaryDrawer';
import AIPickPanel from './panels/AIPickPanel';
import { useMapTransform } from './hooks/useMapTransform';
import { useSeatLayout } from './hooks/useSeatLayout';
import { useHoverTooltip } from './hooks/useHoverTooltip';
import { formatPrice } from '../../utils/priceFormatter';

function StageSection({
  event,
  seats,
  suggestions,
  selectedSeats,
  selectedSeatCount,
  selectedSeatIds,
  suggestedIds,
  soldOut,
  timer,
  total,
  loading,
  disabled,
  message,
  onSeatCountChange,
  onSeatAction,
  onApplySuggestedSeats,
  onRemoveSeat,
  onProceed,
}) {
  const [viewMode, setViewMode] = useState('birdsEye');
  const [activeTierFilter, setActiveTierFilter] = useState(null);
  const [previewSeatIds, setPreviewSeatIds] = useState(new Set());
  const [liveMessage, setLiveMessage] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const mapAreaRef = useRef(null);
  const mapContainerRef = useRef(null);
  const mapTransform = useMapTransform();
  const seatRows = useSeatLayout(seats);
  const { tooltip, showTooltip, hideTooltip, scheduleHide, cancelHide } = useHoverTooltip(mapContainerRef);

  const applyPrimarySuggestion = useCallback(() => {
    if (suggestions[0]) {
      onApplySuggestedSeats(suggestions[0]);
    }
  }, [onApplySuggestedSeats, suggestions]);

  const toggleFullscreen = useCallback(async () => {
    if (!mapAreaRef.current) {
      return;
    }

    if (!document.fullscreenElement) {
      await mapAreaRef.current.requestFullscreen?.();
      return;
    }

    await document.exitFullscreen?.();
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key.toLowerCase() === 'f' && mapAreaRef.current?.contains(document.activeElement)) {
        event.preventDefault();
        toggleFullscreen();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [toggleFullscreen]);

  const mapSummary = useMemo(
    () => ({
      selectedSeats,
      selectedSeatIds,
      suggestedIds,
      previewSeatIds,
      activeTierFilter,
      viewMode,
    }),
    [activeTierFilter, previewSeatIds, selectedSeatIds, selectedSeats, suggestedIds, viewMode],
  );

  const handleTooltipSeatAction = useCallback(
    (seat) => {
      const wasSelected = selectedSeatIds.has(seat.id);
      const result = onSeatAction(seat);

      if (result.accepted) {
        setLiveMessage(
          wasSelected
            ? `Seat ${seat.row}${seat.number} removed from your selection.`
            : `Seat ${seat.row}${seat.number} selected for ${formatPrice(seat.price)}.`,
        );
      } else if (result.message) {
        setLiveMessage(result.message);
      }

      hideTooltip();
    },
    [hideTooltip, onSeatAction, selectedSeatIds],
  );

  return (
    <section className="stage-section min-h-0 flex flex-col gap-6 lg:grid lg:grid-cols-[320px_minmax(0,1fr)]">
      <div className="controls-panel order-1 flex flex-col gap-5 lg:order-none">
        <ShowtimeSelector showtimes={event?.showtimes ?? []} />
        <SeatCountPicker value={selectedSeatCount} onChange={onSeatCountChange} />
        <AIPickPanel
          suggestions={suggestions}
          seatRows={seatRows}
          onApply={onApplySuggestedSeats}
          onPreviewChange={setPreviewSeatIds}
        />
      </div>

      <div ref={mapAreaRef} className="map-area order-2">
        <div className="map-area-topbar">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-text-muted)]">Immersive view</p>
            <h2 className="mt-2 font-display text-[2.4rem] leading-none text-[var(--color-text-primary)]">Choose your angle</h2>
          </div>
          <ViewAngleToggle value={viewMode} onChange={setViewMode} />
        </div>

        <div className="mb-4 hidden lg:block">
          <SeatLegend seats={seats} activeTierFilter={activeTierFilter} onToggleTier={setActiveTierFilter} />
        </div>

        <div ref={mapContainerRef} className="map-container">
          <StageCanvas
            seatRows={seatRows}
            selectedSeats={mapSummary.selectedSeats}
            selectedSeatIds={mapSummary.selectedSeatIds}
            aiSuggestedIds={mapSummary.suggestedIds}
            previewSeatIds={mapSummary.previewSeatIds}
            activeTierFilter={mapSummary.activeTierFilter}
            soldOut={soldOut}
            viewMode={mapSummary.viewMode}
            mapTransform={mapTransform}
            onSeatAction={onSeatAction}
            onApplyAISuggestions={applyPrimarySuggestion}
            showTooltip={showTooltip}
            hideTooltip={scheduleHide}
            keepTooltipOpen={cancelHide}
            announce={setLiveMessage}
          />
          <MapControls
            onZoomIn={mapTransform.zoomIn}
            onZoomOut={mapTransform.zoomOut}
            onReset={mapTransform.reset}
            onToggleFullscreen={toggleFullscreen}
            isFullscreen={isFullscreen}
          />
          <SeatInfoTooltip
            tooltip={tooltip}
            selectedSeatIds={selectedSeatIds}
            onBookSeat={handleTooltipSeatAction}
            onMouseEnter={cancelHide}
            onMouseLeave={scheduleHide}
          />
        </div>

        <div className="mt-4 lg:hidden">
          <SeatLegend seats={seats} activeTierFilter={activeTierFilter} onToggleTier={setActiveTierFilter} />
        </div>
      </div>

      <SelectionSummaryDrawer
        selectedSeats={selectedSeats}
        timer={timer}
        total={total}
        onRemoveSeat={onRemoveSeat}
        onProceed={onProceed}
        disabled={disabled}
        loading={loading}
        message={message}
      />

      <div className="sr-only" aria-live="polite">
        {liveMessage}
      </div>
    </section>
  );
}

StageSection.propTypes = {
  event: PropTypes.shape({
    showtimes: PropTypes.array.isRequired,
  }),
  seats: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.string.isRequired })).isRequired,
  suggestions: PropTypes.array.isRequired,
  selectedSeats: PropTypes.array.isRequired,
  selectedSeatCount: PropTypes.number.isRequired,
  selectedSeatIds: PropTypes.instanceOf(Set).isRequired,
  suggestedIds: PropTypes.instanceOf(Set).isRequired,
  soldOut: PropTypes.bool.isRequired,
  timer: PropTypes.shape({
    display: PropTypes.string.isRequired,
    totalSeconds: PropTypes.number.isRequired,
  }).isRequired,
  total: PropTypes.number.isRequired,
  loading: PropTypes.bool.isRequired,
  disabled: PropTypes.bool.isRequired,
  message: PropTypes.string,
  onSeatCountChange: PropTypes.func.isRequired,
  onSeatAction: PropTypes.func.isRequired,
  onApplySuggestedSeats: PropTypes.func.isRequired,
  onRemoveSeat: PropTypes.func.isRequired,
  onProceed: PropTypes.func.isRequired,
};

StageSection.defaultProps = {
  event: null,
  message: '',
};

export default StageSection;
