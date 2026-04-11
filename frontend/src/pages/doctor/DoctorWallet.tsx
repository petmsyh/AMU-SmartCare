import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchWallet, fetchTransactions, withdrawFunds } from '../../store/slices/paymentsSlice';

const typeColorClasses: Record<string, string> = {
  payment: 'text-success-500',
  escrow_hold: 'text-primary-500',
  escrow_release: 'text-primary-900',
  refund: 'text-danger-500',
  withdrawal: 'text-orange-700',
  commission: 'text-purple-700',
};

const DoctorWallet: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { wallet, transactions, loading, error } = useSelector((state: RootState) => state.payments);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawError, setWithdrawError] = useState('');
  const [withdrawSuccess, setWithdrawSuccess] = useState('');
  const [withdrawing, setWithdrawing] = useState(false);
  const balanceValue = Number(wallet?.balance ?? 0);
  const formattedBalance = Number.isFinite(balanceValue) ? balanceValue.toFixed(2) : '0.00';
  const formatAmount = (value: unknown) => {
    const numericValue = Number(value ?? 0);
    return Number.isFinite(numericValue) ? numericValue.toFixed(2) : '0.00';
  };

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
    if (wallet && amount > Number(wallet.balance ?? 0)) {
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

  return (
    <div className="max-w-[700px]">
      <h2 className="mb-5 text-[22px] font-semibold">My Wallet</h2>

      <div className="bg-gradient-to-br from-primary-500 to-primary-900 rounded-xl px-7 py-6 text-white mb-5">
        <div className="text-[13px] opacity-80 mb-1">Available Balance</div>
        <div className="text-[36px] font-bold">
          {loading ? '…' : `₹${formattedBalance}`}
        </div>
      </div>

      <div className="card mb-5">
        <h3 className="mt-0 mb-4 text-base font-semibold">Withdraw Funds</h3>
        <form onSubmit={handleWithdraw} className="flex gap-2.5 items-end">
          <div className="flex-1">
            <label className="form-label text-xs">Amount (₹)</label>
            <input
              type="number"
              min="1"
              step="0.01"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              placeholder="Enter amount"
              className="form-input mb-0"
            />
          </div>
          <button
            type="submit"
            disabled={withdrawing}
            className={`btn bg-success-500 text-white border-0 font-semibold whitespace-nowrap ${withdrawing ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {withdrawing ? 'Processing…' : 'Withdraw'}
          </button>
        </form>
        {withdrawError && (
          <div className="bg-danger-100 text-danger-700 px-2.5 py-1.5 rounded mt-2.5 text-[13px]">
            {withdrawError}
          </div>
        )}
        {withdrawSuccess && (
          <div className="bg-success-100 text-success-700 px-2.5 py-1.5 rounded mt-2.5 text-[13px]">
            ✅ {withdrawSuccess}
          </div>
        )}
        {error && (
          <div className="bg-danger-100 text-danger-700 px-2.5 py-1.5 rounded mt-2.5 text-[13px]">
            {error}
          </div>
        )}
      </div>

      <div className="card">
        <h3 className="mt-0 mb-4 text-base font-semibold">Transaction History</h3>
        {loading && <p className="text-gray-500 text-[13px]">Loading transactions…</p>}
        {transactions.length === 0 && !loading && (
          <p className="text-gray-500 text-[13px]">No transactions yet.</p>
        )}
        <div className="flex flex-col gap-2">
          {transactions.map((tx) => {
            const typeClass = typeColorClasses[tx.type] ?? 'text-gray-800';
            const isCredit = ['payment', 'escrow_release'].includes(tx.type);
            return (
              <div
                key={tx.id}
                className="flex items-center justify-between py-2.5 border-b border-gray-100"
              >
                <div>
                  <div className={`font-semibold text-[13px] ${typeClass}`}>
                    {tx.type.replace('_', ' ').toUpperCase()}
                  </div>
                  <div className="text-[11px] text-gray-500 mt-0.5">
                    {tx.description || '—'} &bull; {new Date(tx.createdAt).toLocaleString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-bold text-sm ${isCredit ? 'text-success-500' : 'text-danger-500'}`}>
                    {isCredit ? '+' : '-'}₹{formatAmount(tx.amount)}
                  </div>
                  <div className="text-[11px] text-gray-400">{tx.status}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DoctorWallet;
