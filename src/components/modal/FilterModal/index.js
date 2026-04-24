'use client';

import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Select from 'react-select';
import styles from './FilterModal.module.scss';
import Input from '@/components/input';
import { selectStyles, DropdownIndicator } from '@/components/common/selectConfig';

import CloseIcon from '@/icons/closeIcon';

const ibUserOptions = [
  { value: '', label: 'All' },
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
];

const statusOptions = [
  { value: '', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'blocked', label: 'Blocked' },
];

export const ibRequestStatusOptions = [
  { value: '', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
];

export const kycStatusOptions = [
  { value: '', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
];

export const withdrawStatusOptions = [
  { value: '', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
];

const defaultFilters = {
  dateFrom: null,
  dateTo: null,
  profitMin: '',
  profitMax: '',
  depositMin: '',
  depositMax: '',
  withdrawalMin: '',
  withdrawalMax: '',
  ibUser: ibUserOptions[0],
  status: statusOptions[0],
};

// fields: array of keys to show — 'dateRange' | 'profit' | 'deposit' | 'ibUser' | 'status'
// statusChoices: override the status dropdown options
export default function FilterModal({ onApply, onClose, initialFilters, fields, statusChoices }) {
  const show = fields ? (key) => fields.includes(key) : () => true;
  const resolvedStatusOptions = statusChoices ?? statusOptions;

  const [filters, setFilters] = useState(
    initialFilters
      ? {
          ...initialFilters,
          dateFrom: initialFilters.dateFrom ? new Date(initialFilters.dateFrom) : null,
          dateTo: initialFilters.dateTo ? new Date(initialFilters.dateTo) : null,
          ibUser: ibUserOptions.find((o) => o.value === initialFilters.ibUser) ?? null,
          status: resolvedStatusOptions.find((o) => o.value === initialFilters.status) ?? null,
        }
      : defaultFilters,
  );

  const set = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));

  const handleApply = () => {
    onApply({
      ...filters,
      dateFrom: filters.dateFrom ? filters.dateFrom.toISOString().split('T')[0] : '',
      dateTo: filters.dateTo ? filters.dateTo.toISOString().split('T')[0] : '',
      ibUser: filters.ibUser?.value ?? '',
      status: filters.status?.value ?? '',
    });
    onClose();
  };

  const handleCancel = () => {
    onApply(defaultFilters);
    onClose();
  };

  const dateRangeInvalid =
    filters.dateFrom && filters.dateTo && filters.dateFrom > filters.dateTo;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>Filters</h2>
        </div>

        <div className={styles.body}>
          {/* Date Range */}
          {show('dateRange') && (
          <div className={styles.fieldGroup}>
            <label>Select Date Range</label>
            <div className={styles.row}>
              <div className={styles.dateWrapper}>
                <DatePicker
                  selected={filters.dateFrom}
                  onChange={(date) => {
                    set('dateFrom', date);
                    // if end is now before start, clear end
                    if (filters.dateTo && date && date > filters.dateTo) {
                      set('dateTo', null);
                    }
                  }}
                  selectsStart
                  startDate={filters.dateFrom}
                  endDate={filters.dateTo}
                  placeholderText="From"
                  dateFormat="yyyy-MM-dd"
                  className={styles.input}
                  calendarClassName={styles.calendar}
                  popperClassName={styles.popper}
                />
              </div>
              <div className={styles.dateWrapper}>
                <DatePicker
                  selected={filters.dateTo}
                  onChange={(date) => set('dateTo', date)}
                  selectsEnd
                  startDate={filters.dateFrom}
                  endDate={filters.dateTo}
                  minDate={filters.dateFrom}
                  placeholderText="To"
                  dateFormat="yyyy-MM-dd"
                  className={styles.input}
                  calendarClassName={styles.calendar}
                  popperClassName={styles.popper}
                  disabled={!filters.dateFrom}
                />
              </div>
            </div>
            {dateRangeInvalid && (
              <span className={styles.error}>Start date must be before end date</span>
            )}
          </div>
          )}

          {/* Profit Range */}
          {show('profit') && (
          <div className={styles.fieldGroup}>
            <label>Select Profit Range</label>
            <div className={styles.row}>
              <Input
                plain
                type="number"
                placeholder="Min"
                value={filters.profitMin}
                onChange={(e) => set('profitMin', e.target.value)}
              />
              <Input
                plain
                type="number"
                placeholder="Max"
                value={filters.profitMax}
                onChange={(e) => set('profitMax', e.target.value)}
              />
            </div>
          </div>
          )}

          {/* Deposit Amount Range */}
          {show('deposit') && (
          <div className={styles.fieldGroup}>
            <label>Select Deposit Amount Range</label>
            <div className={styles.row}>
              <Input plain type="number" placeholder="Min" value={filters.depositMin} onChange={(e) => set('depositMin', e.target.value)} />
              <Input plain type="number" placeholder="Max" value={filters.depositMax} onChange={(e) => set('depositMax', e.target.value)} />
            </div>
          </div>
          )}

          {/* Withdrawal Amount Range */}
          {show('withdrawalAmount') && (
          <div className={styles.fieldGroup}>
            <label>Select Withdrawal Amount Range</label>
            <div className={styles.row}>
              <Input plain type="number" placeholder="Min" value={filters.withdrawalMin} onChange={(e) => set('withdrawalMin', e.target.value)} />
              <Input plain type="number" placeholder="Max" value={filters.withdrawalMax} onChange={(e) => set('withdrawalMax', e.target.value)} />
            </div>
          </div>
          )}

          {/* IB User & Status */}
          {(show('ibUser') || show('status')) && (
          <div className={styles.row}>
            {show('ibUser') && (
            <div className={styles.fieldGroup} style={{ flex: 1 }}>
              <label>IB User</label>
              <Select instanceId="filter-ib-user" options={ibUserOptions} styles={selectStyles} components={{ DropdownIndicator }} placeholder="Select..." value={filters.ibUser} onChange={(opt) => set('ibUser', opt)} isSearchable={false} />
            </div>
            )}
            {show('status') && (
            <div className={styles.fieldGroup} style={{ flex: 1 }}>
              <label>Status</label>
              <Select instanceId="filter-status" options={resolvedStatusOptions} styles={selectStyles} components={{ DropdownIndicator }} placeholder="Select..." value={filters.status} onChange={(opt) => set('status', opt)} isSearchable={false} />
            </div>
            )}
          </div>
          )}
        </div>

        <div className={styles.actions}>
          <button
            className={styles.btnApply}
            onClick={handleApply}
            disabled={!!dateRangeInvalid}
          >
            Apply Filters <img src="/assets/icons/BlackRight.svg" alt="" style={{ width: 13, height: 13 }} />
          </button>
          <button className={styles.btnCancel} onClick={handleCancel}>
            Cancel <CloseIcon color="#ffffff" size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
