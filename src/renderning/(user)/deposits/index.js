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
import FilterModal, { withdrawStatusOptions } from '@/components/modal/FilterModal';
import StatCardSkeleton from '@/components/skeleton/StatCardSkeleton';

const depositStatusOptions = [
  { value: '', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
];

const defaultFilters = {
  dateFrom: '',
  dateTo: '',
  minDeposit: '',
  maxDeposit: '',
  status: '',
};

export default function Deposits() {
  const dispatch = useDispatch();
  const { transactions, transactionsTotalPages, loading, transactionsSummary } = useSelector((s) => s.admin);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState(defaultFilters);
  const [showFilter, setShowFilter] = useState(false);
  const [showApprove, setShowApprove] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchData = () => {
    dispatch(fetchTransactions({
      type: 'deposit',
      search,
      page,
      limit: 10,
      ...filters,
    }));
  };

  useEffect(() => {
    fetchData();
  }, [dispatch, search, page, filters]);

  const deposits = transactions;

  const handleApplyFilters = (applied) => {
    setFilters(applied);
    setPage(1);
  };

  const handleAction = (id, status) => {
    const request = (deposits || []).find((r) => r.id === id);
    if (status === 'deposit') {
      setSelectedRequest(request);
      setShowApprove(true);
      return;
    }
    dispatch(updateTransaction({ id, status })).then(() => fetchData());
  };

  const confirmApproval = (id, file) => {
    setActionLoading(true);
    dispatch(updateTransaction({ id, status: 'approved', file })).then((res) => {
      setActionLoading(false);
      if (!res.error) {
        setShowApprove(false);
        setSelectedRequest(null);
        fetchData();
      }
    });
  };

  const pendingDeposits = (deposits || []).filter((r) => r.status === 'pending');
  const completedDeposits = (deposits || []).filter((r) => r.status === 'approved' || r.status === 'completed');

  const columns = [
    { key: 'createdAt', label: 'Date', render: (r) => r.createdAt ? moment(r.createdAt).format('DD-MM-YYYY hh:mm A') : '—' },
    { key: 'userId', label: 'User ID', render: (r) => r.user?.accNumber ?? '—' },
    { key: 'name', label: 'Name', render: (r) => `${r.user?.firstName ?? ''} ${r.user?.lastName ?? ''}`.trim() || r.name || '—' },
    { key: 'email', label: 'Email', render: (r) => r.user?.email || '—' },
    { key: 'amount', label: 'Deposit Amount', render: (r) => r.amount != null ? `$${r.amount}` : '—' },
    { key: 'mt5Account', label: 'MT5 Account', render: (r) => r.mt5Account ?? '—' },
    { key: 'broker', label: 'Broker', render: (r) => r.broker ?? '—' },
    {
      key: 'status', label: 'Status',
      render: (r) => (
        <div className={styles.actionBtns}>
          {r.status === 'pending' ? (
            <button
              className={styles.btnApprove}
              disabled={actionLoading}
              onClick={() => handleAction(r.id, 'deposit')}
            >
              Approve
            </button>
          ) : r.status === 'approved' ? (
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
      (deposits || []).map((r) => ({
        Date: r.createdAt ? moment(r.createdAt).format('DD-MM-YYYY hh:mm A') : '—',
        'User ID': r.user?.accNumber ?? '—',
        Name: `${r?.user?.firstName ?? ''} ${r?.user?.lastName ?? ''}`.trim() || r.name || '—',
        Email: r?.user?.email ?? '—',
        'Deposit Amount': r.amount ?? '—',
        'MT5 Account': r.mt5Account ?? '—',
        Broker: r.broker ?? '—',
        Status: r.status ?? '—',
      })),
      'Deposits', 'deposits_export.xlsx'
    );
  };

  const hasActiveFilters = filters.dateFrom || filters.dateTo || filters.minDeposit || filters.maxDeposit || filters.status;

  return (
    <div className={styles.wrapper}>
      <div className={styles.statsRow}>
        {loading || transactionsSummary === null ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <StatCard
              label="Total Deposits"
              value={`$${(transactionsSummary?.approvedDepositAmount ?? 0).toLocaleString()}`}
              sub={`Count: ${transactionsSummary?.approvedDepositCount ?? 0}`}
            />
            <StatCard
              label="Pending Deposits"
              value={`$${(transactionsSummary?.pendingDepositAmount ?? 0).toLocaleString()}`}
              sub={`Count: ${transactionsSummary?.pendingDepositCount ?? 0}`}
            />
          </>
        )}
      </div>
      <TableTopBar
        search={search}
        onSearchChange={(v) => { setSearch(v); setPage(1); }}
        actions={[
          {
            label: hasActiveFilters ? 'Filters' : 'Filters',
            icon: '/assets/icons/Filter.svg',
            onClick: () => setShowFilter(true),
          },
          { label: 'Export', icon: '/assets/icons/Export.svg', onClick: handleExport },
        ]}
      />
      <DataTable columns={columns} data={deposits} loading={loading} emptyMessage="No deposit transactions found." />
      <Pagination page={page} totalPages={transactionsTotalPages} onPageChange={setPage} />

      {showFilter && (
        <FilterModal
          fields={['dateRange', 'deposit', 'status']}
          statusChoices={depositStatusOptions}
          initialFilters={filters}
          onApply={handleApplyFilters}
          onClose={() => setShowFilter(false)}
        />
      )}

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
