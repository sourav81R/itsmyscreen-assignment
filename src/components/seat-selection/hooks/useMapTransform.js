import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const MIN_SCALE = 0.6;
const MAX_SCALE = 4;
const DEFAULT_STATE = { scale: 1, x: 0, y: 0 };
const MAP_WIDTH = 1000;
const MAP_HEIGHT = 800;
const DRAG_THRESHOLD = 5;

const clampScale = (value) => Math.min(Math.max(value, MIN_SCALE), MAX_SCALE);
const clampValue = (value, min, max) => Math.min(Math.max(value, min), max);
const clampTranslate = (x, y, scale) => ({
  x: clampValue(x, -MAP_WIDTH * scale * 0.5, MAP_WIDTH * scale * 0.5),
  y: clampValue(y, -MAP_HEIGHT * scale * 0.5, MAP_HEIGHT * scale * 0.5),
});
const normalizeState = (nextState) => {
  const scale = clampScale(nextState.scale);
  const translate = clampTranslate(nextState.x, nextState.y, scale);

  return {
    scale,
    x: translate.x,
    y: translate.y,
  };
};

const distanceBetween = ([first, second]) =>
  Math.hypot(second.x - first.x, second.y - first.y);

export function useMapTransform() {
  const [state, setState] = useState(DEFAULT_STATE);
  const stateRef = useRef(DEFAULT_STATE);
  const pointersRef = useRef(new Map());
  const dragRef = useRef(null);
  const pinchRef = useRef(null);
  const didDragRef = useRef(false);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const zoomIn = useCallback(() => {
    setState((current) => normalizeState({ ...current, scale: current.scale + 0.18 }));
  }, []);

  const zoomOut = useCallback(() => {
    setState((current) => normalizeState({ ...current, scale: current.scale - 0.18 }));
  }, []);

  const reset = useCallback(() => {
    setState(DEFAULT_STATE);
  }, []);

  const panBy = useCallback((dx, dy) => {
    setState((current) => normalizeState({ ...current, x: current.x + dx, y: current.y + dy }));
  }, []);

  const handleWheel = useCallback((event) => {
    event.preventDefault();
    setState((current) => normalizeState({
      ...current,
      scale: current.scale + (event.deltaY < 0 ? 0.09 : -0.09),
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
      didDragRef.current = false;
    }

    if (pointersRef.current.size === 2) {
      pinchRef.current = {
        scale: stateRef.current.scale,
        distance: distanceBetween([...pointersRef.current.values()]),
      };
      dragRef.current = null;
      didDragRef.current = true;
    }
  }, []);

  const handlePointerMove = useCallback((event) => {
    if (!pointersRef.current.has(event.pointerId)) {
      return;
    }

    pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (pointersRef.current.size === 2 && pinchRef.current) {
      const nextDistance = distanceBetween([...pointersRef.current.values()]);
      const nextScale = (pinchRef.current.scale * nextDistance) / pinchRef.current.distance;
      didDragRef.current = true;
      setState((current) => normalizeState({ ...current, scale: nextScale }));
      return;
    }

    if (dragRef.current?.pointerId === event.pointerId) {
      const deltaX = event.clientX - dragRef.current.startX;
      const deltaY = event.clientY - dragRef.current.startY;

      if (Math.hypot(deltaX, deltaY) > DRAG_THRESHOLD) {
        didDragRef.current = true;
      }

      setState((current) => normalizeState({
        ...current,
        x: dragRef.current.originX + deltaX,
        y: dragRef.current.originY + deltaY,
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

    if (pointersRef.current.size === 0) {
      window.setTimeout(() => {
        didDragRef.current = false;
      }, 0);
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
    shouldBlockClick: () => didDragRef.current,
    bind,
  };
}
