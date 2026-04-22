'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import styles from './sidebar.module.scss';
import RightIcon from '@/icons/rightIcon';

const SidebarLogo = '/assets/logo/sidebar-logo.svg';

const sidebarData = [
  { id: 'dashboard',            label: 'Dashboard',           icon: '/assets/icons/dashboard.svg',             route: '/dashboard' },
  { id: 'users',                label: 'Users',               icon: '/assets/icons/Users.svg',                 route: '/users' },
  {
    id: 'commission',
    label: 'Commission',
    icon: '/assets/icons/Deposits.svg',
    children: [
      { id: 'profit-sharing', label: 'Profit Sharing', icon: '/assets/icons/ProfitSharing.svg', route: '/commission/profit-sharing' },
      { id: 'ib-income',      label: 'IB Income',      icon: '/assets/icons/IBIncome.svg',      route: '/commission/ib-income' },
    ],
  },
  { id: 'withdraw-requests',    label: 'Withdraw Requests',   icon: '/assets/icons/Withdraw Requests.svg',     route: '/withdraw-requests' },
  { id: 'deposits',             label: 'Deposits',            icon: '/assets/icons/Deposits.svg',              route: '/deposits' },
  { id: 'ib-requests',          label: 'IB Requests',         icon: '/assets/icons/IBRequests.svg',            route: '/ib-requests' },
  { id: 'send-notifications',   label: 'Send Notifications',  icon: '/assets/icons/SendNotifications.svg',     route: '/send-notifications' },
  { id: 'kyc-requests',         label: 'KYC Requests',        icon: '/assets/icons/KYCRequests.svg',           route: '/kyc-requests' },
  { id: 'sub-admins',           label: 'Sub-Admins',          icon: '/assets/icons/Sub-Admins.svg',            route: '/sub-admins' },
  { id: 'settings',             label: 'Settings',            icon: '/assets/icons/Settings.svg',              route: '/settings' },
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [openParent, setOpenParent] = useState(null);

  useEffect(() => {
    // find active among flat items and children
    for (const item of sidebarData) {
      if (item.children) {
        const child = item.children.find((c) => pathname.includes(c.id));
        if (child) {
          setActiveTab(child.id);
          setOpenParent(item.id);
          return;
        }
      } else if (pathname.includes(item.id)) {
        setActiveTab(item.id);
        return;
      }
    }
    setActiveTab('dashboard');
  }, [pathname]);

  const handleNavigation = (route) => {
    router.push(route);
  };

  const toggleParent = (id) => {
    setOpenParent((prev) => (prev === id ? null : id));
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <div className={styles.logoimage}>
          <img src={SidebarLogo} alt="SidebarLogo" />
        </div>
      </div>
      <div className={styles.scroll}>
        <div className={styles.sidebarBody}>
          {sidebarData.map((item) => {
            const isParentActive = item.children
              ? item.children.some((c) => activeTab === c.id)
              : activeTab === item.id;

            if (item.children) {
              return (
                <div key={item.id}>
                  <div
                    className={`${styles.menu} ${isParentActive ? styles.active : ''}`}
                    onClick={() => toggleParent(item.id)}
                  >
                    <div className={styles.leftAlignment}>
                      <img src={item.icon} alt={item.label} />
                      <span>{item.label}</span>
                    </div>
                    <div className={styles.rightAlignment}>
                      <RightIcon />
                    </div>
                  </div>
                  {openParent === item.id && (
                    <div className={styles.children}>
                      {item.children.map((child, idx) => (
                        <div key={child.id} className={styles.childRow}>
                          <div className={`${styles.treeLine} ${idx === item.children.length - 1 ? styles.treeLineLast : ''}`} />
                          <div
                            className={`${styles.menu} ${activeTab === child.id ? styles.active : ''}`}
                            onClick={() => { setActiveTab(child.id); handleNavigation(child.route); }}
                          >
                            <div className={styles.leftAlignment}>
                              <img src={child.icon} alt={child.label} />
                              <span>{child.label}</span>
                            </div>
                            <div className={styles.rightAlignment}>
                              <RightIcon />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <div
                key={item.id}
                className={`${styles.menu} ${activeTab === item.id ? styles.active : ''}`}
                onClick={() => { setActiveTab(item.id); handleNavigation(item.route); }}
              >
                <div className={styles.leftAlignment}>
                  <img src={item.icon} alt={item.label} />
                  <span>{item.label}</span>
                </div>
                <div className={styles.rightAlignment}>
                  <RightIcon />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
