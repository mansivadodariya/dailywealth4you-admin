'use client';

import React, { useState } from 'react';
import styles from './CreateFakeUserModal.module.scss';
import Image from 'next/image';
import api from '@/service/api';
import { CREATE_FAKE_PERFORMANCE, UPLOAD_IMAGE } from '@/service/url';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


export default function CreateFakeUserModal({ onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [logoLoading, setLogoLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    createdAt: new Date().toISOString().split('T')[0],
    investment: 0,
    currentBalance: 0,
    totalProfit: 0,
    profitPercentage: 0,
    mt5LoginId: '',
    password: '',
    server: '',
    brokerName: '',
    logo: ''
  });


  const [errors, setErrors] = useState({});

  const validate = () => {
    let newErrors = {};
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email address is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Please enter a valid email address';
    
    if (!formData.mt5LoginId) newErrors.mt5LoginId = 'MT5 Login ID is required';
    if (!formData.brokerName) newErrors.brokerName = 'Broker name is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!formData.server) newErrors.server = 'Server name is required';
    if (!formData.logo) newErrors.logo = 'Please upload a broker logo';

    if (formData.investment === '' || formData.investment === null) newErrors.investment = 'Investment amount is required';
    if (formData.currentBalance === '' || formData.currentBalance === null) newErrors.currentBalance = 'Current balance is required';
    if (formData.totalProfit === '' || formData.totalProfit === null) newErrors.totalProfit = 'Total profit is required';
    
    if (formData.profitPercentage === '' || formData.profitPercentage === null) {
      newErrors.profitPercentage = 'Profit percentage is required';
    } else if (Number(formData.profitPercentage) > 100) {
      newErrors.profitPercentage = 'Profit percentage cannot exceed 100%';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: (name === 'investment' || name === 'currentBalance' || name === 'totalProfit' || name === 'profitPercentage') 
        ? Number(value) 
        : value
    }));
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLogoLoading(true);
    const formDataUpload = new FormData();
    formDataUpload.append('image', file);

    try {
      const res = await api.post(UPLOAD_IMAGE, formDataUpload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      // Handle payload as either direct URL string or payload.data
      const url = typeof res.payload === 'string' ? res.payload : (res.payload?.url || res.data?.url || res.payload);
      setFormData(prev => ({ ...prev, logo: url }));
      toast.success('Logo uploaded successfully');
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast.error('Failed to upload logo');
    } finally {
      setLogoLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await api.post(CREATE_FAKE_PERFORMANCE, formData);
      toast.success('Fake user created successfully');
      onSuccess();
    } catch (error) {
      console.error('Error creating fake user:', error);
      toast.error(error?.response?.data?.message || 'Failed to create fake user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>Add Fake Performance User</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <Image src="/assets/icons/WhiteClose.svg" alt="close" width={24} height={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.grid}>
            <div className={styles.inputGroup}>
              <label>First Name</label>
              <input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" />
              {errors.firstName && <span className={styles.error}>{errors.firstName}</span>}
            </div>
            <div className={styles.inputGroup}>
              <label>Last Name</label>
              <input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" />
              {errors.lastName && <span className={styles.error}>{errors.lastName}</span>}
            </div>
            <div className={styles.inputGroup}>
              <label>Email</label>
              <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" type="email" />
              {errors.email && <span className={styles.error}>{errors.email}</span>}
            </div>
            <div className={styles.inputGroup}>
              <label>Joined Date</label>
              <div className={styles.dateWrapper}>

              <DatePicker
                selected={selectedDate}
                onChange={(date) => {
                  setSelectedDate(date);
                  setFormData(prev => ({
                    ...prev,
                    createdAt: date ? date.toISOString() : ''
                  }));
                }}
                dateFormat="dd/MM/yyyy"
                placeholderText="Select date"
                maxDate={new Date()}
                className={styles.input}
                calendarClassName={styles.calendar}
                popperClassName={styles.popper}
                dropdownMode="select"
              />
              </div>
            </div>


            <div className={styles.divider}>Account Details</div>

            <div className={styles.inputGroup}>
              <label>MT5 Login ID</label>
              <input name="mt5LoginId" value={formData.mt5LoginId} onChange={handleChange} placeholder="12345" />
              {errors.mt5LoginId && <span className={styles.error}>{errors.mt5LoginId}</span>}
            </div>
            <div className={styles.inputGroup}>
              <label>Password</label>
              <input name="password" value={formData.password} onChange={handleChange} placeholder="Password" type="password" />
              {errors.password && <span className={styles.error}>{errors.password}</span>}
            </div>
            <div className={styles.inputGroup}>
              <label>Server</label>
              <input name="server" value={formData.server} onChange={handleChange} placeholder="Server Name" />
              {errors.server && <span className={styles.error}>{errors.server}</span>}
            </div>
            <div className={styles.inputGroup}>
              <label>Broker Name</label>
              <input name="brokerName" value={formData.brokerName} onChange={handleChange} placeholder="Broker Name" />
              {errors.brokerName && <span className={styles.error}>{errors.brokerName}</span>}
            </div>
            <div className={styles.inputGroup}>
              <label>Broker Logo</label>
              <div className={styles.uploadBox}>
                {formData.logo ? (
                  <div className={styles.previewWrap}>
                    <img src={formData.logo} alt="Logo" className={styles.logoPreview} />
                    <button type="button" className={styles.removeImg} onClick={() => setFormData(prev => ({ ...prev, logo: '' }))}>×</button>
                  </div>
                ) : (
                  <label className={styles.uploadLabel}>
                    <input type="file" accept="image/*" onChange={handleLogoUpload} hidden />
                    <span>{logoLoading ? 'Uploading...' : 'Choose Logo'}</span>
                  </label>
                )}
              </div>
              {errors.logo && <span className={styles.error}>{errors.logo}</span>}
            </div>

            <div className={styles.divider}>Financials</div>

            <div className={styles.inputGroup}>
              <label>Investment ($)</label>
              <input name="investment" value={formData.investment} onChange={handleChange} type="number" />
              {errors.investment && <span className={styles.error}>{errors.investment}</span>}
            </div>
            <div className={styles.inputGroup}>
              <label>Balance ($)</label>
              <input name="currentBalance" value={formData.currentBalance} onChange={handleChange} type="number" />
              {errors.currentBalance && <span className={styles.error}>{errors.currentBalance}</span>}
            </div>
            <div className={styles.inputGroup}>
              <label>Total Profit ($)</label>
              <input name="totalProfit" value={formData.totalProfit} onChange={handleChange} type="number" />
              {errors.totalProfit && <span className={styles.error}>{errors.totalProfit}</span>}
            </div>
            <div className={styles.inputGroup}>
              <label>Profit Percentage (%)</label>
              <input name="profitPercentage" value={formData.profitPercentage} onChange={handleChange} type="number" />
              {errors.profitPercentage && <span className={styles.error}>{errors.profitPercentage}</span>}
            </div>


          </div>

          <div className={styles.footer}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancel</button>
            <button type="submit" className={styles.saveBtn} disabled={loading}>
              {loading ? 'Creating...' : 'Create Fake User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
