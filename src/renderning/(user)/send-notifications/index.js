'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createNotification, createPopup, fetchPopup } from '@/store/slice/adminSlice';
import styles from './sendNotifications.module.scss';
import CloseIcon from '@/icons/closeIcon';

export default function SendNotifications() {
  const dispatch = useDispatch();
  const { loading, popup } = useSelector((state) => state.admin);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [popupLink, setPopupLink] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const fileInputRef = React.useRef(null);
  const [notifErrors, setNotifErrors] = useState({});
  const [popupErrors, setPopupErrors] = useState({});

  useEffect(() => {
    dispatch(fetchPopup());
  }, [dispatch]);

  useEffect(() => {
    if (popup) {
      setPopupLink(popup.link || '');
    }
  }, [popup]);

  const handleSend = () => {
    const errors = {};
    if (!title.trim()) errors.title = 'Notification title is required.';
    if (!description.trim()) errors.description = 'Content is required.';
    if (Object.keys(errors).length) { setNotifErrors(errors); return; }
    setNotifErrors({});
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
    setNotifErrors({});
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = (e) => {
    e.stopPropagation();
    setImageFile(null);
    setImagePreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSendPopup = () => {
    const errors = {};
    if (!imageFile) errors.image = 'Image is required.';
    if (!popupLink.trim()) errors.popupLink = 'Redirect link is required.';
    if (Object.keys(errors).length) { setPopupErrors(errors); return; }
    setPopupErrors({});
    dispatch(createPopup({ link: popupLink, file: imageFile })).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        setImageFile(null);
        setImagePreview('');
        setPopupLink('');
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    });
  };

  const handleCancelPopup = () => {
    setPopupLink(popup?.link || '');
    setImageFile(null);
    setImagePreview('');
    setPopupErrors({});
    if (fileInputRef.current) fileInputRef.current.value = '';
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
              className={`${styles.input}${notifErrors.title ? ` ${styles.inputError}` : ''}`}
              value={title}
              onChange={(e) => { setTitle(e.target.value); if (notifErrors.title) setNotifErrors((p) => ({ ...p, title: '' })); }}
              placeholder=""
            />
            {notifErrors.title && <span className={styles.errorText}>{notifErrors.title}</span>}
          </div>
          <div className={styles.fieldGroup}>
            <label>Content</label>
            <textarea
              className={`${styles.textarea}${notifErrors.description ? ` ${styles.inputError}` : ''}`}
              value={description}
              onChange={(e) => { setDescription(e.target.value); if (notifErrors.description) setNotifErrors((p) => ({ ...p, description: '' })); }}
              rows={5}
            />
            {notifErrors.description && <span className={styles.errorText}>{notifErrors.description}</span>}
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
            <div
              className={`${styles.uploadBox}${popupErrors.image ? ` ${styles.uploadBoxError}` : ''}`}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg"
                style={{ display: 'none' }}
                onChange={handleImageChange}
              />
              {imagePreview ? (
                <div className={styles.previewWrapper}>
                  <img src={imagePreview} alt="preview" className={styles.previewImg} />
                  <button className={styles.removeBtn} onClick={handleRemoveImage} type="button">✕</button>
                </div>
              ) : (
                <>
                  <img src="/assets/icons/UplaodIcon.svg" alt="" className={styles.uploadIcon} onError={(e) => e.target.style.display='none'} />
                  <span className={styles.uploadHint}>Minimum 1280X720 px</span>
                  <span className={styles.uploadHint}>PNG or JPG. Upto 3 MB</span>
                </>
              )}
            </div>
            {popupErrors.image && <span className={styles.errorText}>{popupErrors.image}</span>}
          </div>
          <div className={styles.fieldGroup}>
            <label>Redirect Link</label>
            <input
              className={`${styles.input}${popupErrors.popupLink ? ` ${styles.inputError}` : ''}`}
              value={popupLink}
              onChange={(e) => { setPopupLink(e.target.value); if (popupErrors.popupLink) setPopupErrors((p) => ({ ...p, popupLink: '' })); }}
              placeholder="https://"
            />
            {popupErrors.popupLink && <span className={styles.errorText}>{popupErrors.popupLink}</span>}
          </div>
          <div className={styles.actions}>
            <button className={styles.btnSend} onClick={handleSendPopup} disabled={loading}>
              Send <img src="/assets/icons/BlackRight.svg" alt="" className={styles.btnIcon} />
            </button>
            <button className={styles.btnCancel} onClick={handleCancelPopup}>
              Cancel <CloseIcon color="#ffffff" size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
