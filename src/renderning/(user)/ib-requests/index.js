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

export default function IBRequests() {
  const dispatch = useDispatch();
  const { ibRequests, loading } = useSelector((state) => state.admin);
  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(fetchIbRequests({ search }));
  }, [dispatch, search]);

  const filtered = ibRequests || [];

  const pending = filtered.filter((r) => r.status === 'pending').length;
  const approved = filtered.filter((r) => r.status === 'approved').length;

  const handleAction = (id, status) => {
    dispatch(updateIbRequest({ id, status })).then(() => {
      dispatch(fetchIbRequests());
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
            disabled={r.status === 'approved'}
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
        <StatCard label="Pending IB Requests" value={pending} />
        <StatCard label="Approved IB Requests" value={approved} />
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
        emptyMessage="No IB requests found."
      />
    </div>
  );
}
