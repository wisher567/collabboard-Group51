import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Caches a value to localStorage and rehydrates from it on mount.
 *
 * @param {string} key - localStorage key to store the value under
 * @param {*} initialValue - fallback value if nothing is cached yet
 * @returns {[value, setValue]}
 */
function useLocalCache(key, initialValue = null) {
  const isFirstRender = useRef(true);

  // Lazy init: read from localStorage synchronously on mount,
  // so the very first render already has cached data (no flash of blank state).
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored !== null ? JSON.parse(stored) : initialValue;
    } catch (err) {
      console.warn(`useLocalCache: failed to read key "${key}"`, err);
      return initialValue;
    }
  });

  // Persist to localStorage whenever value changes.
  useEffect(() => {
    // Skip writing on the very first render if value is still just
    // the cached/initial value — avoids an unnecessary write-back.
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    try {
      if (value === null || value === undefined) {
        window.localStorage.removeItem(key);
      } else {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (err) {
      // Storage can fail (quota exceeded, private browsing, etc.) —
      // fail silently rather than crashing the board.
      console.warn(`useLocalCache: failed to write key "${key}"`, err);
    }
  }, [key, value]);

  const save = useCallback((newValue) => {
    setValue(newValue);
  }, []);

  return [value, save];
}

export default useLocalCache;