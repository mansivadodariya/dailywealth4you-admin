'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminProfitSharing } from '@/store/reducers';
import moment from 'moment';
import styles from './profitSharing.module.scss';
import { exportToExcel } from '@/utils/exportToExcel';
import TableTopBar from '@/components/tableTopBar';
import DataTable from '@/components/dataTable';
import Pagination from '@/components/pagination';
import Loader from '@/components/loader';
import ViewButton from '@/components/common/viewButton';

export default function ProfitSharing() {
  const dispatch = useDispatch();
  const { profitSharing, profitSharingTotalPages, loading } = useSelector((state) => state.admin);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const handleSearchChange = (val) => {
    setSearch(val);
    setPage(1);
  };

  useEffect(() => {
    dispatch(fetchAdminProfitSharing({ search, page, limit: 10 }));
  }, [dispatch, search, page]);

  const handleExport = () => {
    const rows = (profitSharing || []).map((row) => {
      const totalLots = (row.brokers || []).reduce((acc, b) => acc + (b.totalLots || 0), 0);
      const totalShare = (row.brokers || []).reduce((acc, b) => acc + (b.totalProfitShare || 0), 0);
      return {
        'Date Joined': row?.user?.createdAt ? moment(row.user.createdAt).format('DD-MM-YYYY | hh:mm A') : '—',
        'User ID': row.user?.accNumber ?? '—',
        'Name': `${row.user?.firstName ?? ''} ${row.user?.lastName ?? ''}`.trim() || '—',
        'Email': row.user?.email ?? '—',
        'IB User': row.user?.isIbUser ? 'Yes' : 'No',
        "User's Profit": row.totalLots ?? totalLots ?? 0,
        'Profit %': (row.totalProfitShare ?? totalShare ?? 0).toLocaleString(),
      };
    });
    exportToExcel(rows, 'Profit Sharing', 'profit_sharing_export.xlsx');
  };

  const innerColumns = [
    { key: 'orderId', label: 'Order ID' },
    { key: 'mt5Account', label: 'MT5 Account' },
    {
      key: 'symbol',
      label: 'Symbol',
      render: (t) => <span className={styles.symbolTag}>{t.symbol ?? '—'}</span>,
    },
    { key: 'lots', label: 'Lots', render: (t) => t.lots ?? '0' },
    {
      key: 'pnl',
      label: 'P&L',
      render: (t) => (
        <span className={t.pnl >= 0 ? styles.pnlPositive : styles.pnlNegative}>
          {t.pnl >= 0 ? '+' : ''}${t.pnl?.toLocaleString() ?? 0}
        </span>
      ),
    },
    {
      key: 'profitShare',
      label: 'Profit Share',
      render: (t) => `${t.profitShare?.toLocaleString() ?? 0}`,
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
      key: 'email',
      label: 'IB User',
      render: (row) => row.user?.isIbUser ? "Yes" : 'No',
    },
    {
      key: 'totalProfit',
      label: 'User’s Profit',
      render: (row) => {
        const totalLots = (row.brokers || []).reduce((acc, b) => acc + (b.totalLots || 0), 0);
        return row.totalLots ?? totalLots ?? 0;
      },
    },
    {
      key: 'profitSharing',
      label: 'Profit %',
      render: (row) => {
        const totalShare = (row.brokers || []).reduce((acc, b) => acc + (b.totalProfitShare || 0), 0);
        return `${(row.totalProfitShare ?? totalShare ?? 0).toLocaleString()}`;
      },
      
    },
      {
      key: 'adminProfit',
      label: 'My Profit Share',
   
      
    },
    {
      key: 'action',
      label: 'Action',
      render: (row) => {
        const id = row.user?.id || row.id;
        const isOpen = expandedId === id;
        return (
          <ViewButton
            onClick={() => setExpandedId(isOpen ? null : id)}
            aria-label={isOpen ? 'Collapse row' : 'Expand row'}
          >
            <svg
              className={isOpen ? styles.arrowOpen : styles.arrowClosed}
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M4 6L8 10L12 6" stroke="#fafafa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
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
            ) : !profitSharing?.length ? (
              <tr>
                <td colSpan={columns.length} className={styles.empty}>
                  No profit sharing data found.
                </td>
              </tr>
            ) : (
              (profitSharing || []).map((row) => {
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

      <Pagination page={page} totalPages={profitSharingTotalPages} onPageChange={setPage} />
    </div>
  );
}
