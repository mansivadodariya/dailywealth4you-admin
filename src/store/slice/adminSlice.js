import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import api from '@/service/api';
import {
  GET_ALL_USERS,
  GET_ALL_IB_REQUESTS,
  UPDATE_IB_REQUEST,
  GET_ALL_KYC_DOCUMENTS,
  UPDATE_KYC_DOCUMENT,
  UPDATE_TRANSACTION,
  BLOCK_USER,
  ADD_SUB_ADMIN,
  UPDATE_SUB_ADMIN,
  DELETE_SUB_ADMIN,
  GET_ALL_SUB_ADMINS,
  CREATE_NOTIFICATION,
  CREATE_POPUP,
  GET_POPUP,
  GET_SETTING,
  UPDATE_SETTING,
  UPLOAD_IMAGE,
  GET_IB_CLIENTS,
  GET_ADMIN_IB_INCOME,
  GET_ALL_CONTACT_US,
  GET_ADMIN_PROFIT_SHARING,
  GET_ALL_TRANSACTIONS,
  GET_USER_DASHBOARD_PROFIT_LOTS,
  GET_ADMIN_DASHBOARD_STATS,
  GET_ADMIN_PROFIT_AND_IB_COMMISSION,
  GET_ADMIN_DASHBOARD_PROFIT,
} from '@/service/url';

export const fetchAllUsers = createAsyncThunk(
  'admin/fetchAllUsers',
  async (filters = {}, thunkApi) => {
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.dateFrom) params.append('startDate', filters.dateFrom);
      if (filters.dateTo) params.append('endDate', filters.dateTo);
      if (filters.minProfit !== '' && filters.minProfit != null) params.append('minProfit', filters.minProfit);
      if (filters.maxProfit !== '' && filters.maxProfit != null) params.append('maxProfit', filters.maxProfit);
      if (filters.minDeposit !== '' && filters.minDeposit != null) params.append('minDeposit', filters.minDeposit);
      if (filters.maxDeposit !== '' && filters.maxDeposit != null) params.append('maxDeposit', filters.maxDeposit);
      if (filters.ibUser) params.append('isIbUser', filters.ibUser === 'yes');
      if (filters.status) params.append('isActive', filters.status === 'active');
      if (filters.page) params.append('page', filters.page);
      params.append('limit', filters.limit || 10);
      const query = params.toString();
      return await api.get(query ? `${GET_ALL_USERS}?${query}` : GET_ALL_USERS);
    } catch (error) {

      return thunkApi.rejectWithValue(error);
    }
  }
);

export const fetchIbRequests = createAsyncThunk(
  'admin/fetchIbRequests',
  async ({ search = '', userId, page, limit, dateFrom, dateTo, status } = {}, thunkApi) => {
    try {
      const params = new URLSearchParams();
      if (userId) params.append('userId', userId);
      if (search) params.append('search', search);
      if (dateFrom) params.append('startDate', dateFrom);
      if (dateTo) params.append('endDate', dateTo);
      if (status) params.append('status', status);
      if (page) params.append('page', page);
      params.append('limit', limit || 10);
      const query = params.toString();
      return await api.get(query ? `${GET_ALL_IB_REQUESTS}?${query}` : GET_ALL_IB_REQUESTS);
    } catch (error) {

      return thunkApi.rejectWithValue(error);
    }
  }
);

export const updateIbRequest = createAsyncThunk(
  'admin/updateIbRequest',
  async ({ id, status }, thunkApi) => {
    try {
      const state = thunkApi.getState();
      const adminId = state.login?.user?._id || state.login?.user?.id;
      const query = new URLSearchParams({ id });
      if (adminId) query.append('instructorId', adminId);
      const response = await api.put(`${UPDATE_IB_REQUEST}?${query.toString()}`, { status });
      toast.success('IB request updated.');
      return response;
    } catch (error) {

      return thunkApi.rejectWithValue(error);
    }
  }
);

export const fetchWithdrawRequests = createAsyncThunk(
  'admin/fetchWithdrawRequests',
  async ({ search = '', page, limit, dateFrom, dateTo, status, withdrawalMin, withdrawalMax } = {}, thunkApi) => {
    try {
      const params = new URLSearchParams();
      params.append('type', 'withdrawal');
      if (search) params.append('search', encodeURIComponent(search));
      if (dateFrom) params.append('startDate', dateFrom);
      if (dateTo) params.append('endDate', dateTo);
      if (status) params.append('status', status);
      if (withdrawalMin !== '' && withdrawalMin != null) params.append('amountMin', withdrawalMin);
      if (withdrawalMax !== '' && withdrawalMax != null) params.append('amountMax', withdrawalMax);
      if (page) params.append('page', page);
      params.append('limit', limit || 10);
      return await api.get(`${GET_ALL_TRANSACTIONS}?${params.toString()}`);
    } catch (error) {

      return thunkApi.rejectWithValue(error);
    }
  }
);

// Removed updateWithdrawRequest in favor of updateTransaction

export const fetchAllKycDocuments = createAsyncThunk(
  'admin/fetchAllKycDocuments',
  async ({ search = '', page, limit, dateFrom, dateTo, status } = {}, thunkApi) => {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', encodeURIComponent(search));
      if (dateFrom) params.append('startDate', dateFrom);
      if (dateTo) params.append('endDate', dateTo);
      if (status) params.append('status', status);
      if (page) params.append('page', page);
      params.append('limit', limit || 10);
      const query = params.toString();
      return await api.get(query ? `${GET_ALL_KYC_DOCUMENTS}?${query}` : GET_ALL_KYC_DOCUMENTS);
    } catch (error) {

      return thunkApi.rejectWithValue(error);
    }
  }
);

export const fetchAllSubAdmins = createAsyncThunk(
  'admin/fetchAllSubAdmins',
  async ({ page, limit, search = '' } = {}, thunkApi) => {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (page) params.append('page', page);
      params.append('limit', limit || 10);
      const query = params.toString();
      return await api.get(query ? `${GET_ALL_SUB_ADMINS}?${query}` : GET_ALL_SUB_ADMINS);
    } catch (error) {

      return thunkApi.rejectWithValue(error);
    }
  }
);

export const addSubAdmin = createAsyncThunk(
  'admin/addSubAdmin',
  async ({ email, password, permissions }, thunkApi) => {
    try {
      const response = await api.post(ADD_SUB_ADMIN, { email, password, permissions });
      toast.success('Sub-admin created.');
      return response;
    } catch (error) {

      return thunkApi.rejectWithValue(error);
    }
  }
);

export const updateSubAdmin = createAsyncThunk(
  'admin/updateSubAdmin',
  async ({ id, password, permissions }, thunkApi) => {
    try {
      const data = { id, permissions };
      if (password) data.password = password;
      const response = await api.put(`${UPDATE_SUB_ADMIN}?id=${id}`, data);
      toast.success('Sub-admin updated.');
      return response;
    } catch (error) {

      return thunkApi.rejectWithValue(error);
    }
  }
);

export const deleteSubAdmin = createAsyncThunk(
  'admin/deleteSubAdmin',
  async (id, thunkApi) => {
    try {
      await api.delete(`${DELETE_SUB_ADMIN}?id=${id}`);
      toast.success('Sub-admin deleted.');
      return id;
    } catch (error) {

      return thunkApi.rejectWithValue(error);
    }
  }
);

export const blockUser = createAsyncThunk(
  'admin/blockUser',
  async (userId, thunkApi) => {
    try {
      const response = await api.put(`${BLOCK_USER}?id=${userId}`, { isActive: false });
      toast.success('User blocked.');
      return response;
    } catch (error) {

      return thunkApi.rejectWithValue(error);
    }
  }
);

export const updateKycDocument = createAsyncThunk(
  'admin/updateKycDocument',
  async ({ id, status }, thunkApi) => {
    try {
      const response = await api.put(`${UPDATE_KYC_DOCUMENT}?id=${id}`, { status });
      toast.success('KYC status updated.');
      return response;
    } catch (error) {

      return thunkApi.rejectWithValue(error);
    }
  }
);

export const createNotification = createAsyncThunk(
  'admin/createNotification',
  async ({ title, description }, thunkApi) => {
    try {
      const response = await api.post(CREATE_NOTIFICATION, { title, description });
      toast.success('Notification sent.');
      return response;
    } catch (error) {

      return thunkApi.rejectWithValue(error);
    }
  }
);

export const createPopup = createAsyncThunk(
  'admin/createPopup',
  async ({ link, file }, thunkApi) => {
    try {
      // Step 1: upload image via multipart, get back the image URL
      const formData = new FormData();
      formData.append('image', file);
      const uploadRes = await api.post(UPLOAD_IMAGE, formData);
      const imageUrl = uploadRes?.payload;

      if (!imageUrl) throw new Error('Image upload failed: no URL returned.');

      // Step 2: send popup as JSON with the returned image URL
      const response = await api.post(CREATE_POPUP, { link, image: imageUrl });
      toast.success('Popup sent.');
      return response;
    } catch (error) {

      return thunkApi.rejectWithValue(error);
    }
  }
);

export const fetchPopup = createAsyncThunk(
  'admin/fetchPopup',
  async (_, thunkApi) => {
    try {
      return await api.get(GET_POPUP);
    } catch (error) {

      return thunkApi.rejectWithValue(error);
    }
  }
);

export const fetchSetting = createAsyncThunk(
  'admin/fetchSetting',
  async (_, thunkApi) => {
    try {
      return await api.get(GET_SETTING);
    } catch (error) {

      return thunkApi.rejectWithValue(error);
    }
  }
);

export const updateSetting = createAsyncThunk(
  'admin/updateSetting',
  async ({ id, ...data }, thunkApi) => {
    try {
      const response = await api.put(`${UPDATE_SETTING}?id=${id}`, data);
      toast.success('Settings updated.');
      return response;
    } catch (error) {

      return thunkApi.rejectWithValue(error);
    }
  }
);

export const fetchAllContactUs = createAsyncThunk(
  'admin/fetchAllContactUs',
  async ({ search = '', page, limit } = {}, thunkApi) => {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (page) params.append('page', page);
      params.append('limit', limit || 10);
      const query = params.toString();
      return await api.get(query ? `${GET_ALL_CONTACT_US}?${query}` : GET_ALL_CONTACT_US);
    } catch (error) {

      return thunkApi.rejectWithValue(error);
    }
  }
);

export const fetchAdminIbIncome = createAsyncThunk(
  'admin/fetchAdminIbIncome',
  async ({ search = '', page, limit } = {}, thunkApi) => {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (page) params.append('page', page);
      params.append('limit', limit || 10);
      const query = params.toString();
      return await api.get(query ? `${GET_ADMIN_IB_INCOME}?${query}` : GET_ADMIN_IB_INCOME);
    } catch (error) {

      return thunkApi.rejectWithValue(error);
    }
  }
);


export const fetchAdminProfitSharing = createAsyncThunk(
  'admin/fetchAdminProfitSharing',
  async ({ search = '', page, limit } = {}, thunkApi) => {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (page) params.append('page', page);
      params.append('limit', limit || 10);
      const query = params.toString();
      return await api.get(query ? `${GET_ADMIN_PROFIT_SHARING}?${query}` : GET_ADMIN_PROFIT_SHARING);
    } catch (error) {

      return thunkApi.rejectWithValue(error);
    }
  }
);

export const fetchIbClients = createAsyncThunk(
  'admin/fetchIbClients',
  async (userId, thunkApi) => {
    try {
      return await api.get(`${GET_IB_CLIENTS}?userId=${userId}`);
    } catch (error) {

      return thunkApi.rejectWithValue(error);
    }
  }
);

export const fetchTransactions = createAsyncThunk(
  'admin/fetchTransactions',
  async ({ type, search = '', page, limit, dateFrom, dateTo, minDeposit, maxDeposit, status } = {}, thunkApi) => {
    try {
      const params = new URLSearchParams();
      if (type) params.append('type', type);
      if (search) params.append('search', search);
      if (dateFrom) params.append('startDate', dateFrom);
      if (dateTo) params.append('endDate', dateTo);
      if (minDeposit !== '' && minDeposit != null) params.append('amountMin', minDeposit);
      if (maxDeposit !== '' && maxDeposit != null) params.append('amountMax', maxDeposit);
      if (status) params.append('status', status);
      if (page) params.append('page', page);
      params.append('limit', limit || 10);
      return await api.get(`${GET_ALL_TRANSACTIONS}?${params.toString()}`);
    } catch (error) {

      return thunkApi.rejectWithValue(error);
    }
  }
);

export const updateTransaction = createAsyncThunk(
  'admin/updateTransaction',
  async ({ id, status, file }, thunkApi) => {
    try {
      let data = { status };
      if (file) {
        const formData = new FormData();
        formData.append('image', file);
        const uploadRes = await api.post(UPLOAD_IMAGE, formData);
        data.proofUrl = uploadRes?.payload; // Changed from proofOfTransfer to proofUrl
      }
      const response = await api.put(`${UPDATE_TRANSACTION}?id=${id}`, data);
      toast.success('Transaction updated.');
      return response;
    } catch (error) {

      return thunkApi.rejectWithValue(error);
    }
  }
);

export const fetchUserDashboardProfitLots = createAsyncThunk(
  'admin/fetchUserDashboardProfitLots',
  async ({ startDate, endDate } = {}, thunkApi) => {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      const query = params.toString();
      return await api.get(query ? `${GET_USER_DASHBOARD_PROFIT_LOTS}?${query}` : GET_USER_DASHBOARD_PROFIT_LOTS);
    } catch (error) {

      return thunkApi.rejectWithValue(error);
    }
  }
);

export const fetchAdminDashboardStats = createAsyncThunk(
  'admin/fetchAdminDashboardStats',
  async (_, thunkApi) => {
    try {
      return await api.get(GET_ADMIN_DASHBOARD_STATS);
    } catch (error) {

      return thunkApi.rejectWithValue(error);
    }
  }
);

export const fetchAdminProfitAndIbCommission = createAsyncThunk(
  'admin/fetchAdminProfitAndIbCommission',
  async (_, thunkApi) => {
    try {
      return await api.get(GET_ADMIN_PROFIT_AND_IB_COMMISSION);
    } catch (error) {

      return thunkApi.rejectWithValue(error);
    }
  }
);
export const fetchAdminDashboardProfit = createAsyncThunk(
  'admin/fetchAdminDashboardProfit',
  async (_, thunkApi) => {
    try {
      return await api.get(GET_ADMIN_DASHBOARD_PROFIT);
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);
const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    subAdmins: null,
    subAdminsTotalPages: 1,
    users: null,
    usersTotalPages: 1,
    ibRequests: null,
    ibRequestsTotalPages: 1,
    kycDocuments: null,
    kycDocumentsTotalPages: 1,
    withdrawRequests: null,
    withdrawRequestsTotalPages: 1,
    ibClients: null,
    ibClientsLoading: false,
    contactUs: null,
    contactUsTotalPages: 1,
    ibIncome: null,
    ibIncomeTotalPages: 1,
    profitSharing: null,
    profitSharingTotalPages: 1,
    setting: null,
    popup: null,
    loading: false,
    error: null,
    transactions: null,
    transactionsTotalPages: 1,
    transactionsSummary: null,
    withdrawRequestsSummary: null,
    dashboardProfitLots: {},
    dashboardStats: null,
    adminProfitAndIbCommission: null,
    dashboardProfit: null,
  },
  reducers: {
    clearAdminState: (state) => {
      state.subAdmins = [];
      state.subAdminsTotalPages = 1;
      state.users = [];
      state.usersTotalPages = 1;
      state.ibRequests = [];
      state.ibRequestsTotalPages = 1;
      state.kycDocuments = [];
      state.kycDocumentsTotalPages = 1;
      state.withdrawRequests = [];
      state.withdrawRequestsTotalPages = 1;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const pending = (state) => { state.loading = true; state.error = null; };
    const rejected = (state, action) => { state.loading = false; state.error = action.payload; };

    builder
      .addCase(fetchAllUsers.pending, pending)
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        const res = action.payload;
        const inner = res?.payload ?? res?.data ?? res;
        const data = inner?.data ?? (Array.isArray(inner) ? inner : []);
        const total = inner?.totalPages ?? inner?.meta?.totalPages ?? res?.totalPages ?? null;
        const count = inner?.count ?? inner?.total ?? inner?.totalCount ?? res?.count ?? null;
        const limit = inner?.limit ?? inner?.perPage ?? res?.limit ?? 10;

        state.users = Array.isArray(data) ? data : [];
        state.usersTotalPages = (count != null ? Math.ceil(count / limit) : total) || 1;
      })
      .addCase(fetchAllUsers.rejected, rejected)

      .addCase(fetchIbRequests.pending, pending)
      .addCase(fetchIbRequests.fulfilled, (state, action) => {
        state.loading = false;
        const res = action.payload;
        const inner = res?.payload ?? res?.data ?? res;
        const data = inner?.data ?? (Array.isArray(inner) ? inner : []);
        const total = inner?.totalPages ?? inner?.meta?.totalPages ?? res?.totalPages ?? null;
        const count = inner?.count ?? inner?.total ?? inner?.totalCount ?? res?.count ?? null;
        const limit = inner?.limit ?? inner?.perPage ?? res?.limit ?? 10;

        state.ibRequests = Array.isArray(data) ? data : [];
        state.ibRequestsTotalPages = (count != null ? Math.ceil(count / limit) : total) || 1;
      })
      .addCase(fetchIbRequests.rejected, rejected)

      .addCase(updateIbRequest.pending, pending)
      .addCase(updateIbRequest.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload?.payload?.data || action.payload?.data || action.payload;
        if (updated?.id) {
          state.ibRequests = state.ibRequests.map((r) => r.id === updated.id ? updated : r);
        }
      })
      .addCase(updateIbRequest.rejected, rejected)

      .addCase(fetchAllKycDocuments.pending, pending)
      .addCase(fetchAllKycDocuments.fulfilled, (state, action) => {
        state.loading = false;
        const res = action.payload;
        const inner = res?.payload ?? res?.data ?? res;
        const data = inner?.data ?? (Array.isArray(inner) ? inner : []);
        const total = inner?.totalPages ?? inner?.meta?.totalPages ?? res?.totalPages ?? null;
        const count = inner?.count ?? inner?.total ?? inner?.totalCount ?? res?.count ?? null;
        const limit = inner?.limit ?? inner?.perPage ?? res?.limit ?? 10;

        state.kycDocuments = Array.isArray(data) ? data : [];
        state.kycDocumentsTotalPages = (count != null ? Math.ceil(count / limit) : total) || 1;
      })
      .addCase(fetchAllKycDocuments.rejected, rejected)

      .addCase(updateKycDocument.pending, pending)
      .addCase(updateKycDocument.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload?.payload?.data || action.payload?.data || action.payload;
        if (updated?.id) {
          state.kycDocuments = state.kycDocuments.map((d) => d.id === updated.id ? updated : d);
        }
      })
      .addCase(updateKycDocument.rejected, rejected)

      .addCase(fetchWithdrawRequests.pending, pending)
      .addCase(fetchWithdrawRequests.fulfilled, (state, action) => {
        state.loading = false;
        const res = action.payload;
        const inner = res?.payload ?? res?.data ?? res;
        const data = inner?.data ?? (Array.isArray(inner) ? inner : []);
        const total = inner?.totalPages ?? inner?.meta?.totalPages ?? res?.totalPages ?? null;
        const count = inner?.count ?? inner?.total ?? inner?.totalCount ?? res?.count ?? null;
        const limit = inner?.limit ?? inner?.perPage ?? res?.limit ?? 10;

        state.withdrawRequests = Array.isArray(data) ? data : [];
        state.withdrawRequestsSummary = inner?.summary ?? null;
        state.withdrawRequestsTotalPages = (count != null ? Math.ceil(count / limit) : total) || 1;
      })
      .addCase(fetchWithdrawRequests.rejected, rejected)

      .addCase(updateTransaction.pending, pending)
      .addCase(updateTransaction.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload?.payload?.data || action.payload?.data || action.payload;
        if (updated?.id) {
          state.withdrawRequests = state.withdrawRequests.map((r) => r.id === updated.id ? updated : r);
          state.transactions = state.transactions.map((r) => r.id === updated.id ? updated : r);
        }
      })
      .addCase(updateTransaction.rejected, rejected)

      .addCase(fetchAllSubAdmins.pending, pending)
      .addCase(fetchAllSubAdmins.fulfilled, (state, action) => {
        state.loading = false;
        const res = action.payload;
        const inner = res?.payload ?? res?.data ?? res;
        const data = inner?.data ?? (Array.isArray(inner) ? inner : []);
        const total = inner?.totalPages ?? inner?.meta?.totalPages ?? res?.totalPages ?? null;
        const count = inner?.count ?? inner?.total ?? inner?.totalCount ?? res?.count ?? null;
        const limit = inner?.limit ?? inner?.perPage ?? res?.limit ?? 10;

        state.subAdmins = Array.isArray(data) ? data : [];
        state.subAdminsTotalPages = (count != null ? Math.ceil(count / limit) : total) || 1;
      })
      .addCase(fetchAllSubAdmins.rejected, rejected)

      .addCase(addSubAdmin.pending, pending)
      .addCase(addSubAdmin.fulfilled, (state) => { state.loading = false; })
      .addCase(addSubAdmin.rejected, rejected)

      .addCase(updateSubAdmin.pending, pending)
      .addCase(updateSubAdmin.fulfilled, (state) => { state.loading = false; })
      .addCase(updateSubAdmin.rejected, rejected)

      .addCase(deleteSubAdmin.pending, pending)
      .addCase(deleteSubAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.subAdmins = state.subAdmins.filter((a) => a.id !== action.payload);
      })
      .addCase(deleteSubAdmin.rejected, rejected)

      .addCase(blockUser.pending, pending)
      .addCase(blockUser.fulfilled, (state) => { state.loading = false; })
      .addCase(blockUser.rejected, rejected)

      .addCase(fetchSetting.pending, pending)
      .addCase(fetchSetting.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload?.payload || action.payload?.data || action.payload || {};
        state.setting = Array.isArray(payload?.data) ? payload.data[0] : (payload?.data || payload);
      })
      .addCase(fetchSetting.rejected, rejected)

      .addCase(updateSetting.pending, pending)
      .addCase(updateSetting.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload?.payload || action.payload?.data || action.payload || {};
        const updated = payload?.data || payload;
        if (updated) state.setting = updated;
      })
      .addCase(updateSetting.rejected, rejected)

      .addCase(createPopup.pending, pending)
      .addCase(createPopup.fulfilled, (state) => { state.loading = false; })
      .addCase(createPopup.rejected, rejected)
      
      .addCase(createNotification.pending, pending)
      .addCase(createNotification.fulfilled, (state) => { state.loading = false; })
      .addCase(createNotification.rejected, rejected)


      .addCase(fetchPopup.pending, pending)
      .addCase(fetchPopup.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload?.payload || action.payload?.data || action.payload || {};
        state.popup = payload?.data || payload;
      })
      .addCase(fetchPopup.rejected, rejected)

      .addCase(fetchAllContactUs.pending, pending)
      .addCase(fetchAllContactUs.fulfilled, (state, action) => {
        state.loading = false;
        const res = action.payload;
        const inner = res?.payload ?? res?.data ?? res;
        const data = inner?.data ?? (Array.isArray(inner) ? inner : []);
        const total = inner?.totalPages ?? inner?.meta?.totalPages ?? res?.totalPages ?? null;
        const count = inner?.count ?? inner?.total ?? inner?.totalCount ?? res?.count ?? null;
        const limit = inner?.limit ?? inner?.perPage ?? res?.limit ?? 10;

        state.contactUs = Array.isArray(data) ? data : [];
        state.contactUsTotalPages = (count != null ? Math.ceil(count / limit) : total) || 1;
      })
      .addCase(fetchAllContactUs.rejected, rejected)

      .addCase(fetchAdminIbIncome.pending, pending)
      .addCase(fetchAdminIbIncome.fulfilled, (state, action) => {
        state.loading = false;
        const res = action.payload;
        const inner = res?.payload ?? res?.data ?? res;
        const data = inner?.data ?? (Array.isArray(inner) ? inner : []);
        const total = inner?.totalPages ?? inner?.meta?.totalPages ?? res?.totalPages ?? null;
        const count = inner?.count ?? inner?.total ?? inner?.totalCount ?? res?.count ?? null;
        const limit = inner?.limit ?? inner?.perPage ?? res?.limit ?? 10;

        state.ibIncome = Array.isArray(data) ? data : [];
        state.ibIncomeTotalPages = (count != null ? Math.ceil(count / limit) : total) || 1;
      })
      .addCase(fetchAdminIbIncome.rejected, rejected)

      .addCase(fetchAdminProfitSharing.pending, pending)
      .addCase(fetchAdminProfitSharing.fulfilled, (state, action) => {
        state.loading = false;
        const res = action.payload;
        const inner = res?.payload ?? res?.data ?? res;
        const data = inner?.data ?? (Array.isArray(inner) ? inner : []);
        const total = inner?.totalPages ?? inner?.meta?.totalPages ?? res?.totalPages ?? null;
        const count = inner?.count ?? inner?.total ?? inner?.totalCount ?? res?.count ?? null;
        const limit = inner?.limit ?? inner?.perPage ?? res?.limit ?? 10;

        state.profitSharing = Array.isArray(data) ? data : [];
        state.profitSharingTotalPages = (count != null ? Math.ceil(count / limit) : total) || 1;
      })
      .addCase(fetchAdminProfitSharing.rejected, rejected)

      .addCase(fetchIbClients.pending, (state) => {
        state.ibClientsLoading = true;
      })
      .addCase(fetchIbClients.fulfilled, (state, action) => {
        state.ibClientsLoading = false;
        const payload = action.payload?.payload || action.payload?.data || action.payload || {};
        state.ibClients = payload?.data || (Array.isArray(payload) ? payload : []);
      })
      .addCase(fetchIbClients.rejected, (state) => {
        state.ibClientsLoading = false;
      })

      .addCase(fetchTransactions.pending, pending)
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        const res = action.payload;
        const inner = res?.payload ?? res?.data ?? res;
        const data = inner?.data ?? (Array.isArray(inner) ? inner : []);
        const total = inner?.totalPages ?? inner?.meta?.totalPages ?? res?.totalPages ?? null;
        const count = inner?.count ?? inner?.total ?? inner?.totalCount ?? res?.count ?? null;
        const limit = inner?.limit ?? inner?.perPage ?? res?.limit ?? 10;

        state.transactions = Array.isArray(data) ? data : [];
        state.transactionsSummary = inner?.summary ?? null;
        state.transactionsTotalPages = (count != null ? Math.ceil(count / limit) : total) || 1;
      })
      .addCase(fetchTransactions.rejected, rejected)

      .addCase(fetchUserDashboardProfitLots.pending, pending)
      .addCase(fetchUserDashboardProfitLots.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardProfitLots = action.payload?.payload || {};
      })
      .addCase(fetchUserDashboardProfitLots.rejected, rejected)

      .addCase(fetchAdminDashboardStats.pending, pending)
      .addCase(fetchAdminDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardStats = action.payload?.payload || action.payload?.data || action.payload || null;
      })
      .addCase(fetchAdminDashboardStats.rejected, rejected)

      .addCase(fetchAdminProfitAndIbCommission.pending, pending)
      .addCase(fetchAdminProfitAndIbCommission.fulfilled, (state, action) => {
        state.loading = false;
        state.adminProfitAndIbCommission = action.payload?.payload || {};
      })
      .addCase(fetchAdminProfitAndIbCommission.rejected, rejected)
      
      .addCase(fetchAdminDashboardProfit.pending, pending)
      .addCase(fetchAdminDashboardProfit.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardProfit = action.payload?.payload || action.payload?.data || action.payload || null;
      })
      .addCase(fetchAdminDashboardProfit.rejected, rejected)

      // updateTransaction is already handled above in fetchWithdrawRequests section
      // .addCase(updateTransaction.pending, pending) ...
  },
});

export const { clearAdminState } = adminSlice.actions;
export default adminSlice.reducer;
