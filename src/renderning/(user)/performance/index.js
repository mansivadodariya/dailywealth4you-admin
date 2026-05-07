'use client';

import React, { useEffect, useState, useCallback } from 'react';
import styles from './performance.module.scss';
import api from '@/service/api';
import {  GET_ALL_PERFORMANCE_USER, CREATE_NEW_PERFORMANCE, DELETE_PERFORMANCE_USER } from '@/service/url';
import TableTopBar from '@/components/tableTopBar';
import DataTable from '@/components/dataTable';
import Pagination from '@/components/pagination';
import { toast } from 'react-toastify';
import Loader from '@/components/loader';
import PerformanceViewModal from '@/components/modal/PerformanceViewModal';
import TopTenSelectModal from '@/components/modal/TopTenSelectModal';
import CreateFakeUserModal from '@/components/modal/CreateFakeUserModal';
import ViewButton from '@/components/common/viewButton';

export default function PerformanceDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [showSelectModal, setShowSelectModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showFakeModal, setShowFakeModal] = useState(false);
  const [selectedPerformance, setSelectedPerformance] = useState(null);
  const hasFetched = React.useRef(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page,
        limit: 10,
      });
      if (search) {
        queryParams.append('search', search);
      }

      // Main table now shows Top 10 Performance User list
      const res = await api.get(`${GET_ALL_PERFORMANCE_USER}?${queryParams.toString()}`);

      // The API returns the list directly in the payload or data property
      const list = Array.isArray(res?.payload) ? res.payload : (res?.payload?.data || res?.data || []);
      const totalCount = res?.payload?.count || res?.totalCount || list.length || 0;

      setData(list);

      setTotalPages(Math.ceil(totalCount / 10) || 1);
    } catch (error) {
      console.error('Error fetching performance data:', error);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  useEffect(() => {
    // Only fetch if it's the first run or if deps changed
    // React 18 StrictMode calls useEffect twice in dev. This ref helps prevent double calls.
    if (!hasFetched.current) {
      fetchData();
      if (process.env.NODE_ENV === 'production') {
        hasFetched.current = true;
      }
    } else {
      fetchData();
    }
    
    return () => {
      hasFetched.current = true;
    };
  }, [fetchData]);


  const handleSaveTopTen = async (selectedPerformances) => {
    if (!selectedPerformances) return;
    setSaving(true);
    try {
      const currentPerformances = data || [];
      const currentIds = currentPerformances.map(item => item.tradingAccountId);
      const selectedIds = selectedPerformances.map(item => item.tradingAccountId);
      
      const addedPerformances = selectedPerformances.filter(item => !currentIds.includes(item.tradingAccountId));
      
      const removedPerformances = currentPerformances.filter(item => !selectedIds.includes(item.tradingAccountId));

      if (addedPerformances.length === 0 && removedPerformances.length === 0) {
        setShowSelectModal(false);
        return;
      }

      // 1. Handle Deletions
      if (removedPerformances.length > 0) {
        await Promise.all(removedPerformances.map(item => {
          const id = item.id || item._id || item.tradingAccountId;
          if (id) {
            return api.delete(`${DELETE_PERFORMANCE_USER}?id=${id}`);
          }
          return Promise.resolve();
        }));
      }

      // 2. Handle Additions
      if (addedPerformances.length > 0) {
        const payload = {
          performances: addedPerformances.map(item => ({
            userId: item.user?.id || item.userId,
            tradingAccountId: item.tradingAccountId,
            isTopTen: true
          })).filter(p => p.userId && p.tradingAccountId)
        };
        
        if (payload.performances.length > 0) {
          await api.post(CREATE_NEW_PERFORMANCE, payload);
        }
      }

      toast.success('Top 10 performance updated successfully.');
      setShowSelectModal(false);
      fetchData();
    } catch (error) {
      console.error('Error saving performance:', error);
      toast.error('Failed to update Top 10 performance.');
    } finally {
      setSaving(false);
    }
  };

  const handleView = (row) => {
    setSelectedPerformance(row);
    setShowViewModal(true);
  };

  const columns = [
    { key: 'row', label: 'Sr No.', render: (row, __, index) => (page - 1) * 10 + index + 1 },

    {
      key: 'user',
      label: 'User',
      render: (row) => (
        <div className={styles.userInfo}>
          <p className={styles.userName}>{`${row.user?.firstName ?? ''} ${row.user?.lastName ?? ''}`.trim() || '—'}{row?.isFake && <span className={styles.dot}>•</span>}</p>
          <p className={styles.userEmail}>{row.user?.email || '—'}</p>
        </div>
      )
    },
    {
      key: 'mt5LoginId',
      label: 'Account Details',
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
      label: 'Balance ',
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
      key: 'actions',
      label: 'Action',
      render: (row) => (
        <ViewButton onClick={() => handleView(row)} />
      )
    }
  ];

  const topBarActions = [
    {
      label: 'Add Top 10 User',
      onClick: () => setShowSelectModal(true),
      variant: 'primary'
    },
    {
      label: 'Add User',
      onClick: () => setShowFakeModal(true),
      variant: 'secondary'
    },
  ];

  return (
    <div className={styles.wrapper}>
      <TableTopBar
        search={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        actions={topBarActions}
        searchPlaceholder="Search"
      />
      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        rowKey="tradingAccountId"
        emptyMessage="No performance data found."
      />
      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
      {showSelectModal && (
        <TopTenSelectModal
          currentTopTen={data}
          onSave={handleSaveTopTen}
          onClose={() => setShowSelectModal(false)}
          saving={saving}
        />
      )}

      {showViewModal && (
        <PerformanceViewModal
          data={selectedPerformance}
          onClose={() => setShowViewModal(false)}
          onSuccess={fetchData}
        />
      )}

      {showFakeModal && (
        <CreateFakeUserModal
          onClose={() => setShowFakeModal(false)}
          onSuccess={() => {
            setShowFakeModal(false);
            fetchData();
          }}
        />
      )}
    </div>
  );
}
