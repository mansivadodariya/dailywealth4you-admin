'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { formatDistanceToNow } from 'date-fns';
import { getNotification } from '@/service/notification';
import { updateNotification } from '@/store/slice/loginSlice';
import { useSearch } from '@/hooks/useSearch';
import { getSocket } from '@/utils/webSocket';
import styles from './notificationDropdown.module.scss';

const BellFillIcon = '/assets/icons/notification.svg';

export default function NotificationDropdown({ onClose }) {
  const dispatch = useDispatch();
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const notificationsRef = useRef(notifications);
  const { submittedSearchQuery } = useSearch();
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  useEffect(() => {
    notificationsRef.current = notifications;
  }, [notifications]);

  useEffect(() => {
    fetchNotifications();
  }, [page]);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const response = await getNotification({ page, limit });      
      if (response?.payload?.data) {
        setNotifications(response.payload.data);
        setTotal(response.payload.totalCount || response.payload.data.length);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (!submittedSearchQuery.trim()) return true;
    const title = n?.title?.toLowerCase() || '';
    const description = n?.description?.toLowerCase() || '';
    const query = submittedSearchQuery.toLowerCase();
    return title.includes(query) || description.includes(query);
  });

  const getTimeAgo = (dateString) => {
    if (!dateString) return '';
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return '';
    }
  };

  const markAllAsRead = async () => {
    try {
      const hasUnread = notificationsRef.current.some((n) => !n.isRead);
      if (!hasUnread) return;
      await dispatch(updateNotification({ isReadAll: true })).unwrap();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      getSocket()?.emit('check-notification', {});
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

//   const markOneAsRead = async (notification) => {
//     if (notification.isRead) return;
//     const notifId = notification.id || notification._id;
//     try {
//       await dispatch(updateNotification({ notificationId: notifId })).unwrap();
//       setNotifications((prev) =>
//         prev.map((n) =>
//           (n.id || n._id) === notifId ? { ...n, isRead: true } : n
//         )
//       );
//       getSocket()?.emit('check-notification', {});
//     } catch (error) {
//       console.error('Error marking notification as read:', error);
//     }
//   };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className={styles.dropdown}>
      {/* Header */}
      <div className={styles.dropdownHeader}>
        <div className={styles.titleRow}>
          <h3 className={styles.title}>Notifications</h3>
          {unreadCount > 0 && (
            <span className={styles.unreadBadge}>{unreadCount} Unread</span>
          )}
        </div>
        {unreadCount > 0 && (
          <button className={styles.markAllBtn} onClick={markAllAsRead}>
            Mark all as read
          </button>
        )}
      </div>

      {/* List */}
      <div className={styles.list}>
        {isLoading && (
          <div className={styles.emptyState}>Loading...</div>
        )}

        {!isLoading && filteredNotifications.length === 0 && (
          <div className={styles.emptyState}>No notifications yet.</div>
        )}

        {!isLoading &&
          filteredNotifications.map((notif, i) => {
            const notifId = notif?.id || notif?._id;
            return (
            <div
              key={notifId || i}
              className={`${styles.item} ${!notif?.isRead ? styles.unread : ''}`}
            //   onClick={() => markOneAsRead(notif)}
            >
              {/* Icon */}
              <div>
                <img
                  src={BellFillIcon}
                  alt="notification"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>

              {/* Content */}
              <div className={styles.content}>
                <p className={styles.message}>
                  {notif?.message || notif?.title || notif?.body || 'New notification'}
                </p>
                {notif?.description && (
                  <p className={styles.description}>
                    {notif.description}
                  </p>
                )}
                <span className={styles.time}>
                  {getTimeAgo(notif?.createdAt)}
                </span>
              </div>

              {/* Unread dot */}
              {!notif?.isRead && <span className={styles.dot} />}
            </div>
            );
          })}
      </div>
    </div>
  );
}
