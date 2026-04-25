'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllContactUs } from '@/store/reducers';
import moment from 'moment';
import styles from './contactUs.module.scss';
import { exportToExcel } from '@/utils/exportToExcel';
import TableTopBar from '@/components/tableTopBar';
import DataTable from '@/components/dataTable';
import Pagination from '@/components/pagination';
import ContactUsViewModal from '@/components/modal/ContactUsViewModal';

export default function ContactUs() {
  const dispatch = useDispatch();
  const { contactUs, contactUsTotalPages, loading } = useSelector((state) => state.admin);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [viewRecord, setViewRecord] = useState(null);

  const handleSearchChange = (val) => {
    setSearch(val);
    setPage(1);
  };

  useEffect(() => {
    dispatch(fetchAllContactUs({ search, page, limit: 10 }));
  }, [dispatch, search, page]);

  const contactUsData = contactUs || [];

  const handleExport = () => {
    const rows = contactUsData.map((r) => ({
      'Date': r.createdAt ? moment(r.createdAt).format('DD-MM-YYYY | hh:mm A') : '—',
      'Name': r.firstName ? `${r.firstName} ${r.lastName}` : '—',
      'Email': r.email ?? '—',
      'Message': r.description ?? '—',
    }));
    exportToExcel(rows, 'Contact Us', 'contact_us_export.xlsx');
  };

  const columns = [
    {
      key: 'createdAt',
      label: 'Date',
      render: (r) => (r.createdAt ? moment(r.createdAt).format('DD-MM-YYYY | hh:mm A') : '—'),
    },
    {
      key: 'name',
      label: 'Name',
      render: (r) => (r.firstName ? r.firstName + ' ' + r.lastName : '—'),
    },
    { key: 'email', label: 'Email' },
    {
      key: 'description',
      label: 'Message',
      render: (r) => (
        <div title={r.message} className={styles.messageCell}>
          {r.description}
        </div>
      ),
    },
    {
      key: 'action',
      label: 'Action',
      render: (r) => (
        <button className={styles.viewBtn} onClick={() => setViewRecord(r)}>
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
          { label: 'Export', icon: '/assets/icons/Export.svg', onClick: handleExport },
        ]}
      />

      <DataTable
        columns={columns}
        data={contactUsData}
        loading={loading}
        emptyMessage="No contact requests found."
      />

      <Pagination page={page} totalPages={contactUsTotalPages} onPageChange={setPage} />

      {viewRecord && (
        <ContactUsViewModal record={viewRecord} onClose={() => setViewRecord(null)} />
      )}
    </div>
  );
}
