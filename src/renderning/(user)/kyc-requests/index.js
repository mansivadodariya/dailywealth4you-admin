'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllKycDocuments, updateKycDocument } from '@/store/reducers';
import moment from 'moment';
import styles from './kycRequests.module.scss';
import { exportToExcel } from '@/utils/exportToExcel';
import TableTopBar from '@/components/tableTopBar';
import DataTable from '@/components/dataTable';

export default function KycRequests() {
  const dispatch = useDispatch();
  const { kycDocuments, loading } = useSelector((state) => state.admin);
  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(fetchAllKycDocuments({ search }));
  }, [dispatch, search]);

  const filtered = kycDocuments || [];

  const handleAction = (id, status) => {
    dispatch(updateKycDocument({ id, status })).then(() => {
      dispatch(fetchAllKycDocuments());
    });
  };

  const handleExport = () => {
    const rows = filtered.map((d) => ({
      'Date Requested': d.createdAt ? moment(d.createdAt).format('DD-MM-YYYY hh:mm A') : '—',
      'User ID': d?.user?.id ?? '—',
      'Name': `${d?.user?.firstName ?? ''} ${d?.user?.lastName ?? ''}`.trim() || '—',
      'Email': d?.user?.email ?? '—',
      'Status': d.status ?? '—',
    }));
    exportToExcel(rows, 'KYC Requests', 'kyc_requests_export.xlsx');
  };

  const columns = [
    {
      key: 'createdAt',
      label: 'Date Requested',
      render: (d) => (d.createdAt ? moment(d.createdAt).format('DD-MM-YYYY hh:mm A') : '—'),
    },
    {
      key: 'userId',
      label: 'User ID',
      render: (d) => d?.user?.id ?? '—',
    },
    {
      key: 'name',
      label: 'Name',
      render: (d) => `${d?.user?.firstName ?? ''} ${d?.user?.lastName ?? ''}`.trim() || '—',
    },
    {
      key: 'email',
      label: 'Email',
      render: (d) => d?.user?.email ?? '—',
    },
    {
      key: 'action',
      label: 'Action',
      render: (d) => (
        <div className={styles.actionBtns}>
          <button
            className={styles.btnApprove}
            disabled={d.status === 'approved'}
            onClick={() => handleAction(d.id, 'approved')}
          >
            Approve
          </button>
          <button
            className={styles.btnReject}
            disabled={d.status === 'rejected'}
            onClick={() => handleAction(d.id, 'rejected')}
          >
            Reject
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className={styles.wrapper}>
      <TableTopBar
        search={search}
        onSearchChange={setSearch}
        actions={[
          { label: 'Export', icon: '/assets/icons/Export.svg', onClick: handleExport },
        ]}
      />
      <DataTable
        columns={columns}
        data={filtered}
        loading={loading}
        emptyMessage="No KYC requests found."
      />
    </div>
  );
}
