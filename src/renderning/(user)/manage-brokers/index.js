'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBrokersAdmin } from '@/store/reducers';
import styles from './manageBrokers.module.scss';
import TableTopBar from '@/components/tableTopBar';
import MediaCard from '@/components/mediaCard';
import Pagination from '@/components/pagination';
import BrokerModal from '@/components/modal/BrokerModal';
import Loader from '@/components/loader';

export default function ManageBrokers() {
  const dispatch = useDispatch();
  const { brokers, brokersTotalPages, loading } = useSelector((state) => state.content);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);

  const handleSearchChange = (val) => {
    setSearch(val);
    setPage(1);
  };

  useEffect(() => {
    dispatch(fetchBrokersAdmin({ page, limit: 12, search }));
  }, [dispatch, page, search]);

  const refresh = () => dispatch(fetchBrokersAdmin({ page, limit: 12, search }));

  const topBarActions = [
    { label: 'Add Broker', icon: null, onClick: () => setModal({ mode: 'add' }), variant: 'primary' },
  ];

  return (
    <>
      <div className={styles.wrapper}>
        <TableTopBar search={search} onSearchChange={handleSearchChange} actions={topBarActions} />

        {loading ? (
          <div className={styles.loaderWrap}><Loader /></div>
        ) : !brokers?.length ? (
          <div className={styles.empty}>No brokers found.</div>
        ) : (
          <div className={styles.grid}>
            {brokers.map((broker) => (
              <MediaCard
                key={broker.id}
                imageSrc={broker.logo}
                title={broker.description || broker.name}
                onEdit={() => setModal({ mode: 'edit', broker })}
                onDelete={() => setModal({ mode: 'delete', broker })}
              />
            ))}
          </div>
        )}

        <Pagination page={page} totalPages={brokersTotalPages} onPageChange={setPage} />
      </div>

      {modal && (
        <BrokerModal
          mode={modal.mode}
          broker={modal.broker}
          onClose={() => setModal(null)}
          onDone={refresh}
        />
      )}
    </>
  );
}
