import { useCallback, useState } from 'react';
import { getViewNote, getViewQuality } from './useSeatLayout';

const defaultTooltip = {
  visible: false,
  seat: null,
  screenX: 0,
  screenY: 0,
  viewQuality: 0,
  note: '',
};

export function useHoverTooltip(containerRef) {
  const [tooltip, setTooltip] = useState(defaultTooltip);

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
        viewQuality: getViewQuality(seat),
        note: getViewNote(seat),
      });
    },
    [containerRef],
  );

  const hideTooltip = useCallback(() => {
    setTooltip((current) => ({ ...current, visible: false }));
  }, []);

  return {
    tooltip,
    setTooltip,
    showTooltip,
    hideTooltip,
  };
}
