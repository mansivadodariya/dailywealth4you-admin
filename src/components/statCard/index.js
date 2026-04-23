import React from 'react';
import styles from './statCard.module.scss';

/**
 * StatCard
 * Props:
 *  - label: string
 *  - value: string | number
 *  - sub?: string   (e.g. "Count: 10")
 */
export default function StatCard({ label, value, sub }) {
  return (
    <div className={styles.card}>
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>{value ?? '—'}</span>
      {sub && <span className={styles.sub}>{sub}</span>}
    </div>
  );
}
