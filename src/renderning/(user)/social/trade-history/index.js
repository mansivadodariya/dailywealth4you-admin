'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPoolTradesHistory } from '@/store/reducers';
import styles from './tradeHistory.module.scss';
import TableTopBar from '@/components/tableTopBar';
import Pagination from '@/components/pagination';
import DataTable from '@/components/dataTable';
import TradeHistoryModal from '@/components/modal/TradeHistoryModal';

export default function TradeHistoryManagement() {
  const dispatch = useDispatch();
  const { poolTradesHistory, poolTradesHistoryTotalPages, loading } = useSelector((state) => state.content);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    dispatch(fetchPoolTradesHistory({ page, limit: 12, search }));
  }, [dispatch, page, search]);

  const refresh = () => dispatch(fetchPoolTradesHistory({ page, limit: 12, search }));

  const handleSearchChange = (val) => {
    setSearch(val);
    setPage(1);
  };

  const topBarActions = [
    { label: 'Add Trade', icon: null, onClick: () => setShowModal(true), variant: 'primary' },
  ];

  const columns = [
    { 
      key: 'socialPool', 
      label: 'Social Pool', 
      render: (row) => <span className={styles.symbol}>{row.socialPool?.title || 'N/A'}</span> 
    },
    { 
      key: 'profitLoss', 
      label: 'Profit/Loss', 
      render: (row) => (
        <span className={Number(row.profitLoss) >= 0 ? styles.profit : styles.loss}>
          {Number(row.profitLoss) >= 0 ? '+' : ''}${row.profitLoss || '0.00'}
        </span>
      ) 
    },
    { 
      key: 'tradingDate', 
      label: 'Trading Date', 
      render: (row) => row.tradingDate ? new Date(row.tradingDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A' 
    },
    { 
      key: 'profitPercentage', 
      label: 'Pool Profit (%)', 
      render: (row) => <span>{row.socialPool?.profitPercentage || '0'}%</span> 
    },
    { 
      key: 'minDeposit', 
      label: 'Min. Deposit', 
      render: (row) => <span>${row.socialPool?.minDeposit || '0'}</span> 
    },
  ];

  return (
    <div className={styles.wrapper}>
      <TableTopBar 
        search={search} 
        onSearchChange={handleSearchChange} 
        actions={topBarActions}
        searchPlaceholder="Search trades..."
      />

      <DataTable 
        columns={columns}
        data={poolTradesHistory}
        loading={loading}
        emptyMessage="No trade history found."
      />

      <Pagination page={page} totalPages={poolTradesHistoryTotalPages} onPageChange={setPage} />

      {showModal && (
        <TradeHistoryModal 
          onClose={() => setShowModal(false)}
          onSuccess={refresh}
        />
      )}
    </div>
  );
}
