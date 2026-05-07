import React, { useState } from 'react';
import styles from './PerformanceViewModal.module.scss';
import Image from 'next/image';
import api from '@/service/api';
import { DELETE_PERFORMANCE_USER } from '@/service/url';
import { toast } from 'react-toastify';
import CreateFakeUserModal from '../CreateFakeUserModal';

export default function PerformanceViewModal({ data, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  if (!data) return null;

  const { user, broker, mt5LoginId, investment, currentBalance, totalProfit, profitPercentage, server, password } = data;
  const userName = `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim() || '—';

  const handleDeselect = async () => {
    const id = data.id || data._id || data.tradingAccountId;
    if (!id) {
      toast.error('Missing performance ID');
      return;
    }

    setLoading(true);
    try {
      await api.delete(`${DELETE_PERFORMANCE_USER}?id=${id}`);
      toast.success('Removed from Top 10 successfully');
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error('Error removing from Top 10:', error);
      toast.error('Failed to remove from Top 10');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={styles.overlay}>
        <div className={styles.modal}>
          <div className={styles.header}>
            <div className={styles.titleBlock}>
              <h2>{userName}</h2>
              <p>{user?.email || '—'}</p>
            </div>
            <div className={styles.headerActions}>
              {data?.isFake && (
                <button 
                  className={styles.editBtn} 
                  onClick={() => setShowEditModal(true)}
                  aria-label="Edit Fake User"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 4H4C2.89543 4 2 4.89543 2 6V20C2 21.1046 2.89543 22 4 22H18C19.1046 22 20 21.1046 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M18.5 2.5C19.3284 1.67157 20.6716 1.67157 21.5 2.5C22.3284 3.32843 22.3284 4.67157 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              )}
              <button 
                className={styles.deselectBtn} 
                onClick={handleDeselect} 
                disabled={loading}
              >
                {loading ? 'Removing...' : 'Deselect from Top 10'}
              </button>
              <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
                <Image src="/assets/icons/WhiteClose.svg" alt="close" width={24} height={24} />
              </button>
            </div>
          </div>

          <div className={styles.divider} />

          <div className={styles.content}>
            <div className={styles.section}>
              <h3>Trading Account</h3>
              <div className={styles.grid}>
                <div className={styles.item}>
                  <label>MT5 Login ID</label>
                  <span className={styles.badge}>{mt5LoginId || '—'}</span>
                </div>
                <div className={styles.item}>
                  <label>Server</label>
                  <span>{server || '—'}</span>
                </div>
                <div className={styles.item}>
                  <label>Password</label>
                  <span>{password || '—'}</span>
                </div>
              </div>
            </div>

            <div className={styles.section}>
              <h3>Financial Performance</h3>
              <div className={styles.grid}>
                <div className={styles.item}>
                  <label>Investment</label>
                  <span className={styles.amount}>${Number(investment || 0).toLocaleString()}</span>
                </div>
                <div className={styles.item}>
                  <label>Current Balance</label>
                  <span className={styles.amount}>${Number(currentBalance || 0).toLocaleString()}</span>
                </div>
                <div className={styles.item}>
                  <label>Total Profit</label>
                  <span className={`${styles.amount} ${totalProfit >= 0 ? styles.positive : styles.negative}`}>
                    {totalProfit >= 0 ? '+' : ''}${Number(totalProfit || 0).toLocaleString()}
                  </span>
                </div>
                <div className={styles.item}>
                  <label>Profit Percentage</label>
                  <span className={styles.profitBadge}>
                    {profitPercentage != null ? `${profitPercentage}%` : '0%'}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.section}>
              <h3>Broker Details</h3>
              <div className={styles.brokerGrid}>
                {broker?.logo && (
                  <div className={styles.brokerLogoWrap}>
                    <img src={broker.logo} alt={broker.name} className={styles.brokerLogo} />
                  </div>
                )}
                <div className={styles.item}>
                  <label>Broker Name</label>
                  <span>{broker?.name || '—'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showEditModal && (
        <CreateFakeUserModal 
          editData={data}
          onClose={() => setShowEditModal(false)}
          onSuccess={() => {
            setShowEditModal(false);
            if (onSuccess) onSuccess();
            onClose();
          }}
        />
      )}
    </>
  );
}
