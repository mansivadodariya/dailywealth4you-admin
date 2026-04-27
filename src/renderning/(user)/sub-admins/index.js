'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllSubAdmins, updateSubAdmin, deleteSubAdmin } from '@/store/reducers';
import moment from 'moment';
import styles from './subAdmins.module.scss';
import { exportToExcel } from '@/utils/exportToExcel';
import TableTopBar from '@/components/tableTopBar';
import DataTable from '@/components/dataTable';
import Pagination from '@/components/pagination';
import SubAdminModal from '@/components/modal/AddSubAdminModal';
import ViewButton from '@/components/common/viewButton';

export default function SubAdmins() {
  const dispatch = useDispatch();
  const { subAdmins, subAdminsTotalPages, loading } = useSelector((state) => state.admin);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleSearchChange = (val) => {
    setSearch(val);
    setPage(1);
  };

  useEffect(() => {
    dispatch(fetchAllSubAdmins({ page, limit: 10, search }));
  }, [dispatch, page, search]);

  const refresh = () => dispatch(fetchAllSubAdmins({ page, limit: 10, search }));

  const handleSave = (data) => {
    setSaving(true);
    dispatch(updateSubAdmin(data)).then((res) => {
      setSaving(false);
      if (!res.error) {
        refresh();
        setSelectedAdmin(null);
      }
    });
  };

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this sub-admin?')) return;
    setDeleting(true);
    dispatch(deleteSubAdmin(id)).then((res) => {
      setDeleting(false);
      if (!res.error) {
        refresh();
        setSelectedAdmin(null);
      }
    });
  };

  const filtered = subAdmins || [];

  const handleExport = () => {
    const rows = filtered.map((r) => ({
      'Date Added': r.createdAt ? moment(r.createdAt).format('DD-MM-YYYY | hh:mm A') : '—',
      'Admin ID': r?.id?.slice(0, 6).toUpperCase() ?? '—',
      'Email': r?.email ?? '—',
      'Access': (r?.permissions || []).join(', ') || '—',
    }));
    exportToExcel(rows, 'Sub Admins', 'sub_admins_export.xlsx');
  };

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
        <ViewButton onClick={() => setSelectedAdmin(r)} />
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
          { label: 'Export', icon: '/assets/icons/Export.svg', onClick: handleExport },
          { label: 'Add New Sub-Admin ', icon: '/assets/icons/plus.svg', onClick: () => setShowAdd(true), variant: 'primary' },
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
          onSave={handleSave}
          onDelete={handleDelete}
          saving={saving}
          deleting={deleting}
        />
      )}
    </div>
  );
}
