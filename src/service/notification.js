import api from './api';
import { GET_ALL_NOTIFICATIONS, UPDATE_NOTIFICATION } from './url';

/**
 * Fetch paginated notifications.
 * @param {{ page?: number, limit?: number }} params
 */
export const getNotification = ({ page = 1, limit = 10 } = {}) =>
  api.get(`${GET_ALL_NOTIFICATIONS}?page=${page}&limit=${limit}`);

/**
 * Mark notification(s) as read.
 * @param {string|null} id - pass notification _id to mark one, omit/null to mark all
 */
export const updateNotification = (id) =>
  api.put(UPDATE_NOTIFICATION, id ? { id } : {});
