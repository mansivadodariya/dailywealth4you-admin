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
import TableSkeleton from '@/components/skeleton/TableSkeleton';

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
    const rows = [];

    (profitSharing || []).forEach((row) => {
      const user = row.user || {};
      const brokers = row.brokers || [];
      const referrals = row.referrals || [];

      const totalLots = brokers.reduce((acc, b) => acc + (b.totalLots || 0), 0);
      const totalShare = brokers.reduce((acc, b) => acc + (b.totalProfitShare || 0), 0);

      rows.push({
        'Date Joined': user?.createdAt
          ? moment(user.createdAt).format('DD-MM-YYYY | hh:mm A')
          : '—',
        'User ID': user?.accNumber ?? '—',
        'Name': `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim() || '—',
        'Email': user?.email ?? '—',
        'IB User': user?.isIbUser ? 'Yes' : 'No',
        "User's Profit": `$${(row.totalProfit ?? row.totalLots ?? 0).toLocaleString()}`,
        'Profit %': `${(row.userProfitPercentage ?? totalShare ?? 0).toLocaleString()}%`,
        'My Profit Share': `$${(row.adminProfit ?? 0).toLocaleString()}`,
        'Referral Join Date': '',
        'Referral User ID': '',
        'Referral Name': '',
        'Referral Email': '',
        'Referral Profit': '',
        'Referral Profit %': "",
        'Admin Profit': '',
      });

      referrals.forEach((ref) => {
        rows.push({
          'Date Joined': '',
          'User ID': '',
          'Name': '',
          'Email': '',
          'IB User': '',
          "User's Profit": '',
          'Profit %': '',
          'My Profit Share': '',
          'Referral Join Date': ref?.createdAt
            ? moment(ref.createdAt).format('DD-MM-YYYY | hh:mm A')
            : '—',
          'Referral User ID': ref?.accNumber ?? '—',
          'Referral Name': `${ref?.firstName ?? ''} ${ref?.lastName ?? ''}`.trim() || '—',
          'Referral Email': ref?.email ?? '—',
          'Referral Profit': `$${ref?.totalProfit?.toLocaleString() ?? 0}`,
          'Referral Profit %': row.referralProfitPercentage ? `${row.referralProfitPercentage}%` : '—',
          'Admin Profit': `$${ref?.adminProfit?.toLocaleString() ?? 0}`,
        });
      });

      rows.push({});
    });

    exportToExcel(rows, 'Profit Sharing', 'profit_sharing_grouped.xlsx');
  };

  const innerColumns = [
    {
      key: 'createdAt',
      label: 'Join Date',
      render: (t) => t.createdAt ? moment(t.createdAt).format('DD-MM-YYYY | hh:mm A') : '—',
    },
    {
      key: 'accNumber',
      label: 'User ID',
      render: (t) => <span className={styles.idBadge}>{t.accNumber ?? '—'}</span>,
    },
    {
      key: 'name',
      label: 'Name',
      render: (t) => `${t.firstName ?? ''} ${t.lastName ?? ''}`.trim() || '—',
    },
    {
      key: 'email',
      label: 'Email',
      render: (t) => t.email ?? '—',
    },
    {
      key: 'totalProfit',
      label: "User's Profit",
      render: (t) => `$${t.totalProfit?.toLocaleString() ?? 0}`,
    },
    {
      key: 'referralProfitPercentage',
      label: 'Profit %',
      render: (t) => `${t.referralProfitPercentage ?? t.parentReferralProfitPercentage ?? '0'}%`,
    },
    {
      key: 'adminProfit',
      label: 'My Profit Share',
      render: (t) => (
        <span className={styles.profitBadge}>
          ${t.adminProfit?.toLocaleString() ?? 0}
        </span>
      ),
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
      key: 'isIbUser',
      label: 'IB User',
      render: (row) => row.user?.isIbUser ? 'Yes' : 'No',
    },
    {
      key: 'totalProfit',
      label: "User's Profit",
      render: (row) => {
        return `$${(row.totalProfit ?? row.totalLots ?? 0).toLocaleString()}`;
      },
    },
    {
      key: 'userProfitPercentage',
      label: 'Profit %',
      render: (row) => {
        const totalShare = (row.brokers || []).reduce((acc, b) => acc + (b.totalProfitShare || 0), 0);
        return `${(row.userProfitPercentage ?? totalShare ?? 0).toLocaleString()}%`;
      },
    },
    {
      key: 'adminProfit',
      label: 'My Profit Share',
      render: (t) => (
        `$${t.adminProfit?.toLocaleString() ?? 0}`
      ),
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
            {loading || profitSharing === null ? (
              <TableSkeleton rows={10} cols={columns.length} />
            ) : !profitSharing?.length ? (
              <tr>
                <td colSpan={columns.length} className={styles.empty}>
                  No profit sharing data found.
                </td>
              </tr>
            ) : (
              (profitSharing || []).map((row) => {
                const id = row.user?.id || row.id;
                const referrals = (row.referrals || []).map((ref) => ({
                  ...ref,
                  parentReferralProfitPercentage: row.referralProfitPercentage,
                }));
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
                              data={referrals}
                              rowKey={(t, i) => t.accNumber ?? i}
                              emptyMessage="No referrals found."
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
