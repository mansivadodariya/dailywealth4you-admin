'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createPoolTrade, fetchSocialPools } from '@/store/reducers';
import styles from './TradeHistoryModal.module.scss';
import Image from 'next/image';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Select from 'react-select';
import { selectStyles, DropdownIndicator } from '@/components/common/selectConfig';
import ActionButtons from '@/components/common/actionButtons';

export default function TradeHistoryModal({ onClose, onSuccess }) {
  const dispatch = useDispatch();
  const { socialPools } = useSelector((state) => state.content);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    socialPoolId: '',
    profitType: '+',
    profitLoss: '',
    tradingDate: new Date(),
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(fetchSocialPools({ page: 1, limit: 100 }));
  }, [dispatch]);

  const poolOptions = socialPools?.map((pool) => ({
    value: pool.id || pool._id,
    label: pool.title,
  })) || [];

  const typeOptions = [
    { value: '+', label: 'Profit (+)' },
    { value: '-', label: 'Loss (-)' },
  ];

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
    
    if (name === 'profitLoss') {
      // Only allow numbers and decimal point
      const cleanedValue = value.replace(/[^0-9.]/g, '');
      // Prevent multiple decimals
      const parts = cleanedValue.split('.');
      const finalValue = parts.length > 2 ? `${parts[0]}.${parts[1]}` : cleanedValue;
      
      setFormData(prev => ({ ...prev, [name]: finalValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleSelectChange = (opt) => {
    setFormData(prev => ({ ...prev, socialPoolId: opt?.value || '' }));
    if (errors.socialPoolId) setErrors(prev => ({ ...prev, socialPoolId: null }));
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const amount = formData.profitType === '-' ? `-${formData.profitLoss}` : formData.profitLoss;
      const payload = {
        socialPoolId: formData.socialPoolId,
        profitLoss: amount.toString(),
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

        <div className={styles.form}>
          <div className={styles.inputGroup}>
            <label>Social Pool</label>
            <Select
              options={poolOptions}
              styles={selectStyles}
              components={{ DropdownIndicator }}
              value={poolOptions.find(opt => opt.value === formData.socialPoolId)}
              onChange={handleSelectChange}
              placeholder="Select a pool"
            />
            {errors.socialPoolId && <span className={styles.error}>{errors.socialPoolId}</span>}
          </div>

          <div className={styles.inputGroup}>
            <label>Profit / Loss ($)</label>
            <div className={styles.rowGroup}>
              <div className={styles.typeSelect}>
                <Select
                  options={typeOptions}
                  styles={selectStyles}
                  components={{ DropdownIndicator }}
                  value={typeOptions.find(opt => opt.value === formData.profitType)}
                  onChange={(opt) => setFormData(prev => ({ ...prev, profitType: opt.value }))}
                />
              </div>
              <input 
                name="profitLoss" 
                type="text"
                inputMode="decimal"
                value={formData.profitLoss} 
                onChange={handleChange} 
                placeholder="e.g. 10.50"
              />
            </div>
            {errors.profitLoss && <span className={styles.error}>{errors.profitLoss}</span>}
          </div>

          <div className={styles.inputGroup}>
            <label>Trading Date</label>
            <div className={styles.dateWrapper}>
              <DatePicker
                selected={formData.tradingDate}
                onChange={(date) => {
                  setFormData(prev => ({ ...prev, tradingDate: date }));
                  if (errors.tradingDate) setErrors(prev => ({ ...prev, tradingDate: null }));
                }}
                dateFormat="yyyy-MM-dd"
                maxDate={new Date()}
                placeholderText="Select date"
              />
            </div>
            {errors.tradingDate && <span className={styles.error}>{errors.tradingDate}</span>}
          </div>
        </div>

        <div className={styles.footer}>
          <ActionButtons
            onSave={handleSubmit}
            onCancel={onClose}
            loading={loading}
            saveText="Create Trade"
          />
        </div>
      </div>
    </div>
  );
}
