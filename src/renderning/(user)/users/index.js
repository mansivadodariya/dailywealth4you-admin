'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllUsers } from '@/store/reducers';
import moment from 'moment';
import styles from './users.module.scss';
import { exportToExcel } from '@/utils/exportToExcel';
import FilterModal from '@/components/modal/FilterModal';
import TableTopBar from '@/components/tableTopBar';
import DataTable from '@/components/dataTable';
import UserViewModal from '@/components/modal/UserViewModal';
import Pagination from '@/components/pagination';

const defaultFilters = {
  dateFrom: '',
  dateTo: '',
  profitMin: '',
  profitMax: '',
  depositMin: '',
  depositMax: '',
  ibUser: '',
  status: '',
};

export default function Users() {
  const dispatch = useDispatch();
  const { users, usersTotalPages, loading } = useSelector((state) => state.admin);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [activeFilters, setActiveFilters] = useState(defaultFilters);
  const [selectedUser, setSelectedUser] = useState(null);

  // reset to page 1 when search or filters change
  useEffect(() => { setPage(1); }, [search, activeFilters]);

  useEffect(() => {
    dispatch(fetchAllUsers({ ...activeFilters, search, page, limit: 10 }));
  }, [dispatch, activeFilters, search, page]);

  const filtered = users || [];

  const handleExport = () => {
    const rows = filtered.map((u) => ({
      'Date Joined': u.createdAt ? moment(u.createdAt).format('DD-MM-YYYY hh:mm A') : '—',
      'User ID': u.id ?? '—',
      'Name': `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim() || '—',
      'Email': u.email ?? '—',
      'IB User': u.isIbUser ? 'Yes' : 'No',
      'Deposit': u.deposit ?? '—',
      'Profit': u.commission ?? '—',
    }));
    exportToExcel(rows, 'Users', 'users_export.xlsx');
  };

  const columns = [
    {
      key: 'createdAt',
      label: 'Date Joined',
      render: (u) => (u.createdAt ? moment(u.createdAt).format('DD-MM-YYYY hh:mm A') : '—'),
    },
    { key: 'id', label: 'User ID' },
    {
      key: 'name',
      label: 'Name',
      render: (u) => `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim() || '—',
    },
    { key: 'email', label: 'Email' },
    {
      key: 'isIbUser',
      label: 'IB User',
      render: (u) => (u.isIbUser ? 'Yes' : 'No'),
    },
    {
      key: 'deposit',
      label: 'Deposit',
      render: (u) => (u.deposit != null ? `${u.deposit}` : '—'),
    },
    {
      key: 'commission',
      label: 'Profit',
      render: (u) => (u.commission != null ? `${u.commission}` : '—'),
    },
    {
      key: 'action',
      label: 'Action',
      render: (u) => (
        <button className={styles.viewBtn} onClick={() => setSelectedUser(u)}>View</button>
      ),
    },
  ];

  const topBarActions = [
    { label: 'Filters', icon: '/assets/icons/Filter.svg', onClick: () => setShowFilter(true) },
    { label: 'Export', icon: '/assets/icons/Export.svg', onClick: handleExport },
  ];
  console.log(usersTotalPages,"totalPages");

  return (
    <>
      <div className={styles.wrapper}>
        <TableTopBar
          search={search}
          onSearchChange={setSearch}
          actions={topBarActions}
        />
        <DataTable
          columns={columns}
          data={filtered}
          loading={loading}
          emptyMessage="No users found."
        />
        
        <Pagination page={page} totalPages={usersTotalPages} onPageChange={setPage} />
      </div>

      {showFilter && (
        <FilterModal
          initialFilters={activeFilters}
          onApply={(f) => setActiveFilters(f)}
          onClose={() => setShowFilter(false)}
        />
      )}

      {selectedUser && (
        <UserViewModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </>
  );
}
