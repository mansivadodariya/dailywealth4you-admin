'use client';

import React, { useState } from 'react';
import styles from './ManualEntryModal.module.scss';
import Input from '@/components/input';
import CloseIcon from '@/icons/closeIcon';
import ActionButtons from '@/components/common/actionButtons';
import Select from 'react-select';
import { selectStyles, DropdownIndicator } from '@/components/common/selectConfig';
import api from '@/service/api';
import { UPLOAD_MANUAL_TRADE_HISTORY } from '@/service/url';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';

const TYPE_OPTIONS = [
  { value: 'Buy', label: 'Buy' },
  { value: 'Sell', label: 'Sell' },
];



export default function ManualEntryModal({ userId, accounts = [], onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({
    orderId: '',
    tradingDate: null,
    type: '',
    volume: '',
    item: '',
    openPrice: '',
    closePrice: '',
    profitLoss: '',
  });

  const [selectedAcc, setSelectedAcc] = useState(null);
  const [errors, setErrors] = useState({});

  const accountOptions = accounts.map((acc) => ({
    value: acc.id,
    label: `${acc.brokerName ?? 'Unknown'} (${acc.mt5LoginId ?? acc.id})`,
    brokerId: acc.brokerId,
    accountId: acc.mt5LoginId || acc.id,
  }));

  const set = (key, val) => {
    setValues((prev) => ({ ...prev, [key]: val }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: null }));
  };



  const handleAccountChange = (opt) => {
    setSelectedAcc(opt);
    if (errors.account) setErrors((prev) => ({ ...prev, account: null }));
  };

  const handleSave = async () => {
    const newErrors = {};
    if (!selectedAcc) {
      newErrors.account = 'Trading Account is required';
    }
    const required = ['orderId', 'tradingDate', 'type', 'volume', 'item', 'openPrice', 'closePrice', 'profitLoss'];
    required.forEach((key) => {
      if (!values[key]) {
        newErrors[key] = `${key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())} is required`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);

      const payload = {
        userId,
        brokerId: selectedAcc.brokerId,
        accountId: selectedAcc.accountId,
        orderId: values.orderId,
        tradingDate: moment(values.tradingDate).format('YYYY-MM-DD'),
        type: values.type,
        volume: Number(values.volume),
        item: values.item,
        openPrice: Number(values.openPrice),
        closePrice: Number(values.closePrice),
        profitLoss: Number(values.profitLoss),
      };

      await api.post(UPLOAD_MANUAL_TRADE_HISTORY, payload);
      toast.success('Manual trade history uploaded successfully');
      onSuccess?.();
      onClose();
    } catch (error) {
      // Error handled by interceptor
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>Manual Trade Entry</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <CloseIcon color="#ffffff" size={18} />
          </button>
        </div>

        <div className={styles.grid}>
          <div className={styles.field} style={{ gridColumn: 'span 2' }}>
            <label>Select Account (Required)</label>
            <Select
              options={accountOptions}
              styles={selectStyles}
              components={{ DropdownIndicator }}
              onChange={handleAccountChange}
              value={selectedAcc}
              placeholder="Pick a trading account..."
            />
            {errors.account && <span className={styles.error}>{errors.account}</span>}
          </div>

          <div className={styles.field}>
            <label>Order ID</label>
            <Input value={values.orderId} onChange={(e) => set('orderId', e.target.value)} placeholder="e.g. 506545466" />
            {errors.orderId && <span className={styles.error}>{errors.orderId}</span>}
          </div>
          <div className={styles.field}>
            <label>Trading Date & Time</label>
            <div className={styles.dateWrapper}>
              <DatePicker
                selected={values.tradingDate}
                onChange={(date) => { if (date) set('tradingDate', date); }}
                dateFormat="yyyy-MM-dd"
                placeholderText="Pick date"
                className={styles.input}
                calendarClassName={styles.calendar}
                popperClassName={styles.popper}
              />
            </div>
            {errors.tradingDate && <span className={styles.error}>{errors.tradingDate}</span>}
          </div>

          <div className={styles.field}>
            <label>Type</label>
            <Select
              options={TYPE_OPTIONS}
              styles={selectStyles}
              components={{ DropdownIndicator }}
              value={TYPE_OPTIONS.find((o) => o.value === values.type)}
              onChange={(opt) => set('type', opt?.value)}
              placeholder="Select Type"
            />
            {errors.type && <span className={styles.error}>{errors.type}</span>}
          </div>
          <div className={styles.field}>
            <label>Item</label>
            <Input value={values.item} onChange={(e) => set('item', e.target.value)} placeholder="e.g. EURUSD" />
            {errors.item && <span className={styles.error}>{errors.item}</span>}
          </div>
          <div className={styles.field}>
            <label>Volume</label>
            <Input type="number" step="any" value={values.volume} onChange={(e) => set('volume', e.target.value)} placeholder="0.00" />
            {errors.volume && <span className={styles.error}>{errors.volume}</span>}
          </div>
          <div className={styles.field}>
            <label>Open Price</label>
            <Input type="number" step="any" value={values.openPrice} onChange={(e) => set('openPrice', e.target.value)} placeholder="0.00" />
            {errors.openPrice && <span className={styles.error}>{errors.openPrice}</span>}
          </div>
          <div className={styles.field}>
            <label>Close Price</label>
            <Input type="number" step="any" value={values.closePrice} onChange={(e) => set('closePrice', e.target.value)} placeholder="0.00" />
            {errors.closePrice && <span className={styles.error}>{errors.closePrice}</span>}
          </div>
          <div className={styles.field}>
            <label>Profit/Loss</label>
            <Input type="number" step="any" value={values.profitLoss} onChange={(e) => set('profitLoss', e.target.value)} placeholder="0.00" />
            {errors.profitLoss && <span className={styles.error}>{errors.profitLoss}</span>}
          </div>
        </div>

        <ActionButtons
          onSave={handleSave}
          onCancel={onClose}
          loading={loading}
          layout="row"
        />
      </div>
    </div>
  );
}
