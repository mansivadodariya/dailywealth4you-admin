'use client';

import React, { useState } from 'react';
import styles from './KycViewModal.module.scss';
import CloseIcon from '@/icons/closeIcon';
import RightIcon from '@/icons/rightIcon'; // Using RightIcon as it usually has color control or I can wrap it


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
  const [detailView, setDetailView] = useState(null); // { src, label }

  const name  = `${doc?.user?.firstName ?? ''} ${doc?.user?.lastName ?? ''}`.trim() || '—';
  const email = doc?.user?.email ?? '—';

  const images = DOC_FIELDS.filter((f) => doc?.[f.key]);

  return (
    <>
      <div className={styles.overlay} onClick={onClose}>
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>

          <div className={styles.header}>
            <div className={styles.headerTitle}>
              {detailView && (
                <button 
                  className={styles.backBtn} 
                  onClick={() => setDetailView(null)}
                  aria-label="Back to documents"
                >
                  <div className={styles.backArrowWrap}>
                    <RightIcon color="#ffffff" size={18} />
                  </div>
                </button>
              )}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <h2>{detailView ? detailView.label : name}</h2>
                  {!detailView && doc?.user?.id && (
                    <span className={styles.idBadge}>
                      {doc.user.id.slice(0, 6).toUpperCase()}
                    </span>
                  )}
                </div>
                <p>{email}</p>
              </div>
            </div>
            <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
              <CloseIcon color="#ffffff" size={18} />
            </button>
          </div>

          <div className={styles.divider} />

         <div className={styles.body}>
          {detailView ? (
            <div className={styles.detailContent}>
              <img src={detailView.src} alt={detailView.label} />
            </div>
          ) : DOC_FIELDS.some(group =>
            group.fields.some(field => doc[field.key])
          ) ? (
            <div className={styles.docsGrid}>
              {DOC_FIELDS.map((group) => (
                <div key={group.title} className={styles.groupSection}>
                  <div className={styles.groupGrid}>
                    {group.fields.map(({ key, label }) =>
                      doc[key] ? (
                        <div key={key} className={styles.docSection}>
                          <label>{group.title} ({label})</label>
                          <div
                            className={styles.imgWrapper}
                            onClick={() =>
                              setDetailView({ src: doc[key], label: `${group.title} - ${label}` })
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
              disabled={doc?.status === 'rejected' || doc?.status === 'approved' || !!actionLoading}
              onClick={() => onAction(doc.id, 'rejected')}
            >
              {actionLoading?.action === 'rejected'
                ? <span className={styles.btnSpinner} />
                : doc?.status === 'rejected'
                ? 'Rejected'
                : 
                <> Reject KYC <img src="/assets/icons/WhiteClose.svg" alt="" style={{ width: 18, height: 18 }} /> </>}                
            </button>
          </div>

        </div>
      </div>
    </>
  );
}
