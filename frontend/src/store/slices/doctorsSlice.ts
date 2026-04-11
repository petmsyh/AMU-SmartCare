import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';
import { DoctorProfile } from '../../types';

function asNumber(value: unknown): number {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return Number(value);
  if (value && typeof value === 'object' && 'toString' in value) {
    const parsed = Number(value.toString());
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function normalizeDoctor(doctor: DoctorProfile): DoctorProfile {
  return {
    ...doctor,
    consultationFee: asNumber(doctor.consultationFee),
    averageRating: asNumber(doctor.averageRating),
  };
}

interface DoctorsState {
  list: DoctorProfile[];
  selected: DoctorProfile | null;
  loading: boolean;
  error: string | null;
}

const initialState: DoctorsState = {
  list: [],
  selected: null,
  loading: false,
  error: null,
};

export const fetchDoctors = createAsyncThunk(
  'doctors/fetchAll',
  async (params: { specialty?: string; name?: string } = {}, { rejectWithValue }) => {
    try {
      const res = await api.get('/doctors', { params });
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || err.response?.data?.message || 'Failed to fetch doctors');
    }
  }
);

export const fetchDoctorById = createAsyncThunk(
  'doctors/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await api.get(`/doctors/${id}`);
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || err.response?.data?.message || 'Failed to fetch doctor');
    }
  }
);

export const fetchMyDoctorProfile = createAsyncThunk(
  'doctors/fetchMyProfile',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { auth?: { user?: { id?: string } } };
      const currentUserId = state.auth?.user?.id;

      // Use list endpoint for compatibility with older backends where /doctors/profile or /doctors/me
      // are interpreted as /doctors/:id and return 404.
      const res = await api.get('/doctors', { params: { page: 1, limit: 200 } });
      const doctors = res.data.data?.doctors ?? [];

      if (!currentUserId) return null;
      const myProfile = doctors.find((d: DoctorProfile & { user?: { id?: string } }) =>
        d.userId === currentUserId || d.user?.id === currentUserId
      );

      return myProfile ?? null;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || err.response?.data?.message || 'Failed to fetch profile');
    }
  }
);

export const createDoctorProfile = createAsyncThunk(
  'doctors/createProfile',
  async (data: Partial<DoctorProfile>, { rejectWithValue }) => {
    try {
      try {
        const res = await api.post('/doctors/profile', data);
        return res.data.data;
      } catch (err: any) {
        if (err.response?.status === 404) {
          const fallback = await api.post('/doctors', data);
          return fallback.data.data ?? fallback.data;
        }
        throw err;
      }
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || err.response?.data?.message || 'Failed to create profile');
    }
  }
);

export const updateDoctorProfile = createAsyncThunk(
  'doctors/updateProfile',
  async (data: Partial<DoctorProfile>, { rejectWithValue }) => {
    try {
      try {
        const res = await api.patch('/doctors/profile', data);
        return res.data.data;
      } catch (err: any) {
        if (err.response?.status === 404) {
          const fallback = await api.put('/doctors/me', data);
          return fallback.data.data ?? fallback.data;
        }
        throw err;
      }
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || err.response?.data?.message || 'Failed to update profile');
    }
  }
);

const doctorsSlice = createSlice({
  name: 'doctors',
  initialState,
  reducers: {
    clearSelected(state) {
      state.selected = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDoctors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDoctors.fulfilled, (state, action) => {
        state.loading = false;
        state.list = (action.payload?.doctors ?? []).map(normalizeDoctor);
      })
      .addCase(fetchDoctors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchDoctorById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDoctorById.fulfilled, (state, action) => {
        state.loading = false;
        state.selected = action.payload ? normalizeDoctor(action.payload) : null;
      })
      .addCase(fetchDoctorById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchMyDoctorProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyDoctorProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.selected = action.payload ? normalizeDoctor(action.payload) : null;
      })
      .addCase(fetchMyDoctorProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createDoctorProfile.fulfilled, (state, action) => {
        state.selected = action.payload ? normalizeDoctor(action.payload) : null;
      })
      .addCase(updateDoctorProfile.fulfilled, (state, action) => {
        state.selected = action.payload ? normalizeDoctor(action.payload) : null;
      });
  },
});

export const { clearSelected } = doctorsSlice.actions;
export default doctorsSlice.reducer;
