'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCloseRequests, updateCloseRequest } from '@/store/slice/adminSlice';
import moment from 'moment';
import styles from './accountClose.module.scss';
import { exportToExcel } from '@/utils/exportToExcel';
import TableTopBar from '@/components/tableTopBar';
import DataTable from '@/components/dataTable';
import Pagination from '@/components/pagination';

export default function AccountClose() {
  const dispatch = useDispatch();
  const { closeRequests, closeRequestsTotalPages, loading } = useSelector((s) => s.admin);

  const [activeTab, setActiveTab] = useState('social_pool');
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [actionLoading, setActionLoading] = useState(null); // { id, action }
  const [isActionFetch, setIsActionFetch] = useState(false);

  const fetchData = () => {
    dispatch(fetchCloseRequests({ search, page, limit: 10, type: activeTab }));
  };

  useEffect(() => {
    fetchData();
  }, [dispatch, search, page, activeTab]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setPage(1);
    setSearch('');
  };

  const handleSearchChange = (val) => {
    setSearch(val);
    setPage(1);
  };

  const handleAction = (id, status) => {
    setActionLoading({ id, action: status });
    dispatch(updateCloseRequest({ id, status })).then(() => {
      setActionLoading(null);
      setIsActionFetch(true);
      fetchData();
    }).finally(() => {
      setIsActionFetch(false);
    });
  };

  const handleExport = () => {
    const rows = (closeRequests || []).map((r) => {
      const base = {
        Date: r.createdAt ? moment(r.createdAt).format('DD-MM-YYYY hh:mm A') : '—',
        'User ID': r.user?.accNumber ?? '—',
        Name: `${r.user?.firstName ?? ''} ${r.user?.lastName ?? ''}`.trim() || '—',
        Email: r.user?.email ?? '—',
        Broker: r.broker ?? '—',
        Amount: r.amount ?? '—',
        Status: r.status ?? '—',
      };
      if (activeTab === 'social_pool') {
        return {
          ...base,
          'Pool ID': r.socialPoolId ?? '—',
          'Deposit Amount': r.poolPurchase?.depositAmount ?? '—',
          'Current Balance': r.poolPurchase?.currentBalance ?? '—',
        };
      }
      return {
        ...base,
        'MT5 Account': r.mt5Account ?? '—',
        'MT5 Login ID': r.tradingAccount?.mt5LoginId ?? '—',
      };
    });
    const label = activeTab === 'social_pool' ? 'Pool Close Requests' : 'MT5 Close Requests';
    exportToExcel(rows, label, `${activeTab}_close_requests_export.xlsx`);
  };

  const poolColumns = [
    { key: 'createdAt', label: 'Date', render: (r) => r.createdAt ? moment(r.createdAt).format('DD-MM-YYYY hh:mm A') : '—' },
    { key: 'userId', label: 'User ID', render: (r) => r.user?.accNumber ?? '—' },
    { key: 'name', label: 'Name', render: (r) => `${r.user?.firstName ?? ''} ${r.user?.lastName ?? ''}`.trim() || '—' },
    { key: 'email', label: 'Email', render: (r) => r.user?.email ?? '—' },
    { key: 'broker', label: 'Broker', render: (r) => r.broker ?? '—' },
    // { key: 'depositAmount', label: 'Deposit Amount', render: (r) => r.poolPurchase?.depositAmount ?? '—' },
    // { key: 'currentBalance', label: 'Current Balance', render: (r) => r.poolPurchase?.currentBalance ?? '—' },
    { key: 'actions', label: 'Actions', render: (r) => <ActionCell r={r} onAction={handleAction} actionLoading={actionLoading} styles={styles} /> },
  ];

  const mt5Columns = [
    { key: 'createdAt', label: 'Date', render: (r) => r.createdAt ? moment(r.createdAt).format('DD-MM-YYYY hh:mm A') : '—' },
    { key: 'userId', label: 'User ID', render: (r) => r.user?.accNumber ?? '—' },
    { key: 'name', label: 'Name', render: (r) => `${r.user?.firstName ?? ''} ${r.user?.lastName ?? ''}`.trim() || '—' },
    { key: 'email', label: 'Email', render: (r) => r.user?.email ?? '—' },
    { key: 'broker', label: 'Broker', render: (r) => r.broker ?? '—' },
    { key: 'mt5Account', label: 'MT5 Account', render: (r) => r.mt5Account ?? '—' },
    { key: 'mt5LoginId', label: 'MT5 Login ID', render: (r) => r.tradingAccount?.mt5LoginId ?? '—' },
    { key: 'amount', label: 'Amount', render: (r) => r.amount ?? '—' },
    { key: 'actions', label: 'Actions', render: (r) => <ActionCell r={r} onAction={handleAction} actionLoading={actionLoading} styles={styles} /> },
  ];

  return (
    <div className={styles.wrapper}>
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'social_pool' ? styles.active : ''}`}
          onClick={() => handleTabChange('social_pool')}
        >
          Social Pool
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'trading_account' ? styles.active : ''}`}
          onClick={() => handleTabChange('trading_account')}
        >
          MT5 Account
        </button>
      </div>

      <TableTopBar
        search={search}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search"
        actions={[
          { label: 'Export', icon: '/assets/icons/Export.svg', onClick: handleExport },
        ]}
      />

      <DataTable
        columns={activeTab === 'social_pool' ? poolColumns : mt5Columns}
        data={closeRequests}
        loading={loading && !isActionFetch}
        emptyMessage={`No ${activeTab === 'social_pool' ? 'Social Pool' : 'MT5 Account'} close requests found.`}
      />

      <Pagination page={page} totalPages={closeRequestsTotalPages} onPageChange={setPage} />
    </div>
  );
}

function ActionCell({ r, onAction, actionLoading, styles }) {
  if (r.status === 'approved') {
    return <span className={`${styles.badge} ${styles.approved}`}>Approved</span>;
  }
  if (r.status === 'rejected') {
    return <span className={`${styles.badge} ${styles.rejected}`}>Rejected</span>;
  }
  if (r.status === 'pending') {
    return (
      <div className={styles.actionBtns}>
        <button
          className={styles.btnApprove}
          disabled={actionLoading?.id === r.id}
          onClick={() => onAction(r.id, 'approved')}
        >
          {actionLoading?.id === r.id && actionLoading?.action === 'approved'
            ? <span className={styles.btnSpinner} />
            : 'Approve'}
        </button>
        <button
          className={styles.btnReject}
          disabled={actionLoading?.id === r.id}
          onClick={() => onAction(r.id, 'rejected')}
        >
          {actionLoading?.id === r.id && actionLoading?.action === 'rejected'
            ? <span className={styles.btnSpinner} />
            : 'Reject'}
        </button>
      </div>
    );
  }
  return <span>{r.status ?? '—'}</span>;
}
