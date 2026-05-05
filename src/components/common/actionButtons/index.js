import React from 'react';
import styles from './actionButtons.module.scss';
import CloseIcon from '@/icons/closeIcon';

export default function ActionButtons({
  onSave,
  onCancel,
  onDelete,
  loading = false,
  deleting = false,
  saveText = 'Save',
  cancelText = 'Cancel',
  deleteText = 'Delete',
  showDelete = false,
  saveIcon = <img src="/assets/icons/BlackRight.svg" alt="" style={{ width: 18, height: 18 }} />,
  cancelIcon = <CloseIcon color="#ffffff" size={14} />,
  layout = 'column', // 'row' or 'column'
  saveDisabled = false,
  cancelDisabled = false,
}) {
  return (
    <div className={`${styles.actions} ${styles[layout]}`}>
      <button className={styles.btnSave} onClick={onSave} disabled={loading || saveDisabled}>
        {loading ? <span className={styles.spinner} /> : <>{saveText} {saveIcon}</>}
      </button>
      
      {showDelete && onDelete && (
        <button className={styles.btnDelete} onClick={onDelete} disabled={deleting}>
          {deleting ? <span className={styles.spinner} /> : deleteText}
          <img src="/assets/icons/DeleteIcon.svg" alt="DeleteIcon" style={{ width: 18, height: 18 }} />
        </button>
      )}

      <button className={styles.btnCancel} onClick={onCancel} disabled={loading || cancelDisabled}>
        {cancelText} {cancelIcon}
      </button>
    </div>
  );
}
