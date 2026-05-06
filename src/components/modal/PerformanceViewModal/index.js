import React, { useState } from 'react';
import styles from './PerformanceViewModal.module.scss';
import Image from 'next/image';
import api from '@/service/api';
import { DELETE_PERFORMANCE_USER } from '@/service/url';
import { toast } from 'react-toastify';

export default function PerformanceViewModal({ data, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  if (!data) return null;

  const { user, broker, mt5LoginId, investment, currentBalance, totalProfit, profitPercentage, server, password, tradingAccountId } = data;
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
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.titleBlock}>
            <h2>{userName}</h2>
            <p>{user?.email || '—'}</p>
          </div>
          <div className={styles.headerActions}>
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
  );
}

