'use client';

import React, { useState } from 'react';
import styles from './KycViewModal.module.scss';
import CloseIcon from '@/icons/closeIcon';


const DOC_FIELDS = [
  {
    title: "ID Proof",
    fields: [
      { key: "idProofFrontUrl", label: "Front" },
      { key: "idProofBackUrl", label: "Back" },
    ],
  },
  {
    title: "Address Proof",
    fields: [
      { key: "addressFrontUrl", label: "Front" },
      { key: "addressBackUrl", label: "Back" },
    ],
  },
];

export default function KycViewModal({ doc, onClose, onAction, actionLoading }) {
  const [lightbox, setLightbox] = useState(null); // { src, label }

  const name  = `${doc?.user?.firstName ?? ''} ${doc?.user?.lastName ?? ''}`.trim() || '—';
  const email = doc?.user?.email ?? '—';

  const images = DOC_FIELDS.filter((f) => doc?.[f.key]);

  return (
    <>
      <div className={styles.overlay} onClick={onClose}>
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>

          <div className={styles.header}>
            <div>
              <h2>{name}</h2>
              <p>{email}</p>
            </div>
            <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
              <CloseIcon color="#ffffff" size={18} />
            </button>
          </div>

          <div className={styles.divider} />

         <div className={styles.body}>
  {DOC_FIELDS.some(group =>
    group.fields.some(field => doc[field.key])
  ) ? (
    <div className={styles.docsGrid}>
      {DOC_FIELDS.map((group) => (
        <div key={group.title} className={styles.groupSection}>
          <h4 className={styles.groupTitle}>{group.title}</h4>

          <div className={styles.groupGrid}>
            {group.fields.map(({ key, label }) =>
              doc[key] ? (
                <div key={key} className={styles.docSection}>
                  <label>{label}</label>

                  <div
                    className={styles.imgWrapper}
                    onClick={() =>
                      setLightbox({ src: doc[key], label: `${group.title} - ${label}` })
                    }
                  >
                    <img src={doc[key]} alt={label} />
                  </div>
                </div>
              ) : null
            )}
          </div>
        </div>
      ))}
    </div>
  ) : (
    <p className={styles.empty}>No documents uploaded.</p>
  )}
</div>

          <div className={styles.actions}>
            <button
              className={styles.btnApprove}
              disabled={doc?.status === 'approved' || !!actionLoading}
              onClick={() => onAction(doc.id, 'approved')}
            >
              {actionLoading?.action === 'approved'
                ? <span className={styles.btnSpinner} />
                : doc?.status === 'approved'
                ? 'Approved'
                : <> Approve KYC <img src="/assets/icons/BlackRight.svg" alt="" style={{ width: 18, height: 18 }} /> </>}
            </button>
            <button
              className={styles.btnReject}
              disabled={doc?.status === 'rejected' || !!actionLoading}
              onClick={() => onAction(doc.id, 'rejected')}
            >
              {actionLoading?.action === 'rejected'
                ? <span className={styles.btnSpinner} />
                : doc?.status === 'rejected'
                ? 'Rejected'
                : 'Reject KYC  ✕'}
            </button>
          </div>

        </div>
      </div>

      {lightbox && (
        <div className={styles.lightboxOverlay} onClick={() => setLightbox(null)}>
          <div className={styles.lightbox} onClick={(e) => e.stopPropagation()}>
            <div className={styles.lightboxHeader}>
              <span>{lightbox.label}</span>
              <button onClick={() => setLightbox(null)} aria-label="Close lightbox">
                <CloseIcon color="#ffffff" size={16} />
              </button>
            </div>
            <img src={lightbox.src} alt={lightbox.label} />
          </div>
        </div>
      )}
    </>
  );
}
