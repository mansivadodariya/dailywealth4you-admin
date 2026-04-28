'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTransactions, updateTransaction } from '@/store/slice/adminSlice';
import moment from 'moment';
import styles from './deposits.module.scss';
import { exportToExcel } from '@/utils/exportToExcel';
import TableTopBar from '@/components/tableTopBar';
import DataTable from '@/components/dataTable';
import StatCard from '@/components/statCard';
import Pagination from '@/components/pagination';
import ApproveDepositModal from '@/components/modal/ApproveDepositModal';

export default function Deposits() {
  const dispatch = useDispatch();
  const { transactions, transactionsTotalPages, loading } = useSelector((s) => s.admin);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [showApprove, setShowApprove] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchTransactions({ type: 'deposit', search, page, limit: 10 }));
  }, [dispatch, search, page]);

  const deposits = transactions || [];

  const handleAction = (id, status) => {
    const request = deposits.find((r) => r.id === id);
    if (status === 'deposit') {
      setSelectedRequest(request);
      setShowApprove(true);
      return;
    }
    // For other status updates if needed
    dispatch(updateTransaction({ id, status })).then(() => {
      dispatch(fetchTransactions({ type: 'deposit', search, page, limit: 10 }));
    });
  };

  const confirmApproval = (id, file) => {
    setActionLoading(true);
    dispatch(updateTransaction({ id, status: 'approved', file })).then((res) => {
      setActionLoading(false);
      if (!res.error) {
        setShowApprove(false);
        setSelectedRequest(null);
        dispatch(fetchTransactions({ type: 'deposit', search, page, limit: 10 }));
      }
    });
  };

  const pendingDeposits = deposits.filter((r) => r.status === 'pending');
  const completedDeposits = deposits.filter((r) => r.status === 'approved' || r.status === 'completed');

  const columns = [
    { key: 'createdAt', label: 'Date', render: (r) => r.createdAt ? moment(r.createdAt).format('DD-MM-YYYY hh:mm A') : '—' },
    { key: 'userId', label: 'User ID', render: (r) => r.user?.accNumber ?? '—' },
    { key: 'name', label: 'Name', render: (r) => `${r.user.firstName ?? ''} ${r.user.lastName ?? ''}`.trim() || r.name || '—' },
    { key: 'email', label: 'Email', render: (r) => r.user.email || '—' },
    { key: 'amount', label: 'Deposit Amount', render: (r) => r.amount != null ? `${r.amount}` : '—' },
    { key: 'mt5Account', label: 'MT5 Account', render: (r) => r.mt5Account ?? '—' },
    { key: 'broker', label: 'Broker', render: (r) => r.broker ?? '—' },
    {
      key: 'status', label: 'Status',
      render: (r) => (
        <div className={styles.actionBtns}>
          {r.status === 'approved' ? (
            <button
              className={styles.btnApprove}
              disabled={actionLoading}
              onClick={() => handleAction(r.id, 'deposit')}
            >
              Approve
            </button>
          ) : r.status === 'deposit' ? (
            <span className={styles.depositText}>Deposit</span>
          ) : (
            '—'
          )}
        </div>
      ),
    },
  ];


  const handleExport = () => {
    exportToExcel(
      deposits.map((r) => ({
        Date: r.createdAt ? moment(r.createdAt).format('DD-MM-YYYY hh:mm A') : '—',
        'User ID': r.user?.accNumber ?? '—',
        Name: `${r?.user?.firstName ?? ''} ${r?.user?.lastName ?? ''}`.trim() || r.name || '—',
        Email: r?.user?.email ?? '—',
        'Deposit Amount': r.amount ?? '—',
        'MTS Account': r.mt5Account ?? '—',
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

      {showApprove && selectedRequest && (
        <ApproveDepositModal
          request={selectedRequest}
          loading={actionLoading}
          onClose={() => {
            setShowApprove(false);
            setSelectedRequest(null);
          }}
          onConfirm={confirmApproval}
        />
      )}
    </div>

  );
}
