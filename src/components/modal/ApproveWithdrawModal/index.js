'use client';

import React, { useState } from 'react';
import styles from './ApproveWithdrawModal.module.scss';
import CloseIcon from '@/icons/closeIcon';
import { toast } from 'react-toastify';

export default function ApproveWithdrawModal({ request, onConfirm, onClose, loading }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleConfirm = () => {
    if (!file) {
      toast.error('Please upload a screenshot first.');
      return;
    }
    onConfirm(request.id, file);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.headerTitle}>
            <h2>Approve Request?</h2>
            <p>Provide Proof of Transfer</p>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <CloseIcon color="#ffffff" size={18} />
          </button>
        </div>

        <div className={styles.body}>
          <label className={styles.uploadLabel}>Upload Screenshot</label>
          <div className={styles.uploadArea}>
            <input
              type="file"
              id="proofUpload"
              accept="image/*"
              className={styles.fileInput}
              onChange={handleFileChange}
            />
            <label htmlFor="proofUpload" className={styles.dropzone}>
              {preview ? (
                <img src={preview} alt="Preview" className={styles.previewImg} />
              ) : (
                <div className={styles.uploadPlaceholder}>
                    <img src="/assets/icons/UplaodIcon.svg" alt="" className={styles.uploadIcon} onError={(e) => e.target.src = '/assets/icons/Export.svg'} />
                  <p>PNG or JPG. Upto 3 MB</p>
                </div>
              )}
            </label>
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.btnUpload} onClick={handleConfirm} disabled={loading || !file}>
            {loading ? <span className={styles.spinner} /> : (
              <>
                Upload <img src="/assets/icons/BlackRight.svg" alt="Right" />
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
