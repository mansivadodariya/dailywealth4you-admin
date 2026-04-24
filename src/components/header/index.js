'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import styles from './header.module.scss';
import NotificationDropdown from '@/components/modal/NotificationDropdown';

const BellIcon = '/assets/icons/bell.svg';

const routeTitles = {
  '/dashboard': 'Dashboard',
  '/accounts': 'Accounts',
  '/profit-sharing': 'Profit Sharing',
  '/contact-us': 'Contact Us',
  '/transactions': 'Transactions',
  '/faqs': 'FAQs',
  '/tutorials': 'Tutorials',
  '/economic-calendar': 'Economic Calendar',
  '/ib-requests': 'IB Requests',
  '/kyc-requests': 'KYC Requests',
};

function getTitleFromPath(pathname) {
  if (!pathname) return 'Dashboard';
  if (routeTitles[pathname]) return routeTitles[pathname];
  const parts = pathname.split('/').filter(Boolean);
  if (!parts.length) return 'Dashboard';
  return parts[parts.length - 1]
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function Header() {
  const pathname = usePathname();
  const pageTitle = getTitleFromPath(pathname);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const unreadCount = useSelector((state) => state.login.unreadCount);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className={styles.header}>
      <h2>{pageTitle}</h2>
      <div className={styles.rightAlignment}>
        <div className={styles.bellWrapper} ref={dropdownRef}>
          <button
            className={styles.bellBtn}
            onClick={() => setDropdownOpen((prev) => !prev)}
            aria-label="Notifications"
          >
            <img src={BellIcon} alt="Notifications" />
            {unreadCount > 0 && <span className={styles.redDot} />}
          </button>

          {dropdownOpen && (
            <NotificationDropdown onClose={() => setDropdownOpen(false)} />
          )}
        </div>
        <div className={styles.line} />
      </div>
    </header>
  );
}
