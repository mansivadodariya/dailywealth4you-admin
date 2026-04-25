'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllKycDocuments, updateKycDocument } from '@/store/reducers';
import moment from 'moment';
import styles from './kycRequests.module.scss';
import { exportToExcel } from '@/utils/exportToExcel';
import TableTopBar from '@/components/tableTopBar';
import DataTable from '@/components/dataTable';
import Pagination from '@/components/pagination';
import FilterModal from '@/components/modal/FilterModal';
import KycViewModal from '@/components/modal/KycViewModal';

export default function KycRequests() {
  const dispatch = useDispatch();
  const { kycDocuments, kycDocumentsTotalPages, loading } = useSelector((state) => state.admin);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [activeFilters, setActiveFilters] = useState({});
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  const handleSearchChange = (val) => {
    setSearch(val);
    setPage(1);
  };

  const handleFilterApply = (f) => {
    setActiveFilters(f);
    setPage(1);
  };

  useEffect(() => {
    dispatch(fetchAllKycDocuments({ search, page, limit: 10, ...activeFilters }));
  }, [dispatch, search, page, activeFilters]);

  const filtered = kycDocuments || [];

  const handleAction = (id, status) => {
    setActionLoading({ id, action: status });
    dispatch(updateKycDocument({ id, status })).finally(() => {
      setActionLoading(null);
      setSelectedDoc(null);
      dispatch(fetchAllKycDocuments({ search, page, limit: 10, ...activeFilters }));
    });
  };

  const handleExport = () => {
    const rows = filtered.map((d) => ({
      'Date Requested': d.createdAt ? moment(d.createdAt).format('DD-MM-YYYY hh:mm A') : '—',
      'User ID': d?.user?.id?.slice(0, 6).toUpperCase() ?? '—',
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
      render: (d) => (d.createdAt ? moment(d.createdAt).format('DD-MM-YYYY | hh:mm A') : '—'),
    },
    {
      key: 'userId',
      label: 'User ID',
      render: (d) => d?.user?.id?.slice(0, 6).toUpperCase() ?? '—',
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
        <button className={styles.btnView} onClick={() => setSelectedDoc(d)}>
          View
        </button>
      ),
    },
  ];

  return (
    <div className={styles.wrapper}>
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
          fields={['dateRange']}
          initialFilters={activeFilters}
          onApply={handleFilterApply}
          onClose={() => setShowFilter(false)}
        />
      )}

      <DataTable
        columns={columns}
        data={filtered}
        loading={loading}
        emptyMessage="No KYC requests found."
      />
      <Pagination page={page} totalPages={kycDocumentsTotalPages} onPageChange={setPage} />

      {selectedDoc && (
        <KycViewModal
          doc={selectedDoc}
          onClose={() => setSelectedDoc(null)}
          onAction={handleAction}
          actionLoading={actionLoading?.id === selectedDoc.id ? actionLoading : null}
        />
      )}
    </div>
  );
}
