'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchIbClients } from '@/store/reducers';
import styles from './IbClientsModal.module.scss';
import CloseIcon from '@/icons/closeIcon';
import Loader from '@/components/loader';

export default function IbClientsModal({ userId, userName, onClose }) {
  const dispatch = useDispatch();
  const { ibClients, loading } = useSelector((state) => state.admin);

  useEffect(() => {
    if (userId) dispatch(fetchIbClients(userId));
  }, [userId, dispatch]);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>IB Clients of {userName}</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <CloseIcon color="#fff" size={18} />
          </button>
        </div>
        <div className={styles.divider} />

        <div className={styles.body}>
          {loading ? (
            <div className={styles.loaderWrap}><Loader /></div>
          ) : !ibClients?.length ? (
            <div className={styles.empty}>No IB clients found.</div>
          ) : (
            <div className={styles.table}>
              <div className={styles.tableHeader}>
                <div className={styles.col}>Name</div>
                <div className={styles.col}>Email</div>
                <div className={styles.col}>Deposit</div>
                <div className={styles.col}>Profit</div>
              </div>
              {ibClients.map((client) => (
                <div key={client.id} className={styles.tableRow}>
                  <div className={styles.col}>{client.firstName} {client.lastName}</div>
                  <div className={styles.col}>{client.email}</div>
                  <div className={styles.col}>${client.deposit ?? '—'}</div>
                  <div className={styles.col}>${client.commission ?? '—'}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
