'use client';

import React from 'react';
import styles from './authButton.module.scss';
import classNames from 'classnames';

export default function AuthButton({
  text,
  icon,
  type = 'button',
  onClick,
  outline,
  disabled,
  loading = false,
}) {
  return (
    <div
      className={classNames(
        styles.authbutton,
        outline ? styles.outlineButton : '',
        loading ? styles.loading : ''
      )}
    >
      <button
        aria-label={text}
        type={type}
        onClick={onClick}
        disabled={disabled || loading}
      >
        {loading ? <span className={styles.spinner} /> : (
          <>
            {text}
            {icon && <img src={icon} alt={icon} />}
          </>
        )}
      </button>
    </div>
  );
}
