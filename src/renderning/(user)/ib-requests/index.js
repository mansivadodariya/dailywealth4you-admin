'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchIbRequests, updateIbRequest } from '@/store/reducers';
import moment from 'moment';
import styles from './ibRequests.module.scss';
import { exportToExcel } from '@/utils/exportToExcel';
import TableTopBar from '@/components/tableTopBar';
import DataTable from '@/components/dataTable';
import StatCard from '@/components/statCard';
import Pagination from '@/components/pagination';
import FilterModal, { ibRequestStatusOptions } from '@/components/modal/FilterModal';

export default function IBRequests() {
  const dispatch = useDispatch();
  const { ibRequests, ibRequestsTotalPages, loading } = useSelector((state) => state.admin);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [activeFilters, setActiveFilters] = useState({});
  const [actionLoading, setActionLoading] = useState(null); // { id, action }

  useEffect(() => { setPage(1); }, [search]);

  useEffect(() => {
    dispatch(fetchIbRequests({ search, page, limit: 10, ...activeFilters }));
  }, [dispatch, search, page, activeFilters]);

  const filtered = ibRequests || [];

  const pending = filtered.filter((r) => r.status === 'pending').length;
  const approved = filtered.filter((r) => r.status === 'approved').length;

  const handleAction = (id, status) => {
    setActionLoading({ id, action: status });
    dispatch(updateIbRequest({ id, status })).finally(() => {
      setActionLoading(null);
      dispatch(fetchIbRequests({ search, page, limit: 10, ...activeFilters }));
    });
  };

  const handleExport = () => {
    const rows = filtered.map((r) => ({
      Date: r.createdAt ? moment(r.createdAt).format('DD-MM-YYYY hh:mm A') : '—',
      Name: `${r.firstName ?? ''} ${r.lastName ?? ''}`.trim() || r.name || '—',
      Email: r.email ?? '—',
      Status: r.status ?? '—',
    }));
    exportToExcel(rows, 'IB Requests', 'ib_requests_export.xlsx');
  };

  const columns = [
    {
      key: 'createdAt',
      label: 'Date',
      render: (r) => (r.createdAt ? moment(r.createdAt).format('DD-MM-YYYY hh:mm A') : '—'),
    },
    {
      key: 'name',
      label: 'Name',
      render: (r) => `${r?.user?.firstName ?? ''} ${r.user.lastName ?? ''}`.trim() || r.name || '—',
    },
    { key: 'email', label: 'Email',
      render: (r) => `${r?.user?.email  || '—'}`,

     },
    {
      key: 'action',
      label: 'Action',
      render: (r) => (
        <div className={styles.actionBtns}>
          <button
            className={styles.btnApprove}
            disabled={r.status === 'approved' || actionLoading?.id === r.id}
            onClick={() => handleAction(r.id, 'approved')}
          >
            {actionLoading?.id === r.id && actionLoading?.action === 'approved'
              ? <span className={styles.btnSpinner} />
              : 'Approve'}
          </button>
          <button
            className={styles.btnReject}
            disabled={r.status === 'cancel' || actionLoading?.id === r.id}
            onClick={() => handleAction(r.id, 'cancel')}
          >
            {actionLoading?.id === r.id && actionLoading?.action === 'cancel'
              ? <span className={styles.btnSpinner} />
              : 'Reject'}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className={styles.wrapper}>
      <div className={styles.statsRow}>
        <StatCard label="Pending IB Requests" value={pending} />
        <StatCard label="Approved IB Requests" value={approved} />
      </div>

      <TableTopBar
        search={search}
        onSearchChange={setSearch}
        actions={[
          { label: 'Filters', icon: '/assets/icons/Filter.svg', onClick: () => setShowFilter(true) },
          { label: 'Export', icon: '/assets/icons/Export.svg', onClick: handleExport },
        ]}
      />

      {showFilter && (
        <FilterModal
          fields={['dateRange', 'status']}
          statusChoices={ibRequestStatusOptions}
          initialFilters={activeFilters}
          onApply={setActiveFilters}
          onClose={() => setShowFilter(false)}
        />
      )}

      <DataTable
        columns={columns}
        data={filtered}
        loading={loading && !actionLoading}
        emptyMessage="No IB requests found."
      />
      <Pagination page={page} totalPages={ibRequestsTotalPages} onPageChange={setPage} />
    </div>
  );
}
