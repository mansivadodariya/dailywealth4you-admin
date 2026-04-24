'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllSubAdmins } from '@/store/reducers';
import moment from 'moment';
import styles from './subAdmins.module.scss';
import TableTopBar from '@/components/tableTopBar';
import DataTable from '@/components/dataTable';
import Pagination from '@/components/pagination';
import SubAdminModal from '@/components/modal/AddSubAdminModal';

export default function SubAdmins() {
  const dispatch = useDispatch();
  const { subAdmins, subAdminsTotalPages, loading } = useSelector((state) => state.admin);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  const handleSearchChange = (val) => {
    setSearch(val);
    setPage(1);
  };

  useEffect(() => {
    dispatch(fetchAllSubAdmins({ page, limit: 10, search }));
  }, [dispatch, page, search]);

  const refresh = () => dispatch(fetchAllSubAdmins({ page, limit: 10 }));

  const filtered = subAdmins || [];

  const columns = [
    {
      key: 'createdAt',
      label: 'Date Added',
      render: (r) => r.createdAt ? moment(r.createdAt).format('DD-MM-YYYY | hh:mm A') : '—',
    },
    {
      key: 'id',
      label: 'Admin ID',
      render: (r) => r.id?.slice(0, 6).toUpperCase() ?? '—',
    },
    { key: 'email', label: 'Email', render: (r) => r.email ?? '—' },
    { key: 'password', label: 'Password', render: () => '••••••••••' },
    {
      key: 'permissions',
      label: 'Access',
      render: (r) => {
        const perms = r.permissions || [];
        if (!perms.length) return '—';
        const display = perms.slice(0, 3).join(', ');
        return perms.length > 3 ? `${display}...` : display;
      },
    },
    {
      key: 'action',
      label: 'Action',
      render: (r) => (
        <button className={styles.btnView} onClick={() => setSelectedAdmin(r)}>View</button>
      ),
    },
  ];

  return (
    <div className={styles.wrapper}>
      <TableTopBar
        search={search}
        onSearchChange={handleSearchChange}
        actions={[
          { label: 'Filters', icon: '/assets/icons/Filter.svg', onClick: () => {} },
          { label: 'Export', icon: '/assets/icons/Export.svg', onClick: () => {} },
          { label: 'Add New Sub-Admin ', onClick: () => setShowAdd(true), variant: 'primary' },
        ]}
      />

      <DataTable
        columns={columns}
        data={filtered}
        loading={loading}
        emptyMessage="No sub-admins found."
      />
      <Pagination page={page} totalPages={subAdminsTotalPages} onPageChange={setPage} />

      {showAdd && (
        <SubAdminModal
          mode="add"
          onClose={() => setShowAdd(false)}
          onCreated={refresh}
        />
      )}

      {selectedAdmin && (
        <SubAdminModal
          mode="view"
          admin={selectedAdmin}
          onClose={() => setSelectedAdmin(null)}
          onSave={() => {}}
          onDelete={() => {}}
        />
      )}
    </div>
  );
}
