import { useEffect, useState } from 'react';

/**
 * useDebounce
 * @param {*}      value  - value to debounce
 * @param {number} delay  - delay in ms (default: 400)
 * @returns debounced value
 */
export function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
