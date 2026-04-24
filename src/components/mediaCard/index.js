'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from './mediaCard.module.scss';

/**
 * MediaCard
 * Props:
 *  - imageSrc: string   — image or thumbnail URL
 *  - title: string      — shown below image
 *  - onEdit: () => void
 *  - onDelete: () => void
 */
export default function MediaCard({ imageSrc, title, onEdit, onDelete }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className={styles.card}>
      <div className={styles.imageBox}>
        {imageSrc ? (
          <img src={imageSrc} alt={title} className={styles.image} />
        ) : (
          <div className={styles.placeholder} />
        )}
      </div>

      <div className={styles.footer}>
        <p className={styles.title}>{title}</p>
        <div className={styles.menuWrap} ref={menuRef}>
          <button className={styles.dotsBtn} onClick={() => setOpen((p) => !p)} aria-label="Options">
            <span /><span /><span />
          </button>
          {open && (
            <div className={styles.dropdown}>
              <button onClick={() => { setOpen(false); onEdit?.(); }}>Edit</button>
              <button className={styles.deleteItem} onClick={() => { setOpen(false); onDelete?.(); }}>Delete</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
