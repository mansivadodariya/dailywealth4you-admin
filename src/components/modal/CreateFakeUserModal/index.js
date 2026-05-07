'use client';

import React, { useState, useEffect } from 'react';
import styles from './CreateFakeUserModal.module.scss';
import Image from 'next/image';
import api from '@/service/api';
import { CREATE_FAKE_PERFORMANCE, GET_ALL_BROKERS_ADMIN, UPDATE_FAKE_PERFORMANCE } from '@/service/url';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


export default function CreateFakeUserModal({ onClose, onSuccess, editData }) {
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(editData?.createdAt ? new Date(editData.createdAt) : new Date());
  const [brokers, setBrokers] = useState([]);
  const [brokersLoading, setBrokersLoading] = useState(false);

  // Fetch brokers on mount
  useEffect(() => {
    const loadBrokers = async () => {
      setBrokersLoading(true);
      try {
        const res = await api.get(`${GET_ALL_BROKERS_ADMIN}?page=1&limit=100`);
        // Handle various response structures (root.payload.data, root.payload.payload.data, root.data, etc.)
        const root = res?.payload ?? res?.data ?? res;
        const inner = root?.payload ?? root?.data ?? root;
        const data = Array.isArray(inner?.data) ? inner.data : (Array.isArray(inner) ? inner : []);
        setBrokers(data);
      } catch (err) {
        console.error('Failed to fetch brokers:', err);
      } finally {
        setBrokersLoading(false);
      }
    };
    loadBrokers();
  }, []);
  const [formData, setFormData] = useState({
    firstName: editData?.user?.firstName || '',
    lastName: editData?.user?.lastName || '',
    email: editData?.user?.email || '',
    createdAt: editData?.createdAt ? editData.createdAt.split('T')[0] : new Date().toISOString().split('T')[0],
    investment: editData?.investment ?? '',
    currentBalance: editData?.currentBalance ?? '',
    totalProfit: editData?.totalProfit ?? '',
    profitPercentage: editData?.profitPercentage ?? '',
    mt5LoginId: editData?.mt5LoginId || '',
    password: editData?.password || '',
    server: editData?.server || '',
    brokerName: editData?.broker?.name || '',
    logo: editData?.broker?.logo || ''
  });


  const [errors, setErrors] = useState({});

  const validate = () => {
    let newErrors = {};
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email address is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Please enter a valid email address';

    if (!formData.mt5LoginId) newErrors.mt5LoginId = 'MT5 Login ID is required';
    if (!formData.brokerName) newErrors.brokerName = 'Please select a broker';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!formData.server) newErrors.server = 'Server name is required';

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
      [name]: value
    }));
  };

  const handleBrokerSelect = (e) => {
    const selectedName = e.target.value;
    if (!selectedName) {
      setFormData(prev => ({ ...prev, brokerName: '', logo: '' }));
      return;
    }
    const broker = brokers.find(b => b.name === selectedName);
    if (broker) {
      setFormData(prev => ({
        ...prev,
        brokerName: broker.name || '',
        logo: broker.logo || ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const submitData = {
        ...formData,
        investment: Number(formData.investment),
        currentBalance: Number(formData.currentBalance),
        totalProfit: Number(formData.totalProfit),
        profitPercentage: Number(formData.profitPercentage),
      };

      if (editData) {
        const id = editData.id || editData._id || editData.tradingAccountId;

        // Diffing to send only changed fields
        const changedFields = {};
        const initialMap = {
          firstName: editData?.user?.firstName || '',
          lastName: editData?.user?.lastName || '',
          email: editData?.user?.email || '',
          createdAt: editData?.createdAt ? editData.createdAt.split('T')[0] : new Date().toISOString().split('T')[0],
          investment: Number(editData?.investment ?? 0),
          currentBalance: Number(editData?.currentBalance ?? 0),
          totalProfit: Number(editData?.totalProfit ?? 0),
          profitPercentage: Number(editData?.profitPercentage ?? 0),
          mt5LoginId: editData?.mt5LoginId || '',
          password: editData?.password || '',
          server: editData?.server || '',
          brokerName: editData?.broker?.name || '',
          logo: editData?.broker?.logo || ''
        };

        Object.keys(submitData).forEach(key => {
          let currentVal = submitData[key];
          let initialVal = initialMap[key];

          // Special handling for date strings if needed, but split('T')[0] should match
          if (currentVal !== initialVal) {
            changedFields[key] = currentVal;
          }
        });

        if (Object.keys(changedFields).length === 0) {
          toast.info('No changes made');
          setLoading(false);
          onClose();
          return;
        }

        await api.put(`${UPDATE_FAKE_PERFORMANCE}?id=${id}`, changedFields);
        toast.success('Fake user updated successfully');
      } else {
        await api.post(CREATE_FAKE_PERFORMANCE, submitData);
        toast.success('Fake user created successfully');
      }
      onSuccess();
      } catch (error) {
        console.error('Error saving fake user:', error);
        toast.error(error?.response?.data?.message || `Failed to ${editData ? 'update' : 'create'} fake user`);
      } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>{editData ? 'Edit Performance User' : 'Add Performance User'}</h2>
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
              <select
                className={styles.selectInput}
                value={formData.brokerName || ''}
                onChange={handleBrokerSelect}
              >
                <option value="">{brokersLoading ? 'Loading brokers...' : 'Select Broker'}</option>
                {brokers.map(broker => (
                  <option key={broker._id || broker.id} value={broker.name}>
                    {broker.name}
                  </option>
                ))}
              </select>
              {errors.brokerName && <span className={styles.error}>{errors.brokerName}</span>}
            </div>
            {formData.logo && (
              <div className={styles.inputGroup}>
                <label>Broker Logo</label>
                <div className={styles.previewWrap}>
                  <img src={formData.logo} alt="Logo" className={styles.logoPreview} />
                </div>
              </div>
            )}

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
              {loading ? (editData ? 'Updating...' : 'Creating...') : (editData ? 'Update Fake User' : 'Create Fake User')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
