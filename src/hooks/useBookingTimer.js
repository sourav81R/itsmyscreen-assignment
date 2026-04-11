import { useEffect, useMemo, useReducer } from 'react';

export const useBookingTimer = (expiry) => {
  const [totalSeconds, dispatch] = useReducer((state, action) => {
    if (action.type === 'reset') {
      return action.payload;
    }

    if (action.type === 'tick') {
      return Math.max(0, state - 1);
    }

    return state;
  }, 600);

  useEffect(() => {
    if (!expiry) {
      return undefined;
    }

    const remainingSeconds = Math.max(0, Math.ceil((expiry - Date.now()) / 1000));
    dispatch({ type: 'reset', payload: remainingSeconds });

    if (remainingSeconds <= 0) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      dispatch({ type: 'tick' });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [expiry]);

  return useMemo(() => {
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return {
      totalSeconds,
      display: `${minutes}:${seconds}`,
      isExpired: totalSeconds <= 0,
    };
  }, [totalSeconds]);
};
