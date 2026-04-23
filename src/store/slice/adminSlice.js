import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import api from '@/service/api';
import {
  GET_ALL_USERS,
  GET_ALL_IB_REQUESTS,
  UPDATE_IB_REQUEST,
  GET_ALL_KYC_DOCUMENTS,
  UPDATE_KYC_DOCUMENT,
  GET_ALL_WITHDRAW_REQUESTS,
  UPDATE_WITHDRAW_REQUEST,
  BLOCK_USER,
  ADD_SUB_ADMIN,
  GET_ALL_SUB_ADMINS,
  CREATE_NOTIFICATION,
  GET_SETTING,
  UPDATE_SETTING,
} from '@/service/url';

export const fetchAllUsers = createAsyncThunk(
  'admin/fetchAllUsers',
  async (filters = {}, thunkApi) => {
    try {
      const params = new URLSearchParams();
      if (filters.search)    params.append('search', filters.search);
      if (filters.dateFrom)  params.append('startDate', filters.dateFrom);
      if (filters.dateTo)    params.append('endDate', filters.dateTo);
      if (filters.profitMin !== '' && filters.profitMin != null) params.append('profitMin', filters.profitMin);
      if (filters.profitMax !== '' && filters.profitMax != null) params.append('profitMax', filters.profitMax);
      if (filters.depositMin !== '' && filters.depositMin != null) params.append('depositMin', filters.depositMin);
      if (filters.depositMax !== '' && filters.depositMax != null) params.append('depositMax', filters.depositMax);
      if (filters.ibUser)  params.append('isIbUser', filters.ibUser === 'yes');
      if (filters.status)  params.append('isActive', filters.status === 'active');
      if (filters.page)    params.append('page', filters.page);
      if (filters.limit)   params.append('limit', filters.limit);
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
      if (userId)   params.append('userId', userId);
      if (search)   params.append('search', search);
      if (dateFrom) params.append('startDate', dateFrom);
      if (dateTo)   params.append('endDate', dateTo);
      if (status)   params.append('status', status);
      if (page)     params.append('page', page);
      if (limit)    params.append('limit', limit);
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
      if (search)        params.append('search', encodeURIComponent(search));
      if (dateFrom)      params.append('startDate', dateFrom);
      if (dateTo)        params.append('endDate', dateTo);
      if (status)        params.append('status', status);
      if (withdrawalMin !== '' && withdrawalMin != null) params.append('amountMin', withdrawalMin);
      if (withdrawalMax !== '' && withdrawalMax != null) params.append('amountMax', withdrawalMax);
      if (page)          params.append('page', page);
      if (limit)         params.append('limit', limit);
      const query = params.toString();
      return await api.get(query ? `${GET_ALL_WITHDRAW_REQUESTS}?${query}` : GET_ALL_WITHDRAW_REQUESTS);
    } catch (error) {
      toast.error(error);
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const updateWithdrawRequest = createAsyncThunk(
  'admin/updateWithdrawRequest',
  async ({ id, status }, thunkApi) => {
    try {
      const response = await api.put(`${UPDATE_WITHDRAW_REQUEST}?id=${id}`, { status });
      toast.success('Withdraw request updated.');
      return response;
    } catch (error) {
      toast.error(error);
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const fetchAllKycDocuments = createAsyncThunk(
  'admin/fetchAllKycDocuments',
  async ({ search = '', page, limit, dateFrom, dateTo, status } = {}, thunkApi) => {
    try {
      const params = new URLSearchParams();
      if (search)   params.append('search', encodeURIComponent(search));
      if (dateFrom) params.append('startDate', dateFrom);
      if (dateTo)   params.append('endDate', dateTo);
      if (status)   params.append('status', status);
      if (page)     params.append('page', page);
      if (limit)    params.append('limit', limit);
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
  async ({ page, limit } = {}, thunkApi) => {
    try {
      const params = new URLSearchParams();
      if (page)  params.append('page', page);
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
    setting: null,
    loading: false,
    error: null,
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

      .addCase(updateWithdrawRequest.pending, pending)
      .addCase(updateWithdrawRequest.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload?.payload?.data || action.payload?.data || action.payload;
        if (updated?.id) {
          state.withdrawRequests = state.withdrawRequests.map((r) => r.id === updated.id ? updated : r);
        }
      })
      .addCase(updateWithdrawRequest.rejected, rejected)

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
      .addCase(updateSetting.rejected, rejected);
  },
});

export const { clearAdminState } = adminSlice.actions;
export default adminSlice.reducer;
