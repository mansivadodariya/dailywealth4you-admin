'use client';

import React from 'react';
import styles from './ContactUsViewModal.module.scss';
import CloseIcon from '@/icons/closeIcon';
import moment from 'moment';

const FIELDS = [
  { label: 'Full Name',    render: (r) => `${r.firstName ?? ''} ${r.lastName ?? ''}`.trim() || '—' },
  { label: 'Email',        render: (r) => r.email ?? '—' },
  { label: 'Phone',        render: (r) => r.phone ?? r.phoneNumber ?? '—' },
  { label: 'Subject',      render: (r) => r.subject ?? '—' },
  { label: 'Date',         render: (r) => r.createdAt ? moment(r.createdAt).format('DD-MM-YYYY | hh:mm A') : '—' },
];

export default function ContactUsViewModal({ record, onClose }) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>

        <div className={styles.header}>
          <div>
            <h2>{`${record?.firstName ?? ''} ${record?.lastName ?? ''}`.trim() || '—'}</h2>
            <p>{record?.email ?? '—'}</p>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <CloseIcon color="#ffffff" size={18} />
          </button>
        </div>

        <div className={styles.divider} />

        <div className={styles.body}>
          <div className={styles.grid}>
            {FIELDS.map(({ label, render }) => (
              <div key={label} className={styles.field}>
                <span className={styles.label}>{label}</span>
                <span className={styles.value}>{render(record ?? {})}</span>
              </div>
            ))}
          </div>

          {(record?.description || record?.message) && (
            <div className={styles.messageBlock}>
              <span className={styles.label}>Message</span>
              <p className={styles.messageText}>{record?.description || record?.message}</p>
            </div>
          )}
        </div>

        <div className={styles.actions}>
          <button className={styles.btnClose} onClick={onClose}>
            Close <CloseIcon color="#ffffff" size={16} />
          </button>
        </div>

      </div>
    </div>
  );
}
