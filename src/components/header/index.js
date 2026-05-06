'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import styles from './header.module.scss';
import NotificationDropdown from '@/components/modal/NotificationDropdown';
import { getUserFromCookie } from '@/service/cookies';
import { toast } from 'react-toastify';

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
  '/performance': 'Performance Dashboard',
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
  const user = getUserFromCookie();
  const referralCode = user?.referralCode || '—';
  const [baseUrl, setBaseUrl] = useState('https://dailywealth4you-user.vercel.app');

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.origin.includes('localhost')) {
      // Keep hardcoded for now as requested, but we could use window.location.origin if needed
    }
  }, []);

  const handleCopyReferral = () => {
    if (referralCode && referralCode !== '—') {
      navigator.clipboard.writeText(referralCode);
      toast.success('Referral code copied to clipboard!');
    }
  };

  const handleShareReferral = (e) => {
    e.stopPropagation();
    if (referralCode && referralCode !== '—') {
      const shareUrl = `https://dailywealth4you-user.vercel.app/signup/${referralCode}`;
      navigator.clipboard.writeText(shareUrl);
      toast.success('Referral link copied to clipboard!');
    }
  };

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
        <div className={styles.referralBox}>
          <div className={styles.codeSection} onClick={handleCopyReferral} title="Click to copy referral code">
            <span className={styles.referralLabel}>Referral Code:</span>
            <span className={styles.referralValue}>{referralCode}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={styles.copyIcon}>
              <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
              <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
            </svg>
          </div>
          <div className={styles.shareIconWrap} onClick={handleShareReferral} title="Copy referral link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={styles.shareIcon}>
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
              <polyline points="16 6 12 2 8 6" />
              <line x1="12" y1="2" x2="12" y2="15" />
            </svg>
          </div>
        </div>

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
