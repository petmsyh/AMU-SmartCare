import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchWallet, fetchTransactions, withdrawFunds } from '../../store/slices/paymentsSlice';

const DoctorWallet: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { wallet, transactions, loading, error } = useSelector((state: RootState) => state.payments);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawError, setWithdrawError] = useState('');
  const [withdrawSuccess, setWithdrawSuccess] = useState('');
  const [withdrawing, setWithdrawing] = useState(false);

  useEffect(() => {
    dispatch(fetchWallet());
    dispatch(fetchTransactions());
  }, [dispatch]);

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawError('');
    setWithdrawSuccess('');
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      setWithdrawError('Enter a valid amount');
      return;
    }
    if (wallet && amount > wallet.balance) {
      setWithdrawError('Insufficient balance');
      return;
    }
    setWithdrawing(true);
    const result = await dispatch(withdrawFunds(amount));
    setWithdrawing(false);
    if (withdrawFunds.fulfilled.match(result)) {
      setWithdrawSuccess(`₹${amount} withdrawn successfully`);
      setWithdrawAmount('');
      dispatch(fetchWallet());
      dispatch(fetchTransactions());
    } else {
      setWithdrawError((result.payload as string) || 'Withdrawal failed');
    }
  };

  const typeColors: Record<string, string> = {
    payment: '#34a853',
    escrow_hold: '#1a73e8',
    escrow_release: '#0d47a1',
    refund: '#ea4335',
    withdrawal: '#e65100',
    commission: '#6a1b9a',
  };

  return (
    <div style={{ maxWidth: 700 }}>
      <h2 style={{ margin: '0 0 20px', fontSize: 22 }}>My Wallet</h2>

      <div
        style={{
          background: 'linear-gradient(135deg, #1a73e8, #0d47a1)',
          borderRadius: 12,
          padding: '24px 28px',
          color: '#fff',
          marginBottom: 20,
        }}
      >
        <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 4 }}>Available Balance</div>
        <div style={{ fontSize: 36, fontWeight: 700 }}>
          {loading ? '…' : `₹${wallet?.balance?.toFixed(2) || '0.00'}`}
        </div>
      </div>

      <div
        style={{
          background: '#fff',
          border: '1px solid #e0e0e0',
          borderRadius: 10,
          padding: 24,
          marginBottom: 20,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        }}
      >
        <h3 style={{ margin: '0 0 16px', fontSize: 16 }}>Withdraw Funds</h3>
        <form onSubmit={handleWithdraw} style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>
              Amount (₹)
            </label>
            <input
              type="number"
              min="1"
              step="0.01"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              placeholder="Enter amount"
              style={{ width: '100%', padding: '9px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14 }}
            />
          </div>
          <button
            type="submit"
            disabled={withdrawing}
            style={{
              padding: '9px 20px',
              background: '#34a853',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              cursor: withdrawing ? 'not-allowed' : 'pointer',
              fontWeight: 600,
              fontSize: 14,
              opacity: withdrawing ? 0.7 : 1,
              whiteSpace: 'nowrap',
            }}
          >
            {withdrawing ? 'Processing…' : 'Withdraw'}
          </button>
        </form>
        {withdrawError && (
          <div style={{ background: '#fce8e6', color: '#c5221f', padding: '6px 10px', borderRadius: 4, marginTop: 10, fontSize: 13 }}>
            {withdrawError}
          </div>
        )}
        {withdrawSuccess && (
          <div style={{ background: '#e8f5e9', color: '#2e7d32', padding: '6px 10px', borderRadius: 4, marginTop: 10, fontSize: 13 }}>
            ✅ {withdrawSuccess}
          </div>
        )}
        {error && (
          <div style={{ background: '#fce8e6', color: '#c5221f', padding: '6px 10px', borderRadius: 4, marginTop: 10, fontSize: 13 }}>
            {error}
          </div>
        )}
      </div>

      <div
        style={{
          background: '#fff',
          border: '1px solid #e0e0e0',
          borderRadius: 10,
          padding: 24,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        }}
      >
        <h3 style={{ margin: '0 0 16px', fontSize: 16 }}>Transaction History</h3>
        {loading && <p style={{ color: '#666', fontSize: 13 }}>Loading transactions…</p>}
        {transactions.length === 0 && !loading && (
          <p style={{ color: '#666', fontSize: 13 }}>No transactions yet.</p>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {transactions.map((tx) => (
            <div
              key={tx.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 0',
                borderBottom: '1px solid #f0f0f0',
              }}
            >
              <div>
                <div style={{ fontWeight: 600, fontSize: 13, color: typeColors[tx.type] || '#333' }}>
                  {tx.type.replace('_', ' ').toUpperCase()}
                </div>
                <div style={{ fontSize: 11, color: '#666', marginTop: 2 }}>
                  {tx.description || '—'} &bull; {new Date(tx.createdAt).toLocaleString()}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 14,
                    color: ['payment', 'escrow_release'].includes(tx.type) ? '#34a853' : '#ea4335',
                  }}
                >
                  {['payment', 'escrow_release'].includes(tx.type) ? '+' : '-'}₹{tx.amount.toFixed(2)}
                </div>
                <div style={{ fontSize: 11, color: '#888' }}>{tx.status}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DoctorWallet;
