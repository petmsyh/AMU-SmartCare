import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';
import { DoctorProfile } from '../../types';

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
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch doctors');
    }
  }
);

export const fetchDoctorById = createAsyncThunk(
  'doctors/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await api.get(`/doctors/${id}`);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch doctor');
    }
  }
);

export const fetchMyDoctorProfile = createAsyncThunk(
  'doctors/fetchMyProfile',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/doctors/me');
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch profile');
    }
  }
);

export const createDoctorProfile = createAsyncThunk(
  'doctors/createProfile',
  async (data: Partial<DoctorProfile>, { rejectWithValue }) => {
    try {
      const res = await api.post('/doctors', data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create profile');
    }
  }
);

export const updateDoctorProfile = createAsyncThunk(
  'doctors/updateProfile',
  async (data: Partial<DoctorProfile>, { rejectWithValue }) => {
    try {
      const res = await api.put('/doctors/me', data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update profile');
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
        state.list = action.payload;
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
        state.selected = action.payload;
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
        state.selected = action.payload;
      })
      .addCase(fetchMyDoctorProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createDoctorProfile.fulfilled, (state, action) => {
        state.selected = action.payload;
      })
      .addCase(updateDoctorProfile.fulfilled, (state, action) => {
        state.selected = action.payload;
      });
  },
});

export const { clearSelected } = doctorsSlice.actions;
export default doctorsSlice.reducer;
