'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWithdrawRequests, updateWithdrawRequest } from '@/store/reducers';
import moment from 'moment';
import styles from './withdrawRequests.module.scss';
import { exportToExcel } from '@/utils/exportToExcel';
import TableTopBar from '@/components/tableTopBar';
import DataTable from '@/components/dataTable';
import StatCard from '@/components/statCard';

export default function WithdrawRequests() {
  const dispatch = useDispatch();
  const { withdrawRequests, loading } = useSelector((state) => state.admin);
  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(fetchWithdrawRequests({ search }));
  }, [dispatch, search]);

  const filtered = withdrawRequests || [];

  const pendingTotal = filtered
    .filter((r) => r.status === 'pending')
    .reduce((sum, r) => sum + (Number(r.amount) || 0), 0);

  const pendingCount = filtered.filter((r) => r.status === 'pending').length;

  const completedTotal = filtered
    .filter((r) => r.status === 'approved' || r.status === 'completed')
    .reduce((sum, r) => sum + (Number(r.amount) || 0), 0);

  const completedCount = filtered.filter(
    (r) => r.status === 'approved' || r.status === 'completed'
  ).length;

  const handleAction = (id, status) => {
    dispatch(updateWithdrawRequest({ id, status })).then(() => {
      dispatch(fetchWithdrawRequests());
    });
  };

  const handleExport = () => {
    const rows = filtered.map((r) => ({
      Date: r.createdAt ? moment(r.createdAt).format('DD-MM-YYYY hh:mm A') : '—',
      'User ID': r.userId ?? '—',
      Name: `${r.firstName ?? ''} ${r.lastName ?? ''}`.trim() || r.name || '—',
      Email: r.email ?? '—',
      'Withdrawal Amount': r.amount ?? '—',
      'Wallet Address': r.walletAddress ?? '—',
      Status: r.status ?? '—',
    }));
    exportToExcel(rows, 'Withdraw Requests', 'withdraw_requests_export.xlsx');
  };

  const columns = [
    {
      key: 'createdAt',
      label: 'Date',
      render: (r) =>
        r.createdAt ? moment(r.createdAt).format('DD-MM-YYYY hh:mm A') : '—',
    },
    { key: 'userId', label: 'User ID' },
    {
      key: 'name',
      label: 'Name',
      render: (r) =>
        `${r.firstName ?? ''} ${r.lastName ?? ''}`.trim() || r.name || '—',
    },
    { key: 'email', label: 'Email' },
    {
      key: 'amount',
      label: 'Withdrawal Amount',
      render: (r) => (r.amount != null ? `$${r.amount}` : '—'),
    },
    {
      key: 'walletAddress',
      label: 'Wallet Address',
      render: (r) =>
        r.walletAddress
          ? `${r.walletAddress.slice(0, 8)}...`
          : '—',
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (r) => (
        <div className={styles.actionBtns}>
          <button
            className={styles.btnApprove}
            disabled={r.status === 'approved' || r.status === 'completed'}
            onClick={() => handleAction(r.id, 'approved')}
          >
            Approve
          </button>
          <button
            className={styles.btnReject}
            disabled={r.status === 'rejected'}
            onClick={() => handleAction(r.id, 'rejected')}
          >
            Reject
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className={styles.wrapper}>
      <div className={styles.statsRow}>
        <StatCard
          label="Pending Withdraw Requests"
          value={`$${pendingTotal.toLocaleString()}`}
          sub={`Count: ${pendingCount}`}
        />
        <StatCard
          label="Completed Withdraw Requests"
          value={`$${completedTotal.toLocaleString()}`}
          sub={`Count: ${completedCount}`}
        />
      </div>

      <TableTopBar
        search={search}
        onSearchChange={setSearch}
        actions={[
          { label: 'Filters', icon: '/assets/icons/Filter.svg', onClick: () => {} },
          { label: 'Export', icon: '/assets/icons/Export.svg', onClick: handleExport },
        ]}
      />

      <DataTable
        columns={columns}
        data={filtered}
        loading={loading}
        emptyMessage="No withdraw requests found."
      />
    </div>
  );
}
