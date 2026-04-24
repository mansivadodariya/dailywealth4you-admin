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
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={raw}
          onChange={(e) => setRaw(e.target.value.trimStart())}
        />
        <img src="/assets/icons/SearchWhite.svg" alt="search" />
      </div>

      {actions.length > 0 && (
        <div className={styles.actions}>
          {actions.map(({ label, icon, onClick, variant = 'outline' }) => (
            <button
              key={label}
              className={variant === 'primary' ? styles.btnPrimary : styles.btnOutline}
              onClick={onClick}
            >
              {label}
              {variant === 'primary' && !icon && <span className={styles.plusIcon}>+</span>}
              {icon && <img src={icon} alt={label} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
