'use client';

import React, { useRef, useState } from 'react';
import moment from 'moment';
import styles from './UserViewModal.module.scss';
import ManualEntryModal from '@/components/modal/ManualEntryModal';
import BlockUserModal from '@/components/modal/BlockUserModal';
import Image from 'next/image';
import api from '@/service/api';
import { UPLOAD_TRADE_HISTORY } from '@/service/url';
import { toast } from 'react-toastify';

export default function UserViewModal({ user, onClose }) {
  const [openAccountId, setOpenAccountId] = useState(null);
  const [showManual, setShowManual] = useState(false);
  const [showBlock, setShowBlock] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const accounts = user?.tradingAccount || [];
  const selectedAccount = accounts.length === 1 ? accounts[0] : accounts.find(acc => acc.id === openAccountId);
  const isAccountSelected = accounts.length > 0 && selectedAccount != null;

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.xlsx')) {
      toast.error('Only .xlsx files are allowed');
      e.target.value = '';
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', user?.id ?? '');
    formData.append('brokerId', selectedAccount?.brokerId ?? '');

    try {
      setUploading(true);
      await api.post(UPLOAD_TRADE_HISTORY, formData);
      toast.success('Trade history uploaded successfully');
    } catch {
      // error toast handled by api interceptor
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const name = `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim() || '—';

  const subModalOpen = showManual || showBlock;

  return (
    <>
      <div className={styles.overlay} style={subModalOpen ? { display: 'none' } : undefined}>
        <div className={styles.modal}>

          {/* Header: name/email left, block+close right */}
          <div className={styles.header}>
            <div className={styles.nameBlock}>
              <h2>{name}</h2>
              <p>{user?.email ?? '—'}</p>
            </div>
            <div className={styles.headerRight}>
              <button className={styles.blockBtn} onClick={() => setShowBlock(true)} aria-label="Block user">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="#ff4444" strokeWidth="2" />
                  <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" stroke="#ff4444" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
              <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
<Image src="/assets/icons/WhiteClose.svg" alt="arrow right" width={24} height={24} />              </button>
            </div>
          </div>

          <div className={styles.divider} />

          {/* Info grid */}
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <label>Date Joined</label>
              <span>{user?.createdAt ? moment(user.createdAt).format('DD-MM-YYYY | hh:mm A') : '—'}</span>
            </div>
            <div className={styles.infoItem}>
              <label>IB Status</label>
              <span>{user?.ibStatus ?? (user?.isIbUser ? 'Approved' : 'N/A')}</span>
            </div>
            <div className={styles.infoItem}>
              <label>Total Deposit</label>
              <span>${user?.totalDeposit ?? '0'}</span>
            </div>
            <div className={styles.infoItem}>
              <label>Profit</label>
              <span>${user?.totalProfit ?? '0'}</span>
            </div>
          </div>

          {/* MT5 Accounts */}
          {accounts.length > 0 && (
            <>
              <div className={styles.sectionTitle}>MT5 Accounts</div>
              {accounts.map((acc) => {
                const isOpen = openAccountId === acc.id;
                const pnl = acc.pnl ?? acc.pandl ?? acc.pl;
                const pnlNum = parseFloat(pnl);
                return (
                  <div key={acc.id} className={`${styles.accountCard} ${selectedAccount?.id === acc.id ? styles.selectedCard : ''}`}>
                    <div
                      className={styles.accountHeader}
                      onClick={() => setOpenAccountId(isOpen ? null : acc.id)}
                    >
                      <div>
                        <div className={styles.accountNo}>Account No: {acc.mt5LoginId ?? acc.id}</div>
                        <div className={styles.accountBalance}>${acc.currentBalance ?? acc.equity ?? '0'}</div>
                      </div>
                      <span className={`${styles.chevron} ${isOpen ? styles.open : ''}`}>
                        <img src={"/assets/icons/Small-right.svg"}/>
                      </span>
                    </div>
                    {isOpen && (
                      <div className={styles.accountDetails}>
                        <div className={styles.detailRow}>
                          <span className={styles.label}>Broker:</span>
                          <span className={styles.dots} />
                          <span className={styles.value}>{ acc.brokerName ?? '—'}</span>
                        </div>
                        <div className={styles.detailRow}>
                          <span className={styles.label}>Date Added</span>
                          <span className={styles.dots} />
                          <span className={styles.value}>
                            {acc.createdAt ? moment(acc.createdAt).format('DD-MM-YYYY | hh:mm A') : '—'}
                          </span>
                        </div>
                        <div className={`${styles.detailRow} ${!isNaN(pnlNum) ? (pnlNum >= 0 ? styles.pnlPositive : styles.pnlNegative) : ''}`}>
                          <span className={styles.label}>P&amp;L</span>
                          <span className={styles.dots} />
                          <span className={styles.value}>
                            {pnl != null ? `${pnlNum >= 0 ? '+' : ''}${pnl}%` : '—'}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          )}

          {/* Actions */}
          <div className={styles.actions}>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            {isAccountSelected && (
              <>
              <button className={styles.btnUpload} onClick={handleUploadClick} disabled={uploading}>
                {uploading ? 'Uploading...' : 'Upload Excel'} <Image src="/assets/icons/Uploadblack.svg" alt="upload" width={18} height={18} />
              </button>
            <button className={styles.btnManual} onClick={() => setShowManual(true)}>
              Manual Entry <Image src="/assets/icons/WhiteRight.svg" alt="arrow right" width={18} height={18} />
            </button>
              </>
            )}
          </div>

        </div>
      </div>

      {showManual && <ManualEntryModal userId={user?.id} accounts={accounts} onClose={() => setShowManual(false)} />}
      {showBlock && <BlockUserModal user={user} onClose={() => setShowBlock(false)} onBlocked={onClose} />}
    </>
  );
}
