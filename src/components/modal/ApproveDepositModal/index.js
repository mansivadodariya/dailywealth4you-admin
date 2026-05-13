'use client';
import React, { useState } from 'react';
import styles from './ApproveDepositModal.module.scss';
import CloseIcon from '@/icons/closeIcon';
import { toast } from 'react-toastify';


export default function ApproveDepositModal({ request, onConfirm, onClose, loading }) {
  const [isChecked, setIsChecked] = useState(false);

  const isSocialPool = request?.accountType === 'social_pool';

  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const handleConfirm = () => {
    if (!isChecked) return;
    onConfirm(request.id);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.headerTitle}>
            <h2>Deposit?</h2>
            <p>{isSocialPool ? 'Deposit Funds in Social Pool' : 'Deposit Funds in Below MT5 Account'}</p>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <CloseIcon color="#ffffff" size={18} />
          </button>
        </div>

        <div className={styles.body}>
          {isSocialPool ? (
            <>
              <h3 className={styles.sectionTitle}>Social Pool Deposit</h3>
              <div className={styles.credentialsGrid}>
                <div className={styles.credentialField}>
                  <div className={styles.fieldHeader}>
                    <label>Amount</label>
                  </div>
                  <p className={styles.fieldValue}>${request?.amount}</p>
                </div>
                {/* <div className={styles.credentialField}>
                  <div className={styles.fieldHeader}>
                    <label>Pool ID</label>
                    <button onClick={() => handleCopy(request?.socialPoolId, 'Pool ID')}>
                      <img src="/assets/icons/CopyIcon.svg" alt="copy" />
                    </button>
                  </div>
                  <p className={styles.fieldValue}>{request?.socialPoolId}</p>
                </div> */}
              </div>
            </>
          ) : (
            <>
              <h3 className={styles.sectionTitle}>MT5 Account Credentials</h3>
              <div className={styles.credentialsGrid}>
                <div className={styles.credentialField}>
                  <div className={styles.fieldHeader}>
                    <label>Broker Name</label>
                    <button onClick={() => handleCopy(request?.tradingAccount?.brokerName || 'Exness', 'Broker Name')}>
                      <img src="/assets/icons/CopyIcon.svg" alt="copy" />
                    </button>
                  </div>
                  <p className={styles.fieldValue}>{request?.tradingAccount?.brokerName || 'Exness'}</p>
                </div>

                <div className={styles.credentialField}>
                  <div className={styles.fieldHeader}>
                    <label>Server</label>
                    <button onClick={() => handleCopy(request?.tradingAccount?.server || 'server.com', 'Server')}>
                      <img src="/assets/icons/CopyIcon.svg" alt="copy" />
                    </button>
                  </div>
                  <p className={styles.fieldValue}>{request?.tradingAccount?.server || 'server.com'}</p>
                </div>

                <div className={styles.credentialField}>
                  <div className={styles.fieldHeader}>
                    <label>MT5 Login ID</label>
                    <button onClick={() => handleCopy(request?.tradingAccount?.mt5LoginId || 'lucifermishra', 'Login ID')}>
                      <img src="/assets/icons/CopyIcon.svg" alt="copy" />
                    </button>
                  </div>
                  <p className={styles.fieldValue}>{request?.tradingAccount?.mt5LoginId || 'lucifermishra'}</p>
                </div>

                <div className={styles.credentialField}>
                  <div className={styles.fieldHeader}>
                    <label>Password</label>
                    <button onClick={() => handleCopy(request?.tradingAccount?.password || 'Next@123', 'Password')}>
                      <img src="/assets/icons/CopyIcon.svg" alt="copy" />
                    </button>
                  </div>
                  <p className={styles.fieldValue}>{request?.tradingAccount?.password || 'Next@123'}</p>
                </div>
              </div>
            </>
          )}

          <div className={styles.checkboxContainer}>
            <input
              type="checkbox"
              id="confirmDepositCheckbox"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
              className={styles.hiddenCheckbox}
            />
            <label htmlFor="confirmDepositCheckbox" className={styles.customCheckbox}>
              <span className={`${styles.checkboxBox} ${isChecked ? styles.checked : ''}`}>
                {isChecked && <img src="/assets/icons/check.svg" alt="check" className={styles.checkMark} />}
              </span>
              <span className={styles.checkboxLabel}>
                {isSocialPool
                  ? "I've confirmed the social pool deposit"
                  : "I've completed deposit process from broker's website"}
              </span>
            </label>
          </div>
        </div>

        <div className={styles.actions}>
          <button
            className={`${styles.btnUpload} ${!isChecked ? styles.disabled : ''}`}
            onClick={handleConfirm}
            disabled={loading || !isChecked}
          >
            {loading ? <span className={styles.spinner} /> : (
              <>
                Confirm Deposit <img src="/assets/icons/BlackRight.svg" alt="Right" />
              </>
            )}
          </button>
          <button className={styles.btnCancel} onClick={onClose}>
            Cancel <CloseIcon color="#ffffff" size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
