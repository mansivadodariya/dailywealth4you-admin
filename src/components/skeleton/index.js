import React from 'react';
import styles from './Skeleton.module.scss';
import classNames from 'classnames';

const Skeleton = ({ 
  width, 
  height, 
  variant = 'rect', 
  className,
  style 
}) => {
  const skeletonClass = classNames(
    styles.skeleton,
    styles[variant],
    className
  );

  return (
    <div 
      className={skeletonClass} 
      style={{ 
        width, 
        height, 
        ...style 
      }} 
    />
  );
};

export default Skeleton;
