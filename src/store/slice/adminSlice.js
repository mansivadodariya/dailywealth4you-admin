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
} from '@/service/url';

export const fetchAllUsers = createAsyncThunk(
  'admin/fetchAllUsers',
  async (filters = {}, thunkApi) => {
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.dateFrom) params.append('startDate', filters.dateFrom);
      if (filters.dateTo) params.append('endDate', filters.dateTo);
      if (filters.profitMin !== '' && filters.profitMin != null) params.append('profitMin', filters.profitMin);
      if (filters.profitMax !== '' && filters.profitMax != null) params.append('profitMax', filters.profitMax);
      if (filters.depositMin !== '' && filters.depositMin != null) params.append('depositMin', filters.depositMin);
      if (filters.depositMax !== '' && filters.depositMax != null) params.append('depositMax', filters.depositMax);
      if (filters.ibUser) params.append('isIbUser', filters.ibUser === 'yes');
      if (filters.status) params.append('isActive', filters.status === 'active');
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);
      const query = params.toString();
      return await api.get(query ? `${GET_ALL_USERS}?${query}` : GET_ALL_USERS);
    } catch (error) {
      toast.error(error);
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
      if (limit) params.append('limit', limit);
      const query = params.toString();
      return await api.get(query ? `${GET_ALL_IB_REQUESTS}?${query}` : GET_ALL_IB_REQUESTS);
    } catch (error) {
      toast.error(error);
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
      toast.error(error);
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
      if (limit) params.append('limit', limit);
      return await api.get(`${GET_ALL_TRANSACTIONS}?${params.toString()}`);
    } catch (error) {
      toast.error(error);
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
      if (limit) params.append('limit', limit);
      const query = params.toString();
      return await api.get(query ? `${GET_ALL_KYC_DOCUMENTS}?${query}` : GET_ALL_KYC_DOCUMENTS);
    } catch (error) {
      toast.error(error);
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
      if (limit) params.append('limit', limit);
      const query = params.toString();
      return await api.get(query ? `${GET_ALL_SUB_ADMINS}?${query}` : GET_ALL_SUB_ADMINS);
    } catch (error) {
      toast.error(error);
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
      toast.error(error);
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
      toast.error(error);
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
      toast.error(error);
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const blockUser = createAsyncThunk(
  'admin/blockUser',
  async (userId, thunkApi) => {
    try {
      const response = await api.put(`${BLOCK_USER}?id=${userId}`);
      toast.success('User blocked.');
      return response;
    } catch (error) {
      toast.error(error);
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
      toast.error(error);
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
      toast.error(error);
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
      toast.error(typeof error === 'string' ? error : error?.message || 'Something went wrong.');
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
      toast.error(error);
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
      toast.error(error);
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
      toast.error(error);
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
      if (limit) params.append('limit', limit);
      const query = params.toString();
      return await api.get(query ? `${GET_ALL_CONTACT_US}?${query}` : GET_ALL_CONTACT_US);
    } catch (error) {
      toast.error(error);
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
      if (limit) params.append('limit', limit);
      const query = params.toString();
      return await api.get(query ? `${GET_ADMIN_IB_INCOME}?${query}` : GET_ADMIN_IB_INCOME);
    } catch (error) {
      toast.error(error);
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
      if (limit) params.append('limit', limit);
      const query = params.toString();
      return await api.get(query ? `${GET_ADMIN_PROFIT_SHARING}?${query}` : GET_ADMIN_PROFIT_SHARING);
    } catch (error) {
      toast.error(error);
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
      toast.error(error);
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const fetchTransactions = createAsyncThunk(
  'admin/fetchTransactions',
  async ({ type = 'deposit', search = '', page, limit } = {}, thunkApi) => {
    try {
      const params = new URLSearchParams();
      params.append('type', type);
      if (search) params.append('search', search);
      if (page) params.append('page', page);
      if (limit) params.append('limit', limit);
      return await api.get(`${GET_ALL_TRANSACTIONS}?${params.toString()}`);
    } catch (error) {
      toast.error(error);
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
      toast.error(error);
      return thunkApi.rejectWithValue(error);
    }
  }
);


const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    subAdmins: [],
    subAdminsTotalPages: 1,
    users: [],
    usersTotalPages: 1,
    ibRequests: [],
    ibRequestsTotalPages: 1,
    kycDocuments: [],
    kycDocumentsTotalPages: 1,
    withdrawRequests: [],
    withdrawRequestsTotalPages: 1,
    ibClients: [],
    ibClientsLoading: false,
    contactUs: [],
    contactUsTotalPages: 1,
    ibIncome: [],
    ibIncomeTotalPages: 1,
    profitSharing: [],
    profitSharingTotalPages: 1,
    setting: null,
    popup: null,
    loading: false,
    error: null,
    transactions: [],
    transactionsTotalPages: 1,
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
        const payload = action.payload?.payload || action.payload?.data || action.payload || {};
        state.users = payload?.data || (Array.isArray(payload) ? payload : []);
        const total = payload?.totalPages ?? payload?.meta?.totalPages ?? null;
        const count = payload?.count ?? payload?.total ?? payload?.totalCount ?? null;
        const limit = payload?.limit ?? payload?.perPage ?? 10;
        state.usersTotalPages = total ?? (count != null ? Math.ceil(count / limit) : 1);
      })
      .addCase(fetchAllUsers.rejected, rejected)

      .addCase(fetchIbRequests.pending, pending)
      .addCase(fetchIbRequests.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload?.payload || action.payload?.data || action.payload || {};
        state.ibRequests = payload?.data || (Array.isArray(payload) ? payload : []);
        const total = payload?.totalPages ?? payload?.meta?.totalPages ?? null;
        const count = payload?.count ?? payload?.total ?? payload?.totalCount ?? null;
        const limit = payload?.limit ?? payload?.perPage ?? 10;
        state.ibRequestsTotalPages = total ?? (count != null ? Math.ceil(count / limit) : 1);
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
        const payload = action.payload?.payload || action.payload?.data || action.payload || {};
        state.kycDocuments = payload?.data || (Array.isArray(payload) ? payload : []);
        const total = payload?.totalPages ?? payload?.meta?.totalPages ?? null;
        const count = payload?.count ?? payload?.total ?? payload?.totalCount ?? null;
        const limit = payload?.limit ?? payload?.perPage ?? 10;
        state.kycDocumentsTotalPages = total ?? (count != null ? Math.ceil(count / limit) : 1);
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
        const payload = action.payload?.payload || action.payload?.data || action.payload || {};
        state.withdrawRequests = payload?.data || (Array.isArray(payload) ? payload : []);
        const total = payload?.totalPages ?? payload?.meta?.totalPages ?? null;
        const count = payload?.count ?? payload?.total ?? payload?.totalCount ?? null;
        const limit = payload?.limit ?? payload?.perPage ?? 10;
        state.withdrawRequestsTotalPages = total ?? (count != null ? Math.ceil(count / limit) : 1);
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
        const payload = action.payload?.payload || action.payload?.data || action.payload || {};
        state.subAdmins = payload?.data || (Array.isArray(payload) ? payload : []);
        const total = payload?.totalPages ?? payload?.meta?.totalPages ?? null;
        const count = payload?.count ?? payload?.total ?? payload?.totalCount ?? null;
        const limit = payload?.limit ?? payload?.perPage ?? 10;
        state.subAdminsTotalPages = total ?? (count != null ? Math.ceil(count / limit) : 1);
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
        const payload = action.payload?.payload || action.payload?.data || action.payload || {};
        state.contactUs = payload?.data || (Array.isArray(payload) ? payload : []);
        const total = payload?.totalPages ?? payload?.meta?.totalPages ?? null;
        const count = payload?.count ?? payload?.total ?? payload?.totalCount ?? null;
        const limit = payload?.limit ?? payload?.perPage ?? 10;
        state.contactUsTotalPages = total ?? (count != null ? Math.ceil(count / limit) : 1);
      })
      .addCase(fetchAllContactUs.rejected, rejected)

      .addCase(fetchAdminIbIncome.pending, pending)
      .addCase(fetchAdminIbIncome.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload?.payload || action.payload?.data || action.payload || {};
        state.ibIncome = payload?.data || (Array.isArray(payload) ? payload : []);
        const total = payload?.totalPages ?? payload?.meta?.totalPages ?? null;
        const count = payload?.count ?? payload?.total ?? payload?.totalCount ?? null;
        const limit = payload?.limit ?? payload?.perPage ?? 10;
        state.ibIncomeTotalPages = total ?? (count != null ? Math.ceil(count / limit) : 1);
      })
      .addCase(fetchAdminIbIncome.rejected, rejected)

      .addCase(fetchAdminProfitSharing.pending, pending)
      .addCase(fetchAdminProfitSharing.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload?.payload || action.payload?.data || action.payload || {};
        state.profitSharing = payload?.data || (Array.isArray(payload) ? payload : []);
        const total = payload?.totalPages ?? payload?.meta?.totalPages ?? null;
        const count = payload?.count ?? payload?.total ?? payload?.totalCount ?? null;
        const limit = payload?.limit ?? payload?.perPage ?? 10;
        state.profitSharingTotalPages = total ?? (count != null ? Math.ceil(count / limit) : 1);
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
        const payload = action.payload?.payload || action.payload?.data || action.payload || {};
        state.transactions = payload?.data || (Array.isArray(payload) ? payload : []);
        const total = payload?.totalPages ?? payload?.meta?.totalPages ?? null;
        const count = payload?.count ?? payload?.total ?? payload?.totalCount ?? null;
        const limit = payload?.limit ?? payload?.perPage ?? 10;
        state.transactionsTotalPages = total ?? (count != null ? Math.ceil(count / limit) : 1);
      })
      .addCase(fetchTransactions.rejected, rejected)
      
      // updateTransaction is already handled above in fetchWithdrawRequests section
      // .addCase(updateTransaction.pending, pending) ...
  },
});

export const { clearAdminState } = adminSlice.actions;
export default adminSlice.reducer;
