'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTransactions } from '@/store/reducers';
import moment from 'moment';
import styles from './deposits.module.scss';
import { exportToExcel } from '@/utils/exportToExcel';
import TableTopBar from '@/components/tableTopBar';
import DataTable from '@/components/dataTable';
import StatCard from '@/components/statCard';
import Pagination from '@/components/pagination';

export default function Deposits() {
  const dispatch = useDispatch();
  const { transactions, transactionsTotalPages, loading } = useSelector((s) => s.admin);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(fetchTransactions({ type: 'deposit', search, page, limit: 10 }));
  }, [dispatch, search, page]);

  const deposits = transactions || [];
  const pendingDeposits = deposits.filter((r) => r.status === 'pending');
  const completedDeposits = deposits.filter((r) => r.status === 'approved' || r.status === 'completed');

  const columns = [
    { key: 'createdAt', label: 'Date', render: (r) => r.createdAt ? moment(r.createdAt).format('DD-MM-YYYY hh:mm A') : '—' },
    { key: 'userId', label: 'User ID' },
    { key: 'name', label: 'Name', render: (r) => `${r.user.firstName ?? ''} ${r.user.lastName ?? ''}`.trim() || r.name || '—' },
    { key: 'email', label: 'Email', render: (r) =>  r.user.email || '—'  },
    { key: 'amount', label: 'Deposit Amount', render: (r) => r.amount != null ? `${r.amount}` : '—' },
    { key: 'mtsAccount', label: 'MT5 Account', render: (r) => r.mtsAccount ?? '—' },
    { key: 'broker', label: 'Broker', render: (r) => r.broker ?? '—' },
    {
      key: 'status', label: 'Status',
      render: (r) => <span className={`${styles.badge} ${styles[r.status] ?? ''}`}>{'Deposit'}</span>,
    },
  ];

  const handleExport = () => {
    exportToExcel(
      deposits.map((r) => ({
        Date: r.createdAt ? moment(r.createdAt).format('DD-MM-YYYY hh:mm A') : '—',
        'User ID': r.userId ?? '—',
        Name: `${r.firstName ?? ''} ${r.lastName ?? ''}`.trim() || r.name || '—',
        Email: r.email ?? '—',
        'Deposit Amount': r.amount ?? '—',
        'MTS Account': r.mtsAccount ?? '—',
        Broker: r.broker ?? '—',
        Status: r.status ?? '—',
      })),
      'Deposits', 'deposits_export.xlsx'
    );
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.statsRow}>
        <StatCard
          label="Pending Deposits"
          value={pendingDeposits.reduce((s, r) => s + (Number(r.amount) || 0), 0).toLocaleString()}
          sub={`Count: ${pendingDeposits.length}`}
        />
        <StatCard
          label="Completed Deposits"
          value={completedDeposits.reduce((s, r) => s + (Number(r.amount) || 0), 0).toLocaleString()}
          sub={`Count: ${completedDeposits.length}`}
        />
      </div>
      <TableTopBar
        search={search}
        onSearchChange={(v) => { setSearch(v); setPage(1); }}
        actions={[{ label: 'Export', icon: '/assets/icons/Export.svg', onClick: handleExport }]}
      />
      <DataTable columns={columns} data={deposits} loading={loading} emptyMessage="No deposit transactions found." />
      <Pagination page={page} totalPages={transactionsTotalPages} onPageChange={setPage} />
    </div>
  );
}
