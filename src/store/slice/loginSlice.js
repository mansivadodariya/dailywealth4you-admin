import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '@/service/api';
import {
  clearAuthCookies,
  getTokenFromCookie,
  getUserFromCookie,
  setAuthCookies,
} from '@/service/cookies';
import { ADMIN_LOGIN, LOGIN, RESET_PASSWORD, GET_ALL_NOTIFICATIONS, UPDATE_NOTIFICATION } from '@/service/url';
import { toast } from 'react-toastify';

export const fetchNotifications = createAsyncThunk(
  'login/fetchNotifications',
  async (_, thunkApi) => {
    try {
      const response = await api.get(GET_ALL_NOTIFICATIONS);
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const updateNotification = createAsyncThunk(
  'notification/updateNotification',
  async (arg) => {
    const { notificationId = null, isReadAll = false } = arg || {};
    try {
      const url = `${UPDATE_NOTIFICATION}?id=${notificationId}&isReadAll=${isReadAll}`;
      const response = await api.put(url, { isRead: true });
      return { ...response, _notifId: notificationId };
    } catch (error) {
      console.error('Error updating notification', error);
      return { error: true, message: error.message };
    }
  }
);

const getRoleFromUser = (user) =>
  user?.role ??
  user?.roleId ??
  user?.payload?.role ??
  user?.payload?.roleId ??
  null;

const getRoleFromResponse = (responseData, user) =>
  responseData?.role ??
  responseData?.roleId ??
  responseData?.payload?.role ??
  responseData?.payload?.roleId ??
  responseData?.data?.role ??
  responseData?.data?.roleId ??
  getRoleFromUser(user);

const initialUser = getUserFromCookie();

export const loginUser = createAsyncThunk(
  'login/loginUser',
  async (payload, thunkApi) => {
    try {
      const response = await api.post(LOGIN, payload);
      return response;
    } catch (error) {

      return thunkApi.rejectWithValue(error);
    }
  }
);

export const adminLoginUser = createAsyncThunk(
  'login/adminLoginUser',
  async (payload, thunkApi) => {
    try {
      const response = await api.post(ADMIN_LOGIN, payload);
      return response;
    } catch (error) {

      return thunkApi.rejectWithValue(error);
    }
  }
);

export const resetPassword = createAsyncThunk(
  'login/resetPassword',
  async (payload, thunkApi) => {
    try {
      const authToken = payload?.token || getTokenFromCookie();
      const response = await api.put(
        RESET_PASSWORD,
        {
          oldPassword: payload?.oldPassword,
          newPassword: payload?.newPassword,
        },
        {
          headers: authToken
            ? {
                'x-auth-token': authToken,
              }
            : {},
        }
      );
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

const initialState = {
  isLoading: false,
  error: null,
  user: initialUser,
  token: getTokenFromCookie(),
  resetPasswordLoading: false,
  resetPasswordError: null,
  resetPasswordData: null,
  role: getRoleFromUser(initialUser),
  notifications: [],
  notificationsLoading: false,
  unreadCount: 0,
};

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.role = null;
      state.error = null;
      state.notifications = [];
      state.unreadCount = 0;
      clearAuthCookies();
    },
    clearLoginState: (state) => {
      state.error = null;
      state.isLoading = false;
      state.resetPasswordLoading = false;
      state.resetPasswordError = null;
      state.resetPasswordData = null;
    },
    markAllRead: (state) => {
      state.notifications = state.notifications.map((n) => ({ ...n, isRead: true }));
      state.unreadCount = 0;
    },
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      if (!action.payload.isRead) {
        state.unreadCount += 1;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;

        const responseData = action.payload?.data || action.payload;
        const payloadData =
          responseData?.payload || responseData?.data || responseData;

        const token = payloadData?.token || responseData?.token;
        const user =
          payloadData?.user ||
          payloadData ||
          responseData?.user ||
          responseData ||
          null;

        const savedUser =
          user && typeof user === 'object'
            ? { ...user, token: undefined }
            : user;

        state.token = token;
        state.user = savedUser;
        state.role = getRoleFromResponse(responseData, savedUser);

        setAuthCookies({ token, user: savedUser });
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Login failed';
      })
      .addCase(adminLoginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(adminLoginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;

        const responseData = action.payload?.data || action.payload;
        const payloadData =
          responseData?.payload || responseData?.data || responseData;

        const token = payloadData?.token || responseData?.token;
        const user =
          payloadData?.user ||
          payloadData ||
          responseData?.user ||
          responseData ||
          null;

        const savedUser =
          user && typeof user === 'object'
            ? { ...user, token: undefined }
            : user;

        state.token = token;
        state.user = savedUser;
        state.role = getRoleFromResponse(responseData, savedUser);

        setAuthCookies({ token, user: savedUser });
      })
      .addCase(adminLoginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Admin login failed';
      })
      .addCase(resetPassword.pending, (state) => {
        state.resetPasswordLoading = true;
        state.resetPasswordError = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.resetPasswordLoading = false;
        state.resetPasswordError = null;
        state.resetPasswordData = action.payload?.data || action.payload;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.resetPasswordLoading = false;
        state.resetPasswordError = action.payload || 'Reset password failed';
      })
      .addCase(fetchNotifications.pending, (state) => {
        state.notificationsLoading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.notificationsLoading = false;
        const data = action.payload?.data || action.payload || [];
        const list = Array.isArray(data) ? data : data?.notifications || [];
        state.notifications = list;
        state.unreadCount = list.filter((n) => !n.isRead).length;
      })
      .addCase(fetchNotifications.rejected, (state) => {
        state.notificationsLoading = false;
      })
      .addCase(updateNotification.fulfilled, (state, action) => {
        const notifId = action.payload?._notifId;
        if (notifId) {
          // Mark single notification as read
          state.notifications = state.notifications.map((n) =>
            (n.id || n._id) === notifId ? { ...n, isRead: true } : n
          );
        } else {
          // Mark all as read
          state.notifications = state.notifications.map((n) => ({ ...n, isRead: true }));
        }
        state.unreadCount = state.notifications.filter((n) => !n.isRead).length;
      });
  },
});

export const { logout, clearLoginState, markAllRead, addNotification } = loginSlice.actions;
export default loginSlice.reducer;
