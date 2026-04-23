'use client';

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createNotification } from '@/store/slice/adminSlice';
import styles from './sendNotifications.module.scss';
import CloseIcon from '@/icons/closeIcon';

export default function SendNotifications() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.admin);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSend = () => {
    if (!title.trim() || !description.trim()) return;
    dispatch(createNotification({ title, description })).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        setTitle('');
        setDescription('');
      }
    });
  };

  const handleCancel = () => {
    setTitle('');
    setDescription('');
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.grid}>
        {/* Send Notification */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Send Notification</h3>
          <div className={styles.fieldGroup}>
            <label>Notification Title</label>
            <input
              className={styles.input}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder=""
            />
          </div>
          <div className={styles.fieldGroup}>
            <label>Content</label>
            <textarea
              className={styles.textarea}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
            />
          </div>
          <div className={styles.actions}>
            <button className={styles.btnSend} onClick={handleSend} disabled={loading}>
              Send <img src="/assets/icons/BlackRight.svg" alt="" className={styles.btnIcon} />
            </button>
            <button className={styles.btnCancel} onClick={handleCancel}>
              Cancel <CloseIcon color="#ffffff" size={14} />
            </button>
          </div>
        </div>

        {/* Send Popup */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Send Popup</h3>
          <div className={styles.fieldGroup}>
            <label>Upload Image</label>
            <div className={styles.uploadBox}>
              <img src="/assets/icons/UplaodIcon.svg" alt="" className={styles.uploadIcon} onError={(e) => e.target.style.display='none'} />
              <span className={styles.uploadHint}>Minimum 1280X720 px</span>
              <span className={styles.uploadHint}>PNG or JPG. Upto 3 MB</span>
            </div>
          </div>
          <div className={styles.fieldGroup}>
            <label>URL</label>
            <input className={styles.input} placeholder="" />
          </div>
          <div className={styles.actions}>
            <button className={styles.btnSend}>
              Send <img src="/assets/icons/BlackRight.svg" alt="" className={styles.btnIcon} />
            </button>
            <button className={styles.btnCancel}>
              Cancel <CloseIcon color="#ffffff" size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
