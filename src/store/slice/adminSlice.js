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
  async ({ search = '', userId } = {}, thunkApi) => {
    try {
      const params = new URLSearchParams();
      if (userId) params.append('userId', userId);
      if (search)  params.append('search', search);
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
      const response = await api.put(`${UPDATE_IB_REQUEST}?id=${id}`, { status });
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
  async ({ search = '' } = {}, thunkApi) => {
    try {
      const url = search
        ? `${GET_ALL_WITHDRAW_REQUESTS}?search=${encodeURIComponent(search)}`
        : GET_ALL_WITHDRAW_REQUESTS;
      return await api.get(url);
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
  async ({ search = '' } = {}, thunkApi) => {
    try {
      const url = search
        ? `${GET_ALL_KYC_DOCUMENTS}?search=${encodeURIComponent(search)}`
        : GET_ALL_KYC_DOCUMENTS;
      return await api.get(url);
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

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    users: [],
    ibRequests: [],
    kycDocuments: [],
    withdrawRequests: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearAdminState: (state) => {
      state.users = [];
      state.ibRequests = [];
      state.kycDocuments = [];
      state.withdrawRequests = [];
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
        state.users = action.payload?.payload?.data || action.payload?.data || action.payload || [];
      })
      .addCase(fetchAllUsers.rejected, rejected)

      .addCase(fetchIbRequests.pending, pending)
      .addCase(fetchIbRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.ibRequests = action.payload?.payload?.data || action.payload?.data || action.payload || [];
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
        state.kycDocuments = action.payload?.payload?.data || action.payload?.data || action.payload || [];
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
        state.withdrawRequests = action.payload?.payload?.data || action.payload?.data || action.payload || [];
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

      .addCase(blockUser.pending, pending)
      .addCase(blockUser.fulfilled, (state) => { state.loading = false; })
      .addCase(blockUser.rejected, rejected);
  },
});

export const { clearAdminState } = adminSlice.actions;
export default adminSlice.reducer;
