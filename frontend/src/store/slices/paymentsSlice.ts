import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';
import { Wallet, Transaction } from '../../types';

interface PaymentsState {
  wallet: Wallet | null;
  transactions: Transaction[];
  allTransactions: Transaction[];
  loading: boolean;
  error: string | null;
}

const initialState: PaymentsState = {
  wallet: null,
  transactions: [],
  allTransactions: [],
  loading: false,
  error: null,
};

export const fetchWallet = createAsyncThunk('payments/fetchWallet', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/payments/wallet');
    return res.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch wallet');
  }
});

export const fetchTransactions = createAsyncThunk(
  'payments/fetchTransactions',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/payments/transactions');
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch transactions');
    }
  }
);

export const fetchAllTransactions = createAsyncThunk(
  'payments/fetchAllTransactions',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/payments/admin/transactions');
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch all transactions');
    }
  }
);

export const initiatePayment = createAsyncThunk(
  'payments/initiate',
  async (
    data: { consultationId: string; amount: number; mockOutcome?: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.post('/payments/initiate', data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Payment failed');
    }
  }
);

export const triggerMockOutcome = createAsyncThunk(
  'payments/triggerMockOutcome',
  async ({ transactionId, outcome }: { transactionId: string; outcome: string }, { rejectWithValue }) => {
    try {
      const res = await api.post(`/payments/mock/${transactionId}/outcome`, { outcome });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to trigger outcome');
    }
  }
);

export const releaseEscrow = createAsyncThunk(
  'payments/releaseEscrow',
  async (transactionId: string, { rejectWithValue }) => {
    try {
      const res = await api.post(`/payments/${transactionId}/release`);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to release escrow');
    }
  }
);

export const refundEscrow = createAsyncThunk(
  'payments/refundEscrow',
  async (transactionId: string, { rejectWithValue }) => {
    try {
      const res = await api.post(`/payments/${transactionId}/refund`);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to refund escrow');
    }
  }
);

export const withdrawFunds = createAsyncThunk(
  'payments/withdraw',
  async (amount: number, { rejectWithValue }) => {
    try {
      const res = await api.post('/payments/withdraw', { amount });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Withdrawal failed');
    }
  }
);

export const resetWallets = createAsyncThunk(
  'payments/resetWallets',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.post('/payments/admin/reset-wallets');
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to reset wallets');
    }
  }
);

const paymentsSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    clearPaymentError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWallet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWallet.fulfilled, (state, action) => {
        state.loading = false;
        state.wallet = action.payload;
      })
      .addCase(fetchWallet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchAllTransactions.fulfilled, (state, action) => {
        state.allTransactions = action.payload;
      })
      .addCase(withdrawFunds.fulfilled, (state, action) => {
        state.wallet = action.payload.wallet;
        if (action.payload.transaction) {
          state.transactions.unshift(action.payload.transaction);
        }
      })
      .addCase(triggerMockOutcome.fulfilled, (state, action) => {
        const idx = state.allTransactions.findIndex((t) => t.id === action.payload.id);
        if (idx !== -1) state.allTransactions[idx] = action.payload;
      });
  },
});

export const { clearPaymentError } = paymentsSlice.actions;
export default paymentsSlice.reducer;
