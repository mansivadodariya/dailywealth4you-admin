'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSocialPools, deleteSocialPool } from '@/store/reducers';
import styles from './socialPool.module.scss';
import TableTopBar from '@/components/tableTopBar';
import Pagination from '@/components/pagination';
import Loader from '@/components/loader';
import SocialPoolModal from '@/components/modal/SocialPoolModal';
import DeleteModal from '@/components/modal/DeleteModal';
import Image from 'next/image';

export default function SocialPoolManagement() {
  const dispatch = useDispatch();
  const { socialPools, socialPoolsTotalPages, loading } = useSelector((state) => state.content);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const handleSearchChange = (val) => {
    setSearch(val);
    setPage(1);
  };

  useEffect(() => {
    dispatch(fetchSocialPools({ page, limit: 12, search }));
  }, [dispatch, page, search]);

  const refresh = () => dispatch(fetchSocialPools({ page, limit: 12, search }));

  const handleDelete = async (id) => {
    await dispatch(deleteSocialPool(id));
    refresh();
  };

  const topBarActions = [
    { label: 'Create Social Pool', icon: null, onClick: () => setModal({ mode: 'add' }), variant: 'primary' },
  ];

  return (
    <>
      <div className={styles.wrapper}>
        <TableTopBar 
          search={search} 
          onSearchChange={handleSearchChange} 
          actions={topBarActions} 
          searchPlaceholder="Search"
        />

        {loading ? (
          <div className={styles.loaderWrap}><Loader /></div>
        ) : !socialPools?.length ? (
          <div className={styles.empty}>No social pools found.</div>
        ) : (
          <div className={styles.grid}>
            {socialPools.map((pool) => (
              <div key={pool.id || pool._id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <h3>{pool.title}</h3>
                </div>
                
                <p className={styles.subTitle}>{pool.shortDescription}</p>
                
                {/* <div className={styles.stats}>
                  <div className={styles.statItem}>
                    <label>Deposit Amount</label>
                    <span>${pool.minDeposit}</span>
                  </div>
                  <div className={styles.statItem}>
                    <label>Current Balance</label>
                    <span>${pool.minDeposit}</span>
                  </div>
                </div> */}

                <div className={styles.dateInfo}>
                  <label>Created Date</label>
                  <span>{pool.createdAt ? new Date(pool.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) : 'N/A'}</span>
                </div>

                <div className={styles.descriptionWrap}>
                  <div className={styles.description} dangerouslySetInnerHTML={{ __html: pool.description }} />
                  <button
                    className={styles.viewMoreBtn}
                    onClick={() => setModal({ mode: 'edit', pool })}
                  >
                    View More
                  </button>
                </div>

                <div className={styles.cardActions}>
                  <button 
                    className={styles.editBtn} 
                    onClick={() => setModal({ mode: 'edit', pool })}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11 4H4C2.89543 4 2 4.89543 2 6V20C2 21.1046 2.89543 22 4 22H18C19.1046 22 20 21.1046 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M18.5 2.5C19.3284 1.67157 20.6716 1.67157 21.5 2.5C22.3284 3.32843 22.3284 4.67157 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Edit
                  </button>
                  <button 
                    className={styles.deleteBtn} 
                    onClick={() => setDeleteConfirm(pool)}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <Pagination page={page} totalPages={socialPoolsTotalPages} onPageChange={setPage} />
      </div>

      {deleteConfirm && (
        <DeleteModal
          title="Delete Social Pool"
          message={`Are you sure you want to delete "${deleteConfirm.title}"? This action cannot be undone.`}
          onConfirm={() => handleDelete(deleteConfirm.id || deleteConfirm._id)}
          onClose={() => setDeleteConfirm(null)}
        />
      )}

      {modal && (
        <SocialPoolModal
          mode={modal.mode}
          data={modal.pool}
          onClose={() => setModal(null)}
          onSuccess={refresh}
        />
      )}
    </>
  );
}
