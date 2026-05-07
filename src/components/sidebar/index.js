'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/store/reducers';
import styles from './sidebar.module.scss';
import RightIcon from '@/icons/rightIcon';

const SidebarLogo = '/assets/logo/sidebar-logo.svg';

export const sidebarData = [
  { id: 'performance', label: 'Performance Dashboard', icon: '/assets/icons/dashboard.svg', route: '/performance' },
  { id: 'dashboard', label: 'Dashboard', icon: '/assets/icons/dashboard.svg', route: '/dashboard' },
  { id: 'users',                label: 'Users',               icon: '/assets/icons/Users.svg',                 route: '/users' },
  {
    id: 'commission',
    label: 'Commission',
    icon: '/assets/icons/Commission.svg',
    children: [
      { id: 'profit-sharing', label: 'Profit Sharing', icon: '/assets/icons/ProfitSharing.svg', route: '/commission/profit-sharing' },
      { id: 'ib-income',      label: 'IB Income',      icon: '/assets/icons/IBIncome.svg',      route: '/commission/ib-income' },
    ],
  },
  {
    id: 'social',
    label: 'Social',
    icon: '/assets/icons/Commission.svg',
    children: [
      { id: 'social-pool', label: 'Social Pool', icon: '/assets/icons/ProfitSharing.svg', route: '/social/social-pool' },
      { id: 'trade-history', label: 'Trade History', icon: '/assets/icons/IBIncome.svg', route: '/social/trade-history' },
    ],
  },
  { id: 'withdraw-requests',    label: 'Withdraw Requests',   icon: '/assets/icons/WithdrawRequests.svg',     route: '/withdraw-requests' },
  { id: 'deposits',             label: 'Deposits',            icon: '/assets/icons/Deposits.svg',              route: '/deposits' },
  { id: 'ib-requests',          label: 'IB Requests',         icon: '/assets/icons/IBRequests.svg',            route: '/ib-requests' },
  { id: 'send-notifications',   label: 'Send Notifications',  icon: '/assets/icons/SendNotifications.svg',     route: '/send-notifications' },
  { id: 'kyc-requests',         label: 'KYC Requests',        icon: '/assets/icons/KYCRequests.svg',           route: '/kyc-requests' },
  { id: 'sub-admins',           label: 'Sub-Admins',          icon: '/assets/icons/Sub-Admins.svg',            route: '/sub-admins' },
  { id: 'contact-us',           label: 'Contact Us',          icon: '/assets/icons/Contact.svg',              route: '/contact-us' },
  { id: 'manage-tutorials',     label: 'Manage Tutorials',    icon: '/assets/icons/ManageTutorials.svg',       route: '/manage-tutorials' },
  { id: 'manage-brokers',       label: 'Manage Brokers',      icon: '/assets/icons/ManageBrokers.svg',         route: '/manage-brokers' },
  { id: 'settings',             label: 'Settings',            icon: '/assets/icons/Settings.svg',              route: '/settings' },
];

export const permissionMap = {
  'dashboard': 'Access Dashboard Overview',
  'users': 'Manage Users',
  'withdraw-requests': 'Manage Withdraw Requests',
  'ib-requests': 'Manage IB Requests',
  'kyc-requests': 'Manage KYC Requests',
  'send-notifications': 'Send Notifications',
  'contact-us': 'Manage Contact Us',
  'manage-tutorials': 'Manage Tutorials',
  'manage-brokers': 'Manage Brokers',
};

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.login.user);
  const userRole = useSelector((state) => state.login.role);
  const permissions = user?.permissions || [];
  
  const isAdmin = 
    userRole === 'admin' || 
    user?.roleId === 'admin' || 
    user?.role === 'admin' ||
    user?.payload?.role === 'admin' ||
    user?.payload?.roleId === 'admin';

  const visibleSidebarData = React.useMemo(() => {
    if (isAdmin) return sidebarData;
    return sidebarData.filter(item => {
      const reqPerm = permissionMap[item.id];
      if (!reqPerm) return false; 
      return permissions.includes(reqPerm);
    });
  }, [isAdmin, permissions]);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [openParent, setOpenParent] = useState(null);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
  };

  useEffect(() => {
    // find active among flat items and children
    for (const item of visibleSidebarData) {
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
  }, [pathname, visibleSidebarData]);

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
          {visibleSidebarData.map((item) => {
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

      <div className={styles.logoutWrapper}>
        <div className={styles.logoutDivider} />
        <div className={`${styles.menu} ${styles.logoutMenu}`} onClick={handleLogout}>
          <div className={styles.leftAlignment}>
            <img src="/assets/icons/Logout.svg" alt="Logout" />
            <span>Logout</span>
          </div>
          <div className={styles.rightAlignment}>
            <RightIcon />
          </div>
        </div>
      </div>
    </aside>
  );
}
