import { useCallback, useRef, useState } from 'react';
import { getViewNote, getViewQuality } from './useSeatLayout';

const defaultTooltip = {
  visible: false,
  seat: null,
  screenX: 0,
  screenY: 0,
  containerWidth: 0,
  containerHeight: 0,
  viewQuality: 0,
  note: '',
};

export function useHoverTooltip(containerRef) {
  const [tooltip, setTooltip] = useState(defaultTooltip);
  const hideTimeoutRef = useRef(null);

  const cancelHide = useCallback(() => {
    if (hideTimeoutRef.current) {
      window.clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  }, []);

  const showTooltip = useCallback(
    (seat, payload) => {
      const containerRect = containerRef.current?.getBoundingClientRect();

      if (!containerRect || !seat) {
        return;
      }

      let screenX = containerRect.width / 2;
      let screenY = containerRect.height / 2;

      if (payload?.clientX != null && payload?.clientY != null) {
        screenX = payload.clientX - containerRect.left;
        screenY = payload.clientY - containerRect.top;
      } else if (payload?.currentTarget?.getBoundingClientRect) {
        const targetRect = payload.currentTarget.getBoundingClientRect();
        screenX = targetRect.left - containerRect.left + targetRect.width / 2;
        screenY = targetRect.top - containerRect.top + targetRect.height / 2;
      }

      setTooltip({
        visible: true,
        seat,
        screenX,
        screenY,
        containerWidth: containerRect.width,
        containerHeight: containerRect.height,
        viewQuality: getViewQuality(seat),
        note: getViewNote(seat),
      });
    },
    [containerRef],
  );

  const hideTooltip = useCallback(() => {
    cancelHide();
    setTooltip((current) => ({ ...current, visible: false }));
  }, [cancelHide]);

  const scheduleHide = useCallback(() => {
    cancelHide();
    hideTimeoutRef.current = window.setTimeout(() => {
      setTooltip((current) => ({ ...current, visible: false }));
      hideTimeoutRef.current = null;
    }, 140);
  }, [cancelHide]);

  return {
    tooltip,
    setTooltip,
    showTooltip,
    hideTooltip,
    scheduleHide,
    cancelHide,
  };
}
