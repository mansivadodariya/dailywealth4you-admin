'use client';

import React, { useState, useEffect, useCallback } from 'react';
import styles from './TopTenSelectModal.module.scss';
import Image from 'next/image';
import DataTable from '@/components/dataTable';
import Pagination from '@/components/pagination';
import api from '@/service/api';
import { GET_ALL_USER_ACC_PERFORMANCE } from '@/service/url';
import Loader from '@/components/loader';

export default function TopTenSelectModal({ currentTopTen, onSave, onClose, saving }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  
  // Keep track of full performance objects to avoid extra API calls in parent
  const [selectedPerformances, setSelectedPerformances] = useState([]);

  // Initialize from current Top Ten
  useEffect(() => {
    if (currentTopTen && selectedPerformances.length === 0) {
      setSelectedPerformances(currentTopTen);
    }
  }, [currentTopTen]);

  const fetchAllPerformance = useCallback(async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page,
        limit: 10,
      });
      if (search) {
        queryParams.append('search', search);
      }
      const res = await api.get(`${GET_ALL_USER_ACC_PERFORMANCE}?${queryParams.toString()}`);
      
      const list = Array.isArray(res?.payload) ? res.payload : (res?.payload?.data || res?.data || []);
      const totalCount = res?.payload?.count || res?.totalCount || (Array.isArray(res?.payload) ? res.payload.length : 0);
      
      setData(list);
      setTotalPages(Math.ceil(totalCount / 10) || 1);
    } catch (error) {
      console.error('Error fetching all performance:', error);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchAllPerformance();
  }, [fetchAllPerformance]);

  const handleToggle = (row) => {
    const isSelected = selectedPerformances.some(item => item.tradingAccountId === row.tradingAccountId);
    if (isSelected) {
      setSelectedPerformances(selectedPerformances.filter(item => item.tradingAccountId !== row.tradingAccountId));
    } else {
      if (selectedPerformances.length >= 10) {
        return;
      }
      setSelectedPerformances([...selectedPerformances, row]);
    }
  };

  const handleSaveInternal = () => {
    onSave(selectedPerformances);
  };

  const columns = [
    { 
      key: 'user', 
      label: 'User', 
      render: (row) => (
        <div className={styles.userInfo}>
          <p className={styles.userName}>{`${row.user?.firstName ?? ''} ${row.user?.lastName ?? ''}`.trim() || '—'}</p>
          <p className={styles.userEmail}>{row.user?.email || '—'}</p>
        </div>
      )
    },
    { 
      key: 'mt5LoginId', 
      label: 'Account',
      render: (row) => (
        <div className={styles.accInfo}>
          <span className={styles.idBadge}>{row.mt5LoginId || '—'}</span>
        </div>
      )
    },
    { 
      key: 'broker', 
      label: 'Broker',
      render: (row) => (
        <div className={styles.brokerInfo}>
          {row.broker?.logo && <img src={row.broker.logo} alt="" className={styles.brokerLogo} />}
          <span>{row.broker?.name || '—'}</span>
        </div>
      )
    },
    {
      key: 'investment',
      label: 'Investment',
      render: (row) => (
        <div className={styles.amountWrap}>
          {row.investment != null ? `$${Number(row.investment).toLocaleString()}` : '$0'}
        </div>
      )
    },
    { 
      key: 'balance', 
      label: 'Balance', 
      render: (row) => (
        <div className={styles.amountWrap}>
          {row.currentBalance != null ? `$${Number(row.currentBalance).toLocaleString()}` : '$0'}
        </div>
      )
    },
    { 
      key: 'totalProfit', 
      label: 'Profit', 
      render: (row) => (
        <div className={styles.profitWrap}>
          {row.totalProfit != null ? `$${Number(row.totalProfit).toLocaleString()}` : '$0'}
        </div>
      )
    },
    {
      key: 'profitPercentage',
      label: 'Profit %',
      render: (row) => (
        <div className={styles.profitWrap}>
          <span className={styles.profitBadge}>
            {row.profitPercentage != null ? `${row.profitPercentage}%` : '0%'}
          </span>
        </div>
      )
    },
    {
      key: 'createdAt',
      label: 'Date Joined',
      render: (row) => (
        <div className={styles.dateWrap}>
          {row.createdAt ? new Date(row.createdAt).toLocaleDateString('en-GB') : '—'}
        </div>
      )
    },
    {
      key: 'select',
      label: 'Select',
      render: (row) => {
        const isSelected = selectedPerformances.some(item => item.tradingAccountId === row.tradingAccountId);
        return (
          <div className={styles.checkboxWrapper}>
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => handleToggle(row)}
              className={styles.checkbox}
              id={`check-${row.tradingAccountId}`}
            />
            <label htmlFor={`check-${row.tradingAccountId}`} className={styles.checkboxLabel}></label>
          </div>
        );
      }
    }
  ];

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.titleBlock}>
            <h2>Manage Top 10</h2>
            <p>Selected {selectedPerformances.length} of 10 users</p>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <Image src="/assets/icons/WhiteClose.svg" alt="close" width={24} height={24} />
          </button>
        </div>

        <div className={styles.searchBar}>
          <input 
            type="text" 
            placeholder="Search users..." 
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          <img src="/assets/icons/SearchWhite.svg" alt="search" />
        </div>

        <div className={styles.tableWrap}>
          <DataTable
            columns={columns}
            data={data}
            loading={loading}
            rowKey="tradingAccountId"
            emptyMessage="No users found."
          />
        </div>

        <div className={styles.footer}>
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
          <div className={styles.actions}>
            <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
            <button 
              className={styles.saveBtn} 
              onClick={handleSaveInternal}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Selection'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
