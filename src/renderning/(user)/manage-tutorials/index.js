'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTutorials } from '@/store/reducers';
import styles from './manageTutorials.module.scss';
import TableTopBar from '@/components/tableTopBar';
import MediaCard from '@/components/mediaCard';
import Pagination from '@/components/pagination';
import TutorialModal from '@/components/modal/TutorialModal';
import Loader from '@/components/loader';

// Derive a thumbnail image URL from a Cloudinary video URL.
// e.g. https://res.cloudinary.com/.../video/upload/v123/file.mp4
//   -> https://res.cloudinary.com/.../video/upload/so_0/v123/file.jpg
function cloudinaryVideoThumb(videoUrl) {
  if (!videoUrl) return null;
  try {
    // insert transformation "so_0" (snapshot at 0s) and swap extension
    return videoUrl
      .replace('/video/upload/', '/video/upload/so_0/')
      .replace(/\.(mp4|mov|webm|mkv)$/i, '.jpg');
  } catch {
    return null;
  }
}

export default function ManageTutorials() {
  const dispatch = useDispatch();
  const { tutorials, tutorialsTotalPages, loading } = useSelector((state) => state.content);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);

  const handleSearchChange = (val) => {
    setSearch(val);
    setPage(1);
  };

  useEffect(() => {
    dispatch(fetchTutorials({ page, limit: 12, search }));
  }, [dispatch, page, search]);

  const refresh = () => dispatch(fetchTutorials({ page, limit: 12, search }));

  const topBarActions = [
    { label: 'Add Tutorial', icon: null, onClick: () => setModal({ mode: 'add' }), variant: 'primary' },
  ];

  return (
    <>
      <div className={styles.wrapper}>
        <TableTopBar search={search} onSearchChange={handleSearchChange} actions={topBarActions} />

        {loading ? (
          <div className={styles.loaderWrap}><Loader /></div>
        ) : !tutorials?.length ? (
          <div className={styles.empty}>No tutorials found.</div>
        ) : (
          <div className={styles.grid}>
            {tutorials.map((tutorial) => (
              <MediaCard
                key={tutorial.id}
                imageSrc={cloudinaryVideoThumb(tutorial.videoUrl)}
                title={tutorial.description}
                onEdit={() => setModal({ mode: 'edit', tutorial })}
                onDelete={() => setModal({ mode: 'delete', tutorial })}
              />
            ))}
          </div>
        )}

        <Pagination page={page} totalPages={tutorialsTotalPages} onPageChange={setPage} />
      </div>

      {modal && (
        <TutorialModal
          mode={modal.mode}
          tutorial={modal.tutorial}
          onClose={() => setModal(null)}
          onDone={refresh}
        />
      )}
    </>
  );
}
