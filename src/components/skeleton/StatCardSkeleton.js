import React from 'react';
import Skeleton from './index';
import styles from '../statCard/statCard.module.scss';

const StatCardSkeleton = () => {
  return (
    <div className={styles.card}>
      <div style={{ padding: '0 20px', marginTop: '24px' }}>
        <Skeleton width="40%" height="20px" />
      </div>
      <div style={{ padding: '0 20px', marginTop: '10px', marginBottom: '20px' }}>
        <Skeleton width="60%" height="32px" />
      </div>
      <div style={{ margin: '0 20px 20px', padding: '8px 20px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
        <Skeleton width="30%" height="16px" />
      </div>
    </div>
  );
};

export default StatCardSkeleton;
