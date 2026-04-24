'use client';

import React, { useState } from 'react';
import styles from './pagination.module.scss';

/**
 * Pagination
 * Props:
 *  - page: number          current page (1-based)
 *  - totalPages: number
 *  - onPageChange: (page: number) => void
 */
export default function Pagination({ page, totalPages, onPageChange }) {
  const [goTo, setGoTo] = useState('');

  if (!totalPages || totalPages <= 1) return null;

  const handleGoTo = (e) => {
    e.preventDefault();
    const n = parseInt(goTo, 10);
    if (n >= 1 && n <= totalPages) {
      onPageChange(n);
      setGoTo('');
    }
  };

  // Build page number list: 1 2 3 ... n-1 n  (with ellipsis)
  const pages = buildPages(page, totalPages);

  return (
    <div className={styles.wrapper}>
      <div className={styles.left}>
        <button
          className={styles.arrow}
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          aria-label="Previous page"
        >
         <img src="/assets/icons/RightArrowPage.svg" alt="Previous" /> 
        </button>

        {pages.map((p, i) =>
          p === '...' ? (
            <span key={`ellipsis-${i}`} className={styles.ellipsis}>...</span>
          ) : (
            <button
              key={p}
              className={`${styles.pageBtn} ${p === page ? styles.active : ''}`}
              onClick={() => onPageChange(p)}
            >
              {p}
            </button>
          )
        )}

        <button
          className={styles.arrow}
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          aria-label="Next page"
        >
         <img src="/assets/icons/LeftArrowPage.svg" alt="Next" />

        </button>
      </div>

      <form className={styles.goTo} onSubmit={handleGoTo}>
        <span>Go To</span>
        <input
          type="number"
          min={1}
          max={totalPages}
          value={goTo}
          placeholder={String(page)}
          onChange={(e) => setGoTo(e.target.value)}
          aria-label="Go to page"
        />
      </form>
    </div>
  );
}

function buildPages(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  if (current <= 4) return [1, 2, 3, '...', total - 2, total - 1, total];
  if (current >= total - 3) return [1, 2, 3, '...', total - 2, total - 1, total];

  return [1, '...', current - 1, current, current + 1, '...', total];
}
