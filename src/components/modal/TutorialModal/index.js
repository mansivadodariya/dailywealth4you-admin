'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { createTutorial, updateTutorial, deleteTutorial, uploadImage } from '@/store/reducers';
import styles from './TutorialModal.module.scss';
import CloseIcon from '@/icons/closeIcon';

export default function TutorialModal({ mode = 'add', tutorial, onClose, onDone }) {
  const dispatch = useDispatch();
  const isAdd = mode === 'add';

  const fileInputRef = useRef(null);
  const [videoUrl, setVideoUrl] = useState(tutorial?.videoUrl ?? '');
  const [thumbnail, setThumbnail] = useState(tutorial?.thumbnail ?? '');
  const [description, setDescription] = useState(tutorial?.description ?? '');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const deletionStarted = useRef(false);
  // auto-trigger delete if opened in delete mode
  useEffect(() => {
    if (mode === 'delete' && tutorial?.id && !deletionStarted.current) {
      deletionStarted.current = true;
      handleDelete();
    }
  }, []);

  const handleThumbnailChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrors((p) => ({ ...p, thumbnail: 'Only image files are allowed.' }));
      return;
    }

    setUploading(true);
    setErrors((p) => ({ ...p, thumbnail: '' }));

    const formData = new FormData();
    formData.append('image', file);

    dispatch(uploadImage(formData)).then((res) => {
      setUploading(false);
      if (res.meta.requestStatus === 'fulfilled') {
        const url = res.payload?.payload || res.payload;
        if (typeof url === 'string') {
          setThumbnail(url);
        } else {
          setErrors((p) => ({ ...p, thumbnail: 'Invalid response from server.' }));
        }
      } else {
        setErrors((p) => ({ ...p, thumbnail: 'Upload failed. Please try again.' }));
      }
    });
  };

  const validate = () => {
    const e = {};
    if (!videoUrl.trim()) e.videoUrl = 'Video URL is required.';
    if (!thumbnail) e.thumbnail = 'Thumbnail image is required.';
    if (!description.trim()) e.description = 'Description is required.';
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setLoading(true);
    const action = isAdd
      ? createTutorial({ videoUrl, thumbnail, description })
      : updateTutorial({ id: tutorial.id, original: tutorial, videoUrl, thumbnail, description });
    dispatch(action).then((res) => {
      setLoading(false);
      if (res.meta.requestStatus === 'fulfilled') { onDone?.(); onClose(); }
    });
  };

  const handleDelete = () => {
    setDeleting(true);
    dispatch(deleteTutorial(tutorial.id)).then((res) => {
      setDeleting(false);
      if (res.meta.requestStatus === 'fulfilled') { onDone?.(); onClose(); }
    });
  };

  if (mode === 'delete') return null;

  const fields = [
    { label: 'Video URL', value: videoUrl, set: setVideoUrl, key: 'videoUrl', placeholder: 'Enter video URL' },
    { label: 'Title', value: description, set: setDescription, key: 'description', textarea: true },
  ];

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>{isAdd ? 'Add Tutorial' : 'Edit Tutorial'}</h2>
          <button className={styles.closeBtn} onClick={onClose}><CloseIcon color="#fff" size={18} /></button>
        </div>
        <div className={styles.divider} />
        <div className={styles.body}>
          {/* Thumbnail upload */}
          <div className={styles.fieldGroup}>
            <label>Thumbnail Image</label>
            <div
              className={`${styles.uploadBox}${errors.thumbnail ? ` ${styles.uploadBoxError}` : ''}`}
              onClick={() => !uploading && fileInputRef.current?.click()}
            >
              <input 
                ref={fileInputRef} 
                type="file" 
                accept="image/*" 
                style={{ display: 'none' }} 
                onChange={handleThumbnailChange} 
              />
              {uploading ? (
                <div className={styles.uploadLoading}>
                  <div className={styles.innerSpinner} />
                  <span>Uploading...</span>
                </div>
              ) : thumbnail ? (
                <img src={thumbnail} alt="Thumbnail Preview" className={styles.thumbnailPreview} />
              ) : (
                <div className={styles.uploadPlaceholder}>
                  <div className={styles.uploadIconWrap}>
                        <img src="/assets/icons/UplaodIcon.svg" alt="" />
                    {/* <div className={styles.addPlus}>+</div> */}
                  </div>
                  <span className={styles.uploadTypeHint}>JPG, PNG or WEBP</span>
                </div>
              )}
            </div>
            {errors.thumbnail && <span className={styles.errorText}>{errors.thumbnail}</span>}
          </div>

          {fields.map(({ label, value, set, key, placeholder, textarea }) => (
            <div className={styles.fieldGroup} key={key}>
              <label>{label}</label>
              {textarea ? (
                <textarea
                  className={`${styles.textarea}${errors[key] ? ` ${styles.inputError}` : ''}`}
                  value={value}
                  rows={4}
                  onChange={(e) => { set(e.target.value); setErrors((p) => ({ ...p, [key]: '' })); }}
                />
              ) : (
                <input
                  className={`${styles.input}${errors[key] ? ` ${styles.inputError}` : ''}`}
                  value={value}
                  placeholder={placeholder}
                  onChange={(e) => { set(e.target.value); setErrors((p) => ({ ...p, [key]: '' })); }}
                />
              )}
              {errors[key] && <span className={styles.errorText}>{errors[key]}</span>}
            </div>
          ))}
        </div>

        <div className={styles.actions}>
          <button className={styles.btnSave} onClick={handleSubmit} disabled={loading}>
            {loading ? <span className={styles.spinner} /> : <>{isAdd ? 'Add Tutorial' : 'Save Changes'} <img src="/assets/icons/BlackRight.svg" alt="" style={{ width: 18, height: 18 }} /></>}
          </button>
          {!isAdd && (
            <button className={styles.btnDelete} onClick={handleDelete} disabled={deleting}>
              {deleting ? <span className={styles.spinner} /> : 'Delete Tutorial'}
            </button>
          )}
          <button className={styles.btnCancel} onClick={onClose}>
            Cancel <CloseIcon color="#fff" size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
