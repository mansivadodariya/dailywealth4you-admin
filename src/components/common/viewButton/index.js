import React from 'react';
import styles from './viewButton.module.scss';

const ViewButton = ({ onClick, children, ...props }) => {
  return (
    <button className={styles.btnView} onClick={onClick} {...props}>
      {children || 'View'}
    </button>
  );
};

export default ViewButton;
