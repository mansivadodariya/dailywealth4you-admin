'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createPoolTrade, fetchSocialPools } from '@/store/reducers';
import styles from './TradeHistoryModal.module.scss';
import Image from 'next/image';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function TradeHistoryModal({ onClose, onSuccess }) {
  const dispatch = useDispatch();
  const { socialPools } = useSelector((state) => state.content);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    socialPoolId: '',
    profitLoss: '',
    tradingDate: new Date(),
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(fetchSocialPools({ page: 1, limit: 100 }));
  }, [dispatch]);

  const validate = () => {
    let newErrors = {};
    if (!formData.socialPoolId) newErrors.socialPoolId = 'Please select a social pool';
    if (!formData.profitLoss) newErrors.profitLoss = 'Profit/Loss amount is required';
    if (!formData.tradingDate) newErrors.tradingDate = 'Trading date is required';
    
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
        socialPoolId: formData.socialPoolId,
        profitLoss: formData.profitLoss.toString(),
        tradingDate: formData.tradingDate.toISOString().split('T')[0],
      };

      await dispatch(createPoolTrade(payload));
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating pool trade:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>Create Pool Trade</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <Image src="/assets/icons/WhiteClose.svg" alt="close" width={24} height={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label>Social Pool</label>
            <select 
              name="socialPoolId" 
              value={formData.socialPoolId} 
              onChange={handleChange}
            >
              <option value="">Select a pool</option>
              {socialPools.map((pool) => (
                <option key={pool.id || pool._id} value={pool.id || pool._id}>
                  {pool.title}
                </option>
              ))}
            </select>
            {errors.socialPoolId && <span className={styles.error}>{errors.socialPoolId}</span>}
          </div>

          <div className={styles.inputGroup}>
            <label>Profit / Loss ($)</label>
            <input 
              name="profitLoss" 
              type="number"
              step="0.01"
              value={formData.profitLoss} 
              onChange={handleChange} 
              placeholder="e.g. 10.50"
            />
            {errors.profitLoss && <span className={styles.error}>{errors.profitLoss}</span>}
          </div>

          <div className={styles.inputGroup}>
            <label>Trading Date</label>
            <div className={styles.dateWrapper}>
              <DatePicker
                selected={formData.tradingDate}
                onChange={(date) => setFormData(prev => ({ ...prev, tradingDate: date }))}
                dateFormat="yyyy-MM-dd"
                maxDate={new Date()}
                className={styles.dateInput}
              />
            </div>
            {errors.tradingDate && <span className={styles.error}>{errors.tradingDate}</span>}
          </div>

          <div className={styles.footer}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancel</button>
            <button type="submit" className={styles.saveBtn} disabled={loading}>
              {loading ? 'Creating...' : 'Create Trade'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
