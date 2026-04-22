'use client';

import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './FilterModal.module.scss';

const defaultFilters = {
  dateFrom: null,
  dateTo: null,
  profitMin: '',
  profitMax: '',
  depositMin: '',
  depositMax: '',
  ibUser: '',
  status: '',
};

export default function FilterModal({ onApply, onClose, initialFilters }) {
  const [filters, setFilters] = useState(
    initialFilters
      ? {
          ...initialFilters,
          dateFrom: initialFilters.dateFrom ? new Date(initialFilters.dateFrom) : null,
          dateTo: initialFilters.dateTo ? new Date(initialFilters.dateTo) : null,
        }
      : defaultFilters,
  );

  const set = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));

  const handleApply = () => {
    onApply({
      ...filters,
      dateFrom: filters.dateFrom ? filters.dateFrom.toISOString().split('T')[0] : '',
      dateTo: filters.dateTo ? filters.dateTo.toISOString().split('T')[0] : '',
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

          {/* Profit Range */}
          <div className={styles.fieldGroup}>
            <label>Select Profit Range</label>
            <div className={styles.row}>
              <input
                type="number"
                placeholder="Min"
                className={styles.input}
                value={filters.profitMin}
                onChange={(e) => set('profitMin', e.target.value)}
              />
              <input
                type="number"
                placeholder="Max"
                className={styles.input}
                value={filters.profitMax}
                onChange={(e) => set('profitMax', e.target.value)}
              />
            </div>
          </div>

          {/* Deposit Range */}
          <div className={styles.fieldGroup}>
            <label>Select Deposit Range</label>
            <div className={styles.row}>
              <input
                type="number"
                placeholder="Min"
                className={styles.input}
                value={filters.depositMin}
                onChange={(e) => set('depositMin', e.target.value)}
              />
              <input
                type="number"
                placeholder="Max"
                className={styles.input}
                value={filters.depositMax}
                onChange={(e) => set('depositMax', e.target.value)}
              />
            </div>
          </div>

          {/* IB User & Status */}
          <div className={styles.row}>
            <div className={styles.fieldGroup} style={{ flex: 1 }}>
              <label>IB User</label>
              <select
                className={styles.select}
                value={filters.ibUser}
                onChange={(e) => set('ibUser', e.target.value)}
              >
                <option value="">All</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <div className={styles.fieldGroup} style={{ flex: 1 }}>
              <label>Status</label>
              <select
                className={styles.select}
                value={filters.status}
                onChange={(e) => set('status', e.target.value)}
              >
                <option value="">All</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <button
            className={styles.btnApply}
            onClick={handleApply}
            disabled={!!dateRangeInvalid}
          >
            Apply Filters →
          </button>
          <button className={styles.btnCancel} onClick={handleCancel}>
            Cancel ✕
          </button>
        </div>
      </div>
    </div>
  );
}
