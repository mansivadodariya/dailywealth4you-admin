'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllUsers, fetchIbClients } from '@/store/reducers';
import moment from 'moment';
import styles from './users.module.scss';
import { exportToExcel } from '@/utils/exportToExcel';
import FilterModal from '@/components/modal/FilterModal';
import TableTopBar from '@/components/tableTopBar';
import DataTable from '@/components/dataTable';
import UserViewModal from '@/components/modal/UserViewModal';
import Pagination from '@/components/pagination';
import Loader from '@/components/loader';

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
  const [expandedUserId, setExpandedUserId] = useState(null);
  const { ibClients, ibClientsLoading } = useSelector((state) => state.admin);

  const handleSearchChange = (val) => {
    setSearch(val);
    setPage(1);
  };

  const handleFilterApply = (f) => {
    setActiveFilters(f);
    setPage(1);
  };

  useEffect(() => {
    dispatch(fetchAllUsers({ ...activeFilters, search, page, limit: 10 }));
  }, [dispatch, activeFilters, search, page]);

  // fetch IB clients when a row is expanded
  useEffect(() => {
    if (expandedUserId) {
      dispatch(fetchIbClients(expandedUserId));
    }
  }, [expandedUserId, dispatch]);

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
    { key: 'id', label: 'User ID', render: (u) => u.id?.slice(0, 6).toUpperCase() ?? '—' },
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
      render: (u) => (u.deposit != null ? `$${u.deposit}` : '$0'),
    },
    {
      key: 'totalProfit',
      label: 'Profit',
      render: (u) => (
        <span className={styles.profitBadge}>
          {u.totalProfit != null ? `$${u.totalProfit}` : '$0'}
        </span>
      ),
    },
    {
      key: 'action',
      label: 'Action',
      render: (u) => (
        <div className={styles.actionBtns}>
          <button className={styles.viewBtn} onClick={() => setSelectedUser(u)}>View</button>
          <button
            className={expandedUserId === u.id ? styles.ibBtnExpanded : styles.ibBtn}
            onClick={() => setExpandedUserId(expandedUserId === u.id ? null : u.id)}
            title="View IB Clients"
          >
            <span className={styles.iconDown} />
          </button>
        </div>
      ),
    },
  ];

  const topBarActions = [
    { label: 'Filters', icon: '/assets/icons/Filter.svg', onClick: () => setShowFilter(true) },
    { label: 'Export', icon: '/assets/icons/Export.svg', onClick: handleExport },
  ];
  console.log(usersTotalPages, "totalPages");

  return (
    <>
      <div className={styles.wrapper}>
        <TableTopBar
          search={search}
          onSearchChange={handleSearchChange}
          actions={topBarActions}
        />

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead className={styles.thead}>
              <tr>
                {columns.map((col) => (
                  <th key={col.key}>{col.label}</th>
                ))}
              </tr>
            </thead>
            <tbody className={styles.tbody}>
              {loading ? (
                <tr>
                  <td colSpan={columns.length} className={styles.loading}>
                    <Loader />
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className={styles.empty}>No users found.</td>
                </tr>
              ) : (
                filtered.map((user) => (
                  <React.Fragment key={user.id}>
                    <tr>
                      {columns.map((col) => (
                        <td key={col.key}>
                          {col.render ? col.render(user) : user[col.key] ?? '—'}
                        </td>
                      ))}
                    </tr>
                    {expandedUserId === user.id && (
                      <tr className={styles.expandedRow}>
                        <td colSpan={columns.length}>
                          <div className={styles.expandedContent}>
                            {ibClientsLoading ? (
                              <div className={styles.loaderWrap}><Loader /></div>
                            ) : !ibClients?.length ? (
                              <div className={styles.emptyClients}>No IB clients found.</div>
                            ) : (
                              <div className={styles.clientsTable}>
                                <div className={styles.clientsHeader}>
                                  <div className={styles.clientCol}>Join Date</div>
                                  <div className={styles.clientCol}>User ID</div>
                                  <div className={styles.clientCol}>Name</div>
                                  <div className={styles.clientCol}>Email</div>
                                  <div className={styles.clientCol}>Deposit</div>
                                  <div className={styles.clientCol}>Profit</div>
                                </div>
                                {ibClients.map((client) => (
                                  <div key={client.id} className={styles.clientsRow}>
                                    <div className={styles.clientCol}>
                                      {client.createdAt ? moment(client.createdAt).format('DD-MM-YYYY hh:mm A') : '—'}
                                    </div>
                                    <div className={styles.clientCol}>
                                      <span className={styles.idBadge}>
                                        {client.id.slice(0, 6).toUpperCase() ?? '—'}
                                      </span>
                                    </div>
                                    <div className={styles.clientCol}>{client.firstName} {client.lastName}</div>
                                    <div className={styles.clientCol}>{client.email}</div>
                                    <div className={styles.clientCol}>${client.deposit ?? '0'}</div>
                                    <div className={styles.clientCol}>
                                      <span className={styles.profitBadge}>
                                        ${client.commission ?? '0'}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination page={page} totalPages={usersTotalPages} onPageChange={setPage} />
      </div>

      {showFilter && (
        <FilterModal
          initialFilters={activeFilters}
          onApply={handleFilterApply}
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
