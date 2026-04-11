import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';
import { Consultation, Message } from '../../types';

interface ConsultationsState {
  list: Consultation[];
  selected: Consultation | null;
  messages: Message[];
  loading: boolean;
  error: string | null;
}

const initialState: ConsultationsState = {
  list: [],
  selected: null,
  messages: [],
  loading: false,
  error: null,
};

export const fetchMyConsultations = createAsyncThunk(
  'consultations/fetchMine',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/consultations');
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch consultations');
    }
  }
);

export const fetchConsultationById = createAsyncThunk(
  'consultations/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await api.get(`/consultations/${id}`);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch consultation');
    }
  }
);

export const createConsultation = createAsyncThunk(
  'consultations/create',
  async (data: { doctorId: string; scheduledAt?: string; notes?: string }, { rejectWithValue }) => {
    try {
      const res = await api.post('/consultations', data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create consultation');
    }
  }
);

export const updateConsultationStatus = createAsyncThunk(
  'consultations/updateStatus',
  async ({ id, status }: { id: string; status: string }, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/consultations/${id}/status`, { status });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update status');
    }
  }
);

export const confirmConsultation = createAsyncThunk(
  'consultations/confirm',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await api.post(`/consultations/${id}/confirm`);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to confirm consultation');
    }
  }
);

export const fetchMessages = createAsyncThunk(
  'consultations/fetchMessages',
  async (consultationId: string, { rejectWithValue }) => {
    try {
      const res = await api.get(`/consultations/${consultationId}/messages`);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch messages');
    }
  }
);

export const sendMessage = createAsyncThunk(
  'consultations/sendMessage',
  async ({ consultationId, content }: { consultationId: string; content: string }, { rejectWithValue }) => {
    try {
      const res = await api.post(`/consultations/${consultationId}/messages`, { content });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to send message');
    }
  }
);

export const rateDoctor = createAsyncThunk(
  'consultations/rateDoctor',
  async (
    { doctorId, consultationId, score, comment }: { doctorId: string; consultationId: string; score: number; comment?: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.post('/ratings', { doctorId, consultationId, score, comment });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to submit rating');
    }
  }
);

const consultationsSlice = createSlice({
  name: 'consultations',
  initialState,
  reducers: {
    clearSelected(state) {
      state.selected = null;
      state.messages = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyConsultations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyConsultations.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchMyConsultations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchConsultationById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConsultationById.fulfilled, (state, action) => {
        state.loading = false;
        state.selected = action.payload;
      })
      .addCase(fetchConsultationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateConsultationStatus.fulfilled, (state, action) => {
        state.selected = action.payload;
        const idx = state.list.findIndex((c) => c.id === action.payload.id);
        if (idx !== -1) state.list[idx] = action.payload;
      })
      .addCase(confirmConsultation.fulfilled, (state, action) => {
        state.selected = action.payload;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.messages = action.payload;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.messages.push(action.payload);
      });
  },
});

export const { clearSelected } = consultationsSlice.actions;
export default consultationsSlice.reducer;
