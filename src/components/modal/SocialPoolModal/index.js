'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createSocialPool, updateSocialPool } from '@/store/reducers';
import styles from './SocialPoolModal.module.scss';
import Image from 'next/image';

export default function SocialPoolModal({ mode, data, onClose, onSuccess }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    shortDescription: '',
    profitPercentage: '',
    minDeposit: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (mode === 'edit' && data) {
      setFormData({
        title: data.title || '',
        description: data.description || '',
        shortDescription: data.shortDescription || '',
        profitPercentage: data.profitPercentage || '',
        minDeposit: data.minDeposit || '',
      });
    }
  }, [mode, data]);

  const validate = () => {
    let newErrors = {};
    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.shortDescription) newErrors.shortDescription = 'Short description is required';
    if (!formData.profitPercentage) newErrors.profitPercentage = 'Profit percentage is required';
    if (!formData.minDeposit) newErrors.minDeposit = 'Minimum deposit is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const payload = {
        ...formData,
        profitPercentage: Number(formData.profitPercentage),
        minDeposit: Number(formData.minDeposit),
      };

      if (mode === 'edit') {
        await dispatch(updateSocialPool({ id: data.id || data._id, ...payload }));
      } else {
        await dispatch(createSocialPool(payload));
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving social pool:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>{mode === 'edit' ? 'Edit Social Pool' : 'Create Social Pool'}</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <Image src="/assets/icons/WhiteClose.svg" alt="close" width={24} height={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.grid}>
            <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
              <label>Title</label>
              <input 
                name="title" 
                value={formData.title} 
                onChange={handleChange} 
                placeholder="Social Pool Title"
              />
              {errors.title && <span className={styles.error}>{errors.title}</span>}
            </div>

            <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
              <label>Short Description</label>
              <input 
                name="shortDescription" 
                value={formData.shortDescription} 
                onChange={handleChange} 
                placeholder="Brief summary..."
              />
              {errors.shortDescription && <span className={styles.error}>{errors.shortDescription}</span>}
            </div>

            <div className={styles.inputGroup}>
              <label>Profit Share (%)</label>
              <input 
                name="profitPercentage" 
                type="number"
                value={formData.profitPercentage} 
                onChange={handleChange} 
                placeholder="10"
              />
              {errors.profitPercentage && <span className={styles.error}>{errors.profitPercentage}</span>}
            </div>

            <div className={styles.inputGroup}>
              <label>Min. Deposit ($)</label>
              <input 
                name="minDeposit" 
                type="number"
                value={formData.minDeposit} 
                onChange={handleChange} 
                placeholder="100"
              />
              {errors.minDeposit && <span className={styles.error}>{errors.minDeposit}</span>}
            </div>

            <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
              <label>Full Description</label>
              <textarea 
                name="description" 
                value={formData.description} 
                onChange={handleChange} 
                placeholder="Detailed information about this social pool..."
              />
              {errors.description && <span className={styles.error}>{errors.description}</span>}
            </div>
          </div>

          <div className={styles.footer}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancel</button>
            <button type="submit" className={styles.saveBtn} disabled={loading}>
              {loading ? 'Saving...' : (mode === 'edit' ? 'Update Pool' : 'Create Pool')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
