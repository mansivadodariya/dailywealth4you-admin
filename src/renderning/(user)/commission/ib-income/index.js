'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminIbIncome } from '@/store/reducers';
import moment from 'moment';
import styles from './ibIncome.module.scss';
import { exportToExcel } from '@/utils/exportToExcel';
import TableTopBar from '@/components/tableTopBar';
import DataTable from '@/components/dataTable';
import Pagination from '@/components/pagination';
import Loader from '@/components/loader';
import ViewButton from '@/components/common/viewButton';

export default function IBIncome() {
  const dispatch = useDispatch();
  const { ibIncome, ibIncomeTotalPages, loading } = useSelector((state) => state.admin);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const handleSearchChange = (val) => {
    setSearch(val);
    setPage(1);
  };

  useEffect(() => {
    dispatch(fetchAdminIbIncome({ search, page, limit: 10 }));
  }, [dispatch, search, page]);

const handleExport = () => {
  const rows = [];

  (ibIncome || []).forEach((row) => {
    const user = row.user || {};
    const brokers = row.brokers || [];
    const allTrades = brokers.flatMap((b) => b.trades || []);

    rows.push({
      'Date Joined': user?.createdAt
        ? moment(user.createdAt).format('DD-MM-YYYY | hh:mm A')
        : '—',
      'User ID': user?.accNumber ?? '—',
      'Name': `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim() || '—',
      'Email': user?.email ?? '—',
      'Lots Traded': user?.totalLots ?? 0,
      'IB Income': `$${(row.totalIncome ?? 0).toLocaleString()}`,
      'Order ID': '',
      'MT5 Account': '',
      'Symbol': '',
      'Lots': '',
      'P&L': '',
      'Commission': '',
    });

    allTrades.forEach((trade) => {
      rows.push({
        'Date Joined': '',
        'User ID': '',
        'Name': '',
        'Email': '',
        'Lots Traded': '',
        'IB Income': '',
        'Order ID': trade?.orderId ?? '—',
        'MT5 Account': trade?.accountId ?? '—',
        'Symbol': trade?.item ?? '—',
        'Lots': trade?.volume ?? 0,
        'P&L': `$${trade?.profitLoss?.toLocaleString() ?? 0}`,
        'Commission': `$${trade?.commission?.toLocaleString() ?? 0}`,
      });
    });

    // ✅ Spacer Row (optional but cleaner)
    rows.push({});
  });

  exportToExcel(rows, 'IB Income', 'ib_income_grouped.xlsx');
};

  const innerColumns = [
    { key: 'orderId', label: 'Order ID' },
    {
      key: 'accountId', label: 'MT5 Account'
    },
    {
      key: 'item',
      label: 'Symbol',
      render: (t) => <span className={styles.idBadge}>{t.item ?? '—'}</span>,
    },
    { key: 'volume', label: 'Lots', render: (t) => t.volume ?? '0' },
    {
      key: 'profitLoss',
      label: 'P&L',
      render: (t) => (
        <span className={t.pnl >= 0 ? styles.pnlPositive : styles.pnlNegative}>
          {t.pnl >= 0 ? '+' : ''}${t.profitLoss?.toLocaleString() ?? 0}
        </span>
      ),
    },
    {
      key: 'commission',
      label: 'Commission',
      render: (t) => `$${t.commission?.toLocaleString() ?? 0}`,
    },
  ];

  const columns = [
    {
      key: 'createdAt',
      label: 'Date Joined',
      render: (row) => row?.user?.createdAt ? moment(row?.user?.createdAt).format('DD-MM-YYYY | hh:mm A') : '—',
    },
    {
      key: 'userId',
      label: 'User ID',
      render: (row) => row.user?.accNumber ?? '—',
    },
    {
      key: 'name',
      label: 'Name',
      render: (row) => `${row.user?.firstName ?? ''} ${row.user?.lastName ?? ''}`.trim() || '—',
    },
    {
      key: 'email',
      label: 'Email',
      render: (row) => row.user?.email ?? '—',
    },
    {
      key: 'totalLots',
      label: 'Lots Traded',
  render:(r)=>r.user?.totalLots?r.user?.totalLots: "0"
    },
    {
      key: 'totalProfit',
      label: 'IB Income',
      render: (row) => {
        const totalIncome = (row.brokers || []).reduce((acc, b) => acc + (b.totalIncome || 0), 0);
        return `$${(row.totalIncome ?? totalIncome ?? 0).toLocaleString()}`;
      },
    },
    {
      key: 'action',
      label: 'Action',
      render: (row) => {
        const id = row.user?.id || row.id;
        return (
          <ViewButton onClick={() => setExpandedId(expandedId === id ? null : id)}>
            {expandedId === id ? 'Close' : 'View'}
          </ViewButton>
        );
      },
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
                  <Loader color="#02df82" />
                </td>
              </tr>
            ) : !ibIncome?.length ? (
              <tr>
                <td colSpan={columns.length} className={styles.empty}>
                  No IB income data found.
                </td>
              </tr>
            ) : (
              (ibIncome || []).map((row) => {
                const id = row.user?.id || row.id;
                const allTrades = (row.brokers || []).flatMap((b) => b.trades || []);
                return (
                  <React.Fragment key={id}>
                    <tr>
                      {columns.map((col) => (
                        <td key={col.key}>
                          {col.render ? col.render(row) : row[col.key] ?? '—'}
                        </td>
                      ))}
                    </tr>
                    {expandedId === id && (
                      <tr className={styles.expandedRow}>
                        <td colSpan={columns.length}>
                          <div className={styles.expandedContent}>
                            <DataTable
                              columns={innerColumns}
                              data={allTrades}
                              rowKey={(t, i) => t.orderId ?? i}
                              emptyMessage="No trades found."
                            />
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={ibIncomeTotalPages} onPageChange={setPage} />
    </div>
  );
}
