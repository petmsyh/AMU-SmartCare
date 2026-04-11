import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';
import { Wallet, Transaction } from '../../types';

function asNumber(value: unknown): number {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return Number(value);
  if (value && typeof value === 'object' && 'toString' in value) {
    const parsed = Number(value.toString());
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function normalizeTransaction(transaction: Transaction): Transaction {
  return {
    ...transaction,
    amount: asNumber(transaction.amount),
  };
}

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
    const wallet = res.data.data;
    return wallet
      ? {
          ...wallet,
          balance: asNumber(wallet.balance),
        }
      : wallet;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.error || err.response?.data?.message || 'Failed to fetch wallet');
  }
});

export const fetchTransactions = createAsyncThunk(
  'payments/fetchTransactions',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/payments/transactions');
      return {
        ...res.data.data,
        transactions: (res.data.data?.transactions ?? []).map(normalizeTransaction),
      };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || err.response?.data?.message || 'Failed to fetch transactions');
    }
  }
);

export const fetchAllTransactions = createAsyncThunk(
  'payments/fetchAllTransactions',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/payments/admin/transactions');
      return {
        ...res.data.data,
        transactions: (res.data.data?.transactions ?? []).map(normalizeTransaction),
      };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || err.response?.data?.message || 'Failed to fetch all transactions');
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
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || err.response?.data?.message || 'Payment failed');
    }
  }
);

export const triggerMockOutcome = createAsyncThunk(
  'payments/triggerMockOutcome',
  async ({ transactionId, outcome }: { transactionId: string; outcome: string }, { rejectWithValue }) => {
    try {
      const res = await api.post(`/payments/mock/${transactionId}/outcome`, { outcome });
      return normalizeTransaction(res.data.data);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || err.response?.data?.message || 'Failed to trigger outcome');
    }
  }
);

export const releaseEscrow = createAsyncThunk(
  'payments/releaseEscrow',
  async (transactionId: string, { rejectWithValue }) => {
    try {
      const res = await api.post(`/payments/${transactionId}/release`);
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || err.response?.data?.message || 'Failed to release escrow');
    }
  }
);

export const refundEscrow = createAsyncThunk(
  'payments/refundEscrow',
  async (transactionId: string, { rejectWithValue }) => {
    try {
      const res = await api.post(`/payments/${transactionId}/refund`);
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || err.response?.data?.message || 'Failed to refund escrow');
    }
  }
);

export const withdrawFunds = createAsyncThunk(
  'payments/withdraw',
  async (amount: number, { rejectWithValue }) => {
    try {
      const res = await api.post('/payments/withdraw', { amount });
      return {
        ...res.data.data,
        wallet: res.data.data?.wallet
          ? {
              ...res.data.data.wallet,
              balance: asNumber(res.data.data.wallet.balance),
            }
          : res.data.data?.wallet,
        transaction: res.data.data?.transaction ? normalizeTransaction(res.data.data.transaction) : res.data.data?.transaction,
      };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || err.response?.data?.message || 'Withdrawal failed');
    }
  }
);

export const resetWallets = createAsyncThunk(
  'payments/resetWallets',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.post('/payments/admin/reset-wallets');
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || err.response?.data?.message || 'Failed to reset wallets');
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
        state.transactions = action.payload?.transactions ?? [];
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchAllTransactions.fulfilled, (state, action) => {
        state.allTransactions = action.payload?.transactions ?? [];
      })
      .addCase(withdrawFunds.fulfilled, (state, action) => {
        state.wallet = action.payload.wallet;
        if (action.payload.transaction) {
          state.transactions.unshift(action.payload.transaction);
        }
      })
      .addCase(triggerMockOutcome.fulfilled, (state, action) => {
        const idx = state.allTransactions.findIndex((t) => t.id === action.payload.id);
        if (idx !== -1) state.allTransactions[idx] = normalizeTransaction(action.payload);
      });
  },
});

export const { clearPaymentError } = paymentsSlice.actions;
export default paymentsSlice.reducer;
