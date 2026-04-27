'use client';
import React, { useState } from 'react';
import styles from './ApproveDepositModal.module.scss';
import CloseIcon from '@/icons/closeIcon';
import RightIcon from '@/icons/rightIcon';
import { toast } from 'react-toastify';


export default function ApproveDepositModal({ request, onConfirm, onClose, loading }) {
  const [isChecked, setIsChecked] = useState(false);

  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const handleConfirm = () => {
    if (!isChecked) return;
    // For this flow, we might not need a file, but the API expects one or at least the call.
    // Given the new UI, maybe we just send the status update.
    onConfirm(request.id);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.headerTitle}>
            <h2>Deposit?</h2>
            <p>Deposit Funds in Below MT5 Account</p>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <CloseIcon color="#ffffff" size={18} />
          </button>
        </div>

        <div className={styles.body}>
          <h3 className={styles.sectionTitle}>MT5 Account Credentials</h3>
          
          <div className={styles.credentialsGrid}>
            <div className={styles.credentialField}>
              <div className={styles.fieldHeader}>
                <label>Broker Name</label>
                <button onClick={() => handleCopy(request?.broker || 'Exness', 'Broker Name')}>
                  <img src="/assets/icons/CopyIcon.svg" alt="copy" />
                </button>
              </div>
              <p className={styles.fieldValue}>{request?.broker || 'Exness'}</p>
            </div>

            <div className={styles.credentialField}>
              <div className={styles.fieldHeader}>
                <label>Server</label>
                <button onClick={() => handleCopy(request?.server || 'server.com', 'Server')}>
                  <img src="/assets/icons/CopyIcon.svg" alt="copy" />
                </button>
              </div>
              <p className={styles.fieldValue}>{request?.server || 'server.com'}</p>
            </div>

            <div className={styles.credentialField}>
              <div className={styles.fieldHeader}>
                <label>MT5 Login ID</label>
                <button onClick={() => handleCopy(request?.mtsAccount || 'lucifermishra', 'Login ID')}>
                  <img src="/assets/icons/CopyIcon.svg" alt="copy" />
                </button>
              </div>
              <p className={styles.fieldValue}>{request?.mtsAccount || 'lucifermishra'}</p>
            </div>

            <div className={styles.credentialField}>
              <div className={styles.fieldHeader}>
                <label>Password</label>
                <button onClick={() => handleCopy(request?.mt5Password || 'Next@123', 'Password')}>
                  <img src="/assets/icons/CopyIcon.svg" alt="copy" />
                </button>
              </div>
              <p className={styles.fieldValue}>{request?.mt5Password || 'Next@123'}</p>
            </div>
          </div>

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
              <span className={styles.checkboxLabel}>I’ve completed deposit process from broker’s website</span>
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
                Confirm Deposit <RightIcon color="#030f0f" size={18} />
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
