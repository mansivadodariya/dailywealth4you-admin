'use client';

import React, { useState } from 'react';
import styles from './ManualEntryModal.module.scss';

const FIELDS = ['Field 1', 'Field 2', 'Field 3', 'Field 4', 'Field 5', 'Field 6', 'Field 7', 'Field 8', 'Field 9'];

export default function ManualEntryModal({ userId, onClose }) {
  const [values, setValues] = useState({});

  const set = (key, val) => setValues((prev) => ({ ...prev, [key]: val }));

  const handleSave = () => {
    // TODO: dispatch API call with userId + values
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>Manual Entry</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className={styles.grid}>
          {FIELDS.map((label) => (
            <div key={label} className={styles.field}>
              <label>{label}</label>
              <input
                type="text"
                value={values[label] ?? ''}
                onChange={(e) => set(label, e.target.value.trimStart())}
                placeholder=""
              />
            </div>
          ))}
        </div>

        <div className={styles.actions}>
          <button className={styles.btnSave} onClick={handleSave}>Save →</button>
          <button className={styles.btnCancel} onClick={onClose}>Cancel ✕</button>
        </div>
      </div>
    </div>
  );
}
