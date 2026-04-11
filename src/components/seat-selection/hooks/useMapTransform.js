import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const MIN_SCALE = 0.65;
const MAX_SCALE = 2.4;
const DEFAULT_STATE = { scale: 1, x: 0, y: 0 };

const clampScale = (value) => Math.min(Math.max(value, MIN_SCALE), MAX_SCALE);

const distanceBetween = ([first, second]) =>
  Math.hypot(second.x - first.x, second.y - first.y);

export function useMapTransform() {
  const [state, setState] = useState(DEFAULT_STATE);
  const stateRef = useRef(DEFAULT_STATE);
  const pointersRef = useRef(new Map());
  const dragRef = useRef(null);
  const pinchRef = useRef(null);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const zoomIn = useCallback(() => {
    setState((current) => ({ ...current, scale: clampScale(current.scale + 0.18) }));
  }, []);

  const zoomOut = useCallback(() => {
    setState((current) => ({ ...current, scale: clampScale(current.scale - 0.18) }));
  }, []);

  const reset = useCallback(() => {
    setState(DEFAULT_STATE);
  }, []);

  const panBy = useCallback((dx, dy) => {
    setState((current) => ({ ...current, x: current.x + dx, y: current.y + dy }));
  }, []);

  const handleWheel = useCallback((event) => {
    event.preventDefault();
    setState((current) => ({
      ...current,
      scale: clampScale(current.scale + (event.deltaY < 0 ? 0.09 : -0.09)),
    }));
  }, []);

  const handlePointerDown = useCallback((event) => {
    event.currentTarget.setPointerCapture?.(event.pointerId);
    pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (pointersRef.current.size === 1) {
      dragRef.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        originX: stateRef.current.x,
        originY: stateRef.current.y,
      };
    }

    if (pointersRef.current.size === 2) {
      pinchRef.current = {
        scale: stateRef.current.scale,
        distance: distanceBetween([...pointersRef.current.values()]),
      };
      dragRef.current = null;
    }
  }, []);

  const handlePointerMove = useCallback((event) => {
    if (!pointersRef.current.has(event.pointerId)) {
      return;
    }

    pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (pointersRef.current.size === 2 && pinchRef.current) {
      const nextDistance = distanceBetween([...pointersRef.current.values()]);
      const nextScale = clampScale((pinchRef.current.scale * nextDistance) / pinchRef.current.distance);
      setState((current) => ({ ...current, scale: nextScale }));
      return;
    }

    if (dragRef.current?.pointerId === event.pointerId) {
      setState((current) => ({
        ...current,
        x: dragRef.current.originX + (event.clientX - dragRef.current.startX),
        y: dragRef.current.originY + (event.clientY - dragRef.current.startY),
      }));
    }
  }, []);

  const finishPointer = useCallback((event) => {
    pointersRef.current.delete(event.pointerId);

    if (dragRef.current?.pointerId === event.pointerId) {
      dragRef.current = null;
    }

    if (pointersRef.current.size < 2) {
      pinchRef.current = null;
    }
  }, []);

  const bind = useMemo(
    () => ({
      onWheel: handleWheel,
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: finishPointer,
      onPointerCancel: finishPointer,
      onPointerLeave: finishPointer,
    }),
    [finishPointer, handlePointerDown, handlePointerMove, handleWheel],
  );

  return {
    state,
    zoomIn,
    zoomOut,
    reset,
    panBy,
    bind,
  };
}
