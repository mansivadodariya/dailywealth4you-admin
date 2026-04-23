'use client';

import React from 'react';
import { useDispatch } from 'react-redux';
import { blockUser } from '@/store/reducers';
import styles from './BlockUserModal.module.scss';

export default function BlockUserModal({ user, onClose, onBlocked }) {
  const dispatch = useDispatch();

  const handleBlock = async () => {
    await dispatch(blockUser(user?.id));
    onBlocked?.();
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <p className={styles.message}>Are you sure you want to<br />block this user?</p>
        <div className={styles.actions}>
          <button className={styles.btnBlock} onClick={handleBlock}>
            Block
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
              <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <button className={styles.btnCancel} onClick={onClose}>Cancel ✕</button>
        </div>
      </div>
    </div>
  );
}
