import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import api from '@/service/api';
import {
  CREATE_BROKER,
  GET_ALL_BROKERS_ADMIN,
  UPDATE_BROKER,
  DELETE_BROKER,
  CREATE_TUTORIAL,
  GET_ALL_TUTORIALS,
  UPDATE_TUTORIAL,
  DELETE_TUTORIAL,
  UPLOAD_IMAGE,
  CREATE_SOCIAL_POOL,
  UPDATE_SOCIAL_POOL,
  GET_ALL_SOCIAL_POOL,
  DELETE_SOCIAL_POOL,
  GET_ALL_POOL_TRADES_HISTORY,
  CREATE_POOL_TRADE,
} from '@/service/url';

// ─── Brokers ────────────────────────────────────────────────────────────────

export const fetchBrokersAdmin = createAsyncThunk(
  'content/fetchBrokersAdmin',
  async ({ page = 1, limit = 12, search = '' } = {}, thunkApi) => {
    try {
      const params = new URLSearchParams({ page, limit });
      if (search) params.append('search', search);
      return await api.get(`${GET_ALL_BROKERS_ADMIN}?${params.toString()}`);
    } catch (error) {

      return thunkApi.rejectWithValue(error);
    }
  }
);

// generate a URL-safe slug from a name string
const toSlug = (str) =>
  str.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export const createBroker = createAsyncThunk(
  'content/createBroker',
  async ({ name, description, redirectURL, file }, thunkApi) => {
    try {
      // Step 1: upload image, get back URL
      const imgForm = new FormData();
      imgForm.append('image', file);
      const uploadRes = await api.post(UPLOAD_IMAGE, imgForm);
      const imageUrl = uploadRes?.payload;
      if (!imageUrl) throw new Error('Image upload failed: no URL returned.');

      // Step 2: create broker with JSON (slug auto-generated from name)
      const response = await api.post(CREATE_BROKER, {
        name,
        description,
        redirectURL,
        slug: toSlug(name),
        logo: imageUrl,
      });
      toast.success('Broker created.');
      return response;
    } catch (error) {

      return thunkApi.rejectWithValue(error);
    }
  }
);

export const updateBroker = createAsyncThunk(
  'content/updateBroker',
  async ({ id, file, original, ...fields }, thunkApi) => {
    try {
      const changed = {};

      // only include fields that actually changed vs original
      Object.entries(fields).forEach(([k, v]) => {
        if (v !== undefined && String(v) !== String(original?.[k] ?? '')) {
          changed[k] = v;
        }
      });

      // if name changed, regenerate slug
      if (changed.name) changed.slug = toSlug(changed.name);

      // if a new image file was provided, upload it first
      if (file) {
        const imgForm = new FormData();
        imgForm.append('image', file);
        const uploadRes = await api.post(UPLOAD_IMAGE, imgForm);
        const imageUrl = uploadRes?.payload;
        if (!imageUrl) throw new Error('Image upload failed: no URL returned.');
        changed.logo = imageUrl;
      }

      const response = await api.put(`${UPDATE_BROKER}?id=${id}`, changed);
      toast.success('Broker updated.');
      return response;
    } catch (error) {

      return thunkApi.rejectWithValue(error);
    }
  }
);

export const deleteBroker = createAsyncThunk(
  'content/deleteBroker',
  async (id, thunkApi) => {
    try {
      await api.delete(`${DELETE_BROKER}?id=${id}`);
      toast.success('Broker deleted.');
      return id;
    } catch (error) {

      return thunkApi.rejectWithValue(error);
    }
  }
);

// ─── Tutorials ───────────────────────────────────────────────────────────────

export const fetchTutorials = createAsyncThunk(
  'content/fetchTutorials',
  async ({ page = 1, limit = 12, search = '' } = {}, thunkApi) => {
    try {
      const params = new URLSearchParams({ page, limit });
      if (search) params.append('search', search);
      return await api.get(`${GET_ALL_TUTORIALS}?${params.toString()}`);
    } catch (error) {

      return thunkApi.rejectWithValue(error);
    }
  }
);

export const createTutorial = createAsyncThunk(
  'content/createTutorial',
  async ({ file, videoUrl, thumbnail, description }, thunkApi) => {
    try {
      let finalVideoUrl = videoUrl;
      // If file is provided but no videoUrl, upload first
      if (file && !finalVideoUrl) {
        const formData = new FormData();
        formData.append('image', file);
        const uploadRes = await api.post(UPLOAD_IMAGE, formData);
        finalVideoUrl = uploadRes?.payload;
      }
      if (!finalVideoUrl) throw new Error('Video upload failed: no URL provided.');

      const response = await api.post(CREATE_TUTORIAL, { videoUrl: finalVideoUrl, thumbnail, description });
      toast.success('Tutorial created.');
      return response;
    } catch (error) {

      return thunkApi.rejectWithValue(error);
    }
  }
);

export const updateTutorial = createAsyncThunk(
  'content/updateTutorial',
  async ({ id, file, videoUrl, original, ...fields }, thunkApi) => {
    try {
      const changed = {};
      Object.entries(fields).forEach(([k, v]) => {
        if (v !== undefined && v !== (original?.[k] ?? '')) changed[k] = v;
      });

      if (videoUrl && videoUrl !== (original?.videoUrl ?? '')) {
        changed.videoUrl = videoUrl;
      } else if (file) {
        const formData = new FormData();
        formData.append('image', file);
        const uploadRes = await api.post(UPLOAD_IMAGE, formData);
        const uploadedUrl = uploadRes?.payload;
        if (!uploadedUrl) throw new Error('Video upload failed: no URL returned.');
        changed.videoUrl = uploadedUrl;
      }

      const response = await api.put(`${UPDATE_TUTORIAL}?id=${id}`, changed);
      toast.success('Tutorial updated.');
      return response;
    } catch (error) {

      return thunkApi.rejectWithValue(error);
    }
  }
);

export const deleteTutorial = createAsyncThunk(
  'content/deleteTutorial',
  async (id, thunkApi) => {
    try {
      await api.delete(`${DELETE_TUTORIAL}?id=${id}`);
      toast.success('Tutorial deleted.');
      return id;
    } catch (error) {

      return thunkApi.rejectWithValue(error);
    }
  }
);

// ─── Social Pool ─────────────────────────────────────────────────────────────

export const fetchSocialPools = createAsyncThunk(
  'content/fetchSocialPools',
  async ({ page = 1, limit = 12, search = '' } = {}, thunkApi) => {
    try {
      const params = new URLSearchParams({ page, limit });
      if (search) params.append('search', search);
      return await api.get(`${GET_ALL_SOCIAL_POOL}?${params.toString()}`);
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const createSocialPool = createAsyncThunk(
  'content/createSocialPool',
  async (fields, thunkApi) => {
    try {
      const response = await api.post(CREATE_SOCIAL_POOL, fields);
      toast.success('Social pool created.');
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const updateSocialPool = createAsyncThunk(
  'content/updateSocialPool',
  async ({ id, ...fields }, thunkApi) => {
    try {
      const response = await api.put(`${UPDATE_SOCIAL_POOL}?id=${id}`, fields);
      toast.success('Social pool updated.');
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const deleteSocialPool = createAsyncThunk(
  'content/deleteSocialPool',
  async (id, thunkApi) => {
    try {
      await api.delete(`${DELETE_SOCIAL_POOL}?id=${id}`);
      toast.success('Social pool deleted.');
      return id;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

// ─── Pool Trades History ─────────────────────────────────────────────────────

export const fetchPoolTradesHistory = createAsyncThunk(
  'content/fetchPoolTradesHistory',
  async ({ page = 1, limit = 12, search = '' } = {}, thunkApi) => {
    try {
      const params = new URLSearchParams({ page, limit });
      if (search) params.append('search', search);
      return await api.get(`${GET_ALL_POOL_TRADES_HISTORY}?${params.toString()}`);
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const createPoolTrade = createAsyncThunk(
  'content/createPoolTrade',
  async (fields, thunkApi) => {
    try {
      const response = await api.post(CREATE_POOL_TRADE, fields);
      toast.success('Pool trade created.');
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const contentSlice = createSlice({
  name: 'content',
  initialState: {
    brokers: [],
    brokersTotalPages: 1,
    tutorials: [],
    tutorialsTotalPages: 1,
    socialPools: [],
    socialPoolsTotalPages: 1,
    poolTradesHistory: [],
    poolTradesHistoryTotalPages: 1,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    const pending = (state) => { state.loading = true; state.error = null; };
    const rejected = (state, action) => { state.loading = false; state.error = action.payload; };

    const listFulfilled = (listKey, pagesKey) => (state, action) => {
      state.loading = false;
      // API shape: { success, payload: { data: [...], count: N } }
      const root = action.payload?.payload ?? action.payload?.data ?? action.payload ?? {};
      const inner = root?.payload ?? root;
      state[listKey] = inner?.data ?? (Array.isArray(inner) ? inner : []);
      const count = inner?.count ?? inner?.total ?? inner?.totalCount ?? null;
      const total = inner?.totalPages ?? inner?.meta?.totalPages ?? null;
      const limit = inner?.limit ?? inner?.perPage ?? 12;
      state[pagesKey] = total ?? (count != null ? Math.ceil(count / limit) : 1);
    };

    builder
      .addCase(fetchBrokersAdmin.pending, pending)
      .addCase(fetchBrokersAdmin.fulfilled, listFulfilled('brokers', 'brokersTotalPages'))
      .addCase(fetchBrokersAdmin.rejected, rejected)

      .addCase(createBroker.pending, pending)
      .addCase(createBroker.fulfilled, (state) => { state.loading = false; })
      .addCase(createBroker.rejected, rejected)

      .addCase(updateBroker.pending, pending)
      .addCase(updateBroker.fulfilled, (state) => { state.loading = false; })
      .addCase(updateBroker.rejected, rejected)

      .addCase(deleteBroker.pending, pending)
      .addCase(deleteBroker.fulfilled, (state, action) => {
        state.loading = false;
        state.brokers = state.brokers.filter((b) => b.id !== action.payload);
      })
      .addCase(deleteBroker.rejected, rejected)

      .addCase(fetchTutorials.pending, pending)
      .addCase(fetchTutorials.fulfilled, listFulfilled('tutorials', 'tutorialsTotalPages'))
      .addCase(fetchTutorials.rejected, rejected)

      .addCase(createTutorial.pending, pending)
      .addCase(createTutorial.fulfilled, (state) => { state.loading = false; })
      .addCase(createTutorial.rejected, rejected)

      .addCase(updateTutorial.pending, pending)
      .addCase(updateTutorial.fulfilled, (state) => { state.loading = false; })
      .addCase(updateTutorial.rejected, rejected)

      .addCase(deleteTutorial.pending, pending)
      .addCase(deleteTutorial.fulfilled, (state, action) => {
        state.loading = false;
        state.tutorials = state.tutorials.filter((t) => t.id !== action.payload);
      })
      .addCase(deleteTutorial.rejected, rejected)

      .addCase(fetchSocialPools.pending, pending)
      .addCase(fetchSocialPools.fulfilled, listFulfilled('socialPools', 'socialPoolsTotalPages'))
      .addCase(fetchSocialPools.rejected, rejected)

      .addCase(createSocialPool.pending, pending)
      .addCase(createSocialPool.fulfilled, (state) => { state.loading = false; })
      .addCase(createSocialPool.rejected, rejected)

      .addCase(updateSocialPool.pending, pending)
      .addCase(updateSocialPool.fulfilled, (state) => { state.loading = false; })
      .addCase(updateSocialPool.rejected, rejected)

      .addCase(deleteSocialPool.pending, pending)
      .addCase(deleteSocialPool.fulfilled, (state, action) => {
        state.loading = false;
        state.socialPools = state.socialPools.filter((s) => s.id !== action.payload);
      })
      .addCase(deleteSocialPool.rejected, rejected)

      .addCase(fetchPoolTradesHistory.pending, pending)
      .addCase(fetchPoolTradesHistory.fulfilled, listFulfilled('poolTradesHistory', 'poolTradesHistoryTotalPages'))
      .addCase(fetchPoolTradesHistory.rejected, rejected)

      .addCase(createPoolTrade.pending, pending)
      .addCase(createPoolTrade.fulfilled, (state) => { state.loading = false; })
      .addCase(createPoolTrade.rejected, rejected);
  },
});

export default contentSlice.reducer;
