'use client';

import React, { useState } from 'react';
import moment from 'moment';
import styles from './UserViewModal.module.scss';
import ManualEntryModal from '@/components/modal/ManualEntryModal';
import BlockUserModal from '@/components/modal/BlockUserModal';
import Image from 'next/image';
import CloseIcon from '@/icons/closeIcon';

export default function UserViewModal({ user, onClose }) {
  const [openAccountId, setOpenAccountId] = useState(null);
  const [showManual, setShowManual] = useState(false);
  const [showBlock, setShowBlock] = useState(false);

  const accounts = user?.tradingAccount || [];
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
                  <div key={acc.id} className={styles.accountCard}>
                    <div
                      className={styles.accountHeader}
                      onClick={() => setOpenAccountId(isOpen ? null : acc.id)}
                    >
                      <div>
                        <div className={styles.accountNo}>Account No: {acc.mt5LoginId ?? acc.id}</div>
                        <div className={styles.accountBalance}>${acc.balance ?? acc.equity ?? '0'}</div>
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
            <button className={styles.btnUpload}>
              Upload Excel <Image src="/assets/icons/Uploadblack.svg" alt="upload" width={18} height={18} />
            </button>
            <button className={styles.btnManual} onClick={() => setShowManual(true)}>
              Manual Entry <Image src="/assets/icons/WhiteRight.svg" alt="arrow right" width={18} height={18} />
            </button>
          </div>

        </div>
      </div>

      {showManual && <ManualEntryModal userId={user?.id} onClose={() => setShowManual(false)} />}
      {showBlock && <BlockUserModal user={user} onClose={() => setShowBlock(false)} onBlocked={onClose} />}
    </>
  );
}
