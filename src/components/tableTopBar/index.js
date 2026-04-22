'use client';

import React, { useEffect, useState } from 'react';
import styles from './tableTopBar.module.scss';
import { useDebounce } from '@/hooks/useDebounce';

/**
 * TableTopBar
 *
 * Props:
 *  - search: string
 *  - onSearchChange: (value: string) => void
 *  - searchPlaceholder?: string          (default: "Search")
 *  - actions?: Array<{ label, icon, onClick, variant? }>
 *    variant: 'outline' (default) | 'primary'
 */
export default function TableTopBar({
  search,
  onSearchChange,
  searchPlaceholder = 'Search',
  actions = [],
}) {
  const [raw, setRaw] = useState(search ?? '');
  const debounced = useDebounce(raw);

  useEffect(() => {
    onSearchChange(debounced);
  }, [debounced]);

  return (
    <div className={styles.topBar}>
      <div className={styles.searchBox}>
        <img src="/assets/icons/search.svg" alt="search" />
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={raw}
          onChange={(e) => setRaw(e.target.value.trimStart())}
        />
      </div>

      {actions.length > 0 && (
        <div className={styles.actions}>
          {actions.map(({ label, icon, onClick, variant = 'outline' }) => (
            <button
              key={label}
              className={variant === 'primary' ? styles.btnPrimary : styles.btnOutline}
              onClick={onClick}
            >
              {icon && <img src={icon} alt={label} />}
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
