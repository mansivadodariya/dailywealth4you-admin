'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBroker, updateBroker, deleteBroker } from '@/store/reducers';
import styles from './BrokerModal.module.scss';
import CloseIcon from '@/icons/closeIcon';
import ActionButtons from '@/components/common/actionButtons';

export default function BrokerModal({ mode = 'add', broker, onClose, onDone }) {
  const dispatch = useDispatch();
  const isAdd = mode === 'add';
  const fileInputRef = useRef(null);

  const [name, setName] = useState(broker?.name ?? '');
  const [description, setDescription] = useState(broker?.description ?? '');
  const [redirectURL, setRedirectURL] = useState(broker?.redirectURL ?? '');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(broker?.logo ?? '');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const deletionStarted = useRef(false);
  // auto-trigger delete if opened in delete mode
  useEffect(() => {
    if (mode === 'delete' && broker?.id && !deletionStarted.current) {
      deletionStarted.current = true;
      handleDelete();
    }
  }, []);

  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = 'Name is required.';
    if (!redirectURL.trim()) e.redirectURL = 'Redirect URL is required.';
    if (isAdd && !imageFile) e.image = 'Image is required.';
    return e;
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation: Only images are allowed
    if (!file.type.startsWith('image/')) {
      setErrors((p) => ({ ...p, image: 'Only image files are allowed.' }));
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setErrors((p) => ({ ...p, image: '' }));
  };

  const handleSubmit = () => {
    const e = validate();    
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setLoading(true);
    const action = isAdd
      ? createBroker({ name, description, redirectURL, file: imageFile })
      : updateBroker({ id: broker.id, original: broker, name, description, redirectURL, file: imageFile });
    dispatch(action).then((res) => {
      setLoading(false);
      if (res.meta.requestStatus === 'fulfilled') { onDone?.(); onClose(); }
    });
  };

  const handleDelete = () => {
    setDeleting(true);
    dispatch(deleteBroker(broker.id)).then((res) => {
      setDeleting(false);
      if (res.meta.requestStatus === 'fulfilled') { onDone?.(); onClose(); }
    });
  };

  if (mode === 'delete') return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>{isAdd ? 'Add Broker' : 'Edit Broker'}</h2>
          <button className={styles.closeBtn} onClick={onClose}><CloseIcon color="#fff" size={18} /></button>
        </div>
        <div className={styles.divider} />
        <div className={styles.body}>
          {/* Image upload */}
          <div className={styles.fieldGroup}>
            <label>Image</label>
            <div
              className={`${styles.uploadBox}${errors.image ? ` ${styles.uploadBoxError}` : ''}`}
              onClick={() => fileInputRef.current?.click()}
            >
              <input ref={fileInputRef} type="file" accept="image/png,image/jpeg" style={{ display: 'none' }} onChange={handleImageChange} />
              {imagePreview
                ? <img src={imagePreview} alt="preview" className={styles.previewImg} />
                : <span className={styles.uploadHint}>Click to upload image</span>}
            </div>
            {errors.image && <span className={styles.errorText}>{errors.image}</span>}
          </div>

          {[
            { label: 'Name', value: name, set: setName, key: 'name' },
            { label: 'Redirect URL', value: redirectURL, set: setRedirectURL, key: 'redirectURL', placeholder: 'https://' },
          ].map(({ label, value, set, key, placeholder }) => (
            <div className={styles.fieldGroup} key={key}>
              <label>{label}</label>
              <input
                className={`${styles.input}${errors[key] ? ` ${styles.inputError}` : ''}`}
                value={value}
                placeholder={placeholder ?? ''}
                onChange={(e) => { set(e.target.value); setErrors((p) => ({ ...p, [key]: '' })); }}
              />
              {errors[key] && <span className={styles.errorText}>{errors[key]}</span>}
            </div>
          ))}

        </div>

        <div className={styles.actions}>
          <ActionButtons
            onSave={handleSubmit}
            onCancel={onClose}
            onDelete={handleDelete}
            loading={loading}
            deleting={deleting}
            saveText={isAdd ? 'Add Broker' : 'Save Changes'}
            deleteText="Delete Broker"
            showDelete={!isAdd}
          />
        </div>
      </div>
    </div>
  );
}
