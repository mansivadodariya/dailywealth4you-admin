'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWithdrawRequests, updateTransaction } from '@/store/slice/adminSlice';
import moment from 'moment';
import styles from './withdrawRequests.module.scss';
import { exportToExcel } from '@/utils/exportToExcel';
import TableTopBar from '@/components/tableTopBar';
import DataTable from '@/components/dataTable';
import StatCard from '@/components/statCard';
import Pagination from '@/components/pagination';
import FilterModal, { withdrawStatusOptions } from '@/components/modal/FilterModal';
import ApproveWithdrawModal from '@/components/modal/ApproveWithdrawModal';
import StatCardSkeleton from '@/components/skeleton/StatCardSkeleton';

export default function WithdrawRequests() {
  const dispatch = useDispatch();
  const { withdrawRequests, withdrawRequestsTotalPages, loading, withdrawRequestsSummary } = useSelector((state) => state.admin);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [activeFilters, setActiveFilters] = useState({});
  const [showApprove, setShowApprove] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionLoading, setActionLoading] = useState(null); // { id, action }

  const handleSearchChange = (val) => {
    setSearch(val);
    setPage(1);
  };

  const handleFilterApply = (f) => {
    setActiveFilters(f);
    setPage(1);
  };

  useEffect(() => {
    dispatch(fetchWithdrawRequests({ search, page, limit: 10, ...activeFilters }));
  }, [dispatch, search, page, activeFilters]);

  const filtered = withdrawRequests;

  const handleAction = (id, status) => {
    if (status === 'approved') {
      setSelectedRequest((filtered || []).find(r => r.id === id));
      setShowApprove(true);
      return;
    }
    // Direct reject or other status updates
    setActionLoading({ id, action: status });
    dispatch(updateTransaction({ id, status })).then(() => {
      setActionLoading(null);
      dispatch(fetchWithdrawRequests({ search, page, limit: 10, ...activeFilters }));
    });
  };

  const confirmApproval = (id, file) => {
    setActionLoading({ id, action: 'approved' });
    dispatch(updateTransaction({ id, status: 'approved', file })).then((res) => {
      setActionLoading(null);
      if (!res.error) {
        setShowApprove(false);
        setSelectedRequest(null);
        dispatch(fetchWithdrawRequests({ search, page, limit: 10, ...activeFilters }));
      }
    });
  };


  const handleExport = () => {
    const rows = (filtered || []).map((r) => ({
      Date: r.createdAt ? moment(r.createdAt).format('DD-MM-YYYY hh:mm A') : '—',
      'User ID': r?.user?.accNumber ?? '—',
      Name: `${r?.user?.firstName ?? ''} ${r?.user?.lastName ?? ''}`.trim() || r.name || '—',
      Email: r?.user?.email ?? '—',
      'Withdrawal Amount': r.amount ?? '—',
      'Wallet Address': r.address ?? '—',
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
    { key: 'userId', label: 'User ID', render: (r) => r?.user?.accNumber ?? '—' },
    {
      key: 'name',
      label: 'Name',
      render: (r) =>
        `${r.user.firstName ?? ''} ${r.user.lastName ?? ''}`.trim() || '—',
    },
    {
      key: 'email', label: 'Email',
      render: (r) =>
        `${r.user.email ?? ''}`.trim() || '—',
    },
    {
      key: 'amount',
      label: 'Withdrawal Amount',
      render: (r) => (r.amount != null ? `$${r.amount}` : '—'),
    },
    {
      key: 'network',
      label: 'Network Change',
    },
    {
      key: 'address',
      label: 'Wallet Address',
      render: (r) =>
        r.address
          ? `${r.address}`
          : '—',
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (r) => (
        <div className={styles.actionBtns}>
          {r.status === 'pending' ? (
            <>
              <button
                className={styles.btnApprove}
                disabled={actionLoading?.id === r.id}
                onClick={() => handleAction(r.id, 'approved')}
              >
                Approve
              </button>
              <button
                className={styles.btnReject}
                disabled={actionLoading?.id === r.id}
                onClick={() => handleAction(r.id, 'rejected')}
              >
                {actionLoading?.id === r.id && actionLoading?.action === 'rejected' ? (
                  <span className={styles.btnSpinner} />
                ) : (
                  'Reject'
                )}
              </button>
            </>
          ) : r.status === 'approved' || r.status === 'completed' ? (
            <span className={styles.approvedText}>Approved</span>
          ) : r.status === 'rejected' ? (
            <span className={styles.rejectedText}>Rejected</span>
          ) : (
            '—'
          )}
        </div>
      ),
    },
  ];

  return (
    <div className={styles.wrapper}>
      <div className={styles.statsRow}>
        {loading || withdrawRequestsSummary === null ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <StatCard
              label="Pending Withdraw Requests"
              value={`$${(withdrawRequestsSummary?.pendingWithdrawalAmount ?? 0).toLocaleString()}`}
              sub={`Count: ${withdrawRequestsSummary?.pendingWithdrawalCount ?? 0}`}
            />
            <StatCard
              label="Completed Withdraw Requests"
              value={`$${(withdrawRequestsSummary?.approvedWithdrawalAmount ?? 0).toLocaleString()}`}
              sub={`Count: ${withdrawRequestsSummary?.approvedWithdrawalCount ?? 0}`}
            />
          </>
        )}
      </div>

      <TableTopBar
        search={search}
        onSearchChange={handleSearchChange}
        actions={[
          { label: 'Filters', icon: '/assets/icons/Filter.svg', onClick: () => setShowFilter(true) },
          { label: 'Export', icon: '/assets/icons/Export.svg', onClick: handleExport },
        ]}
      />

      {showFilter && (
        <FilterModal
          fields={['dateRange', 'withdrawalAmount', 'status']}
          statusChoices={withdrawStatusOptions}
          initialFilters={activeFilters}
          onApply={handleFilterApply}
          onClose={() => setShowFilter(false)}
        />
      )}

      <DataTable
        columns={columns}
        data={filtered}
        loading={loading}
        emptyMessage="No withdraw requests found."
      />
      <Pagination page={page} totalPages={withdrawRequestsTotalPages} onPageChange={setPage} />

      {showApprove && selectedRequest && (
        <ApproveWithdrawModal
          request={selectedRequest}
          loading={actionLoading?.id === selectedRequest.id && actionLoading?.action === 'approved'}
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
