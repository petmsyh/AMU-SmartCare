import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import {
  fetchAllTransactions,
  triggerMockOutcome,
  releaseEscrow,
  refundEscrow,
  resetWallets,
} from '../../store/slices/paymentsSlice';

const typeColorClasses: Record<string, string> = {
  payment: 'text-success-500',
  escrow_hold: 'text-primary-500',
  escrow_release: 'text-primary-900',
  refund: 'text-danger-500',
  withdrawal: 'text-orange-700',
  commission: 'text-purple-700',
};

const statusBadgeClasses: Record<string, string> = {
  pending: 'bg-orange-100 text-orange-700',
  completed: 'bg-success-100 text-success-700',
  failed: 'bg-danger-100 text-danger-700',
  refunded: 'bg-purple-100 text-purple-700',
};

const MockPaymentDashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { allTransactions, loading } = useSelector((state: RootState) => state.payments);
  const [actionMsg, setActionMsg] = useState('');
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    dispatch(fetchAllTransactions());
  }, [dispatch]);

  const showMsg = (msg: string) => {
    setActionMsg(msg);
    setTimeout(() => setActionMsg(''), 4000);
  };

  const handleOutcome = async (id: string, outcome: string) => {
    const result = await dispatch(triggerMockOutcome({ transactionId: id, outcome }));
    if (triggerMockOutcome.fulfilled.match(result)) {
      showMsg(`Outcome '${outcome}' triggered`);
      dispatch(fetchAllTransactions());
    } else {
      showMsg((result.payload as string) || 'Failed');
    }
  };

  const handleRelease = async (id: string) => {
    const result = await dispatch(releaseEscrow(id));
    if (releaseEscrow.fulfilled.match(result)) {
      showMsg('Escrow released');
      dispatch(fetchAllTransactions());
    }
  };

  const handleRefund = async (id: string) => {
    const result = await dispatch(refundEscrow(id));
    if (refundEscrow.fulfilled.match(result)) {
      showMsg('Escrow refunded');
      dispatch(fetchAllTransactions());
    }
  };

  const handleResetWallets = async () => {
    if (!window.confirm('Reset all wallets to zero? This cannot be undone.')) return;
    setResetting(true);
    const result = await dispatch(resetWallets());
    setResetting(false);
    if (resetWallets.fulfilled.match(result)) {
      showMsg('All wallets reset to zero');
      dispatch(fetchAllTransactions());
    } else {
      showMsg((result.payload as string) || 'Failed to reset wallets');
    }
  };

  const formatAmount = (value: unknown) => {
    const numericValue = Number(value ?? 0);
    return Number.isFinite(numericValue) ? numericValue.toFixed(2) : '0.00';
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="m-0 text-[22px] font-semibold">Mock Payment Dashboard</h2>
        <button
          onClick={handleResetWallets}
          disabled={resetting}
          className={`px-4 py-2 bg-red-800 text-white border-0 rounded-md cursor-pointer text-[13px] font-semibold
            ${resetting ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {resetting ? 'Resetting…' : '🔄 Reset All Wallets'}
        </button>
      </div>

      {actionMsg && (
        <div className="bg-success-100 text-success-700 px-3.5 py-2 rounded-md mb-3.5 text-[13px]">
          ✅ {actionMsg}
        </div>
      )}

      {loading && <p className="text-gray-500">Loading transactions…</p>}

      <div className="flex flex-col gap-2.5">
        {allTransactions.map((tx) => {
          const statusBadge = statusBadgeClasses[tx.status] ?? 'bg-gray-100 text-gray-600';
          const typeClass = typeColorClasses[tx.type] ?? 'text-gray-800';
          return (
            <div
              key={tx.id}
              className="bg-white border border-gray-200 rounded-lg px-[18px] py-3.5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex-1 min-w-[200px]">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`${typeClass} font-bold text-xs uppercase`}>
                      {tx.type.replace(/_/g, ' ')}
                    </span>
                    <span className={`${statusBadge} text-[10px] px-1.5 py-0.5 rounded-full font-semibold`}>
                      {tx.status.toUpperCase()}
                    </span>
                    {tx.transactionMode === 'mock' && (
                      <span className="bg-blue-50 text-blue-700 text-[10px] px-1.5 py-0.5 rounded-full font-semibold">
                        MOCK
                      </span>
                    )}
                    {tx.escrowState && (
                      <span className="bg-purple-100 text-purple-700 text-[10px] px-1.5 py-0.5 rounded-full font-semibold">
                        ESCROW: {tx.escrowState.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500">
                    User: {tx.userId} &bull; Amount: <strong>₹{formatAmount(tx.amount)}</strong> &bull;{' '}
                    {new Date(tx.createdAt).toLocaleString()}
                  </div>
                  {tx.description && (
                    <div className="text-[11px] text-gray-400 mt-0.5">{tx.description}</div>
                  )}
                </div>

                <div className="flex gap-1.5 flex-shrink-0 flex-wrap">
                  {tx.transactionMode === 'mock' && tx.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleOutcome(tx.id, 'success')}
                        className="px-2.5 py-1 bg-success-500 text-white border-0 rounded cursor-pointer text-[11px] font-semibold"
                      >
                        ✅ Success
                      </button>
                      <button
                        onClick={() => handleOutcome(tx.id, 'failure')}
                        className="px-2.5 py-1 bg-danger-500 text-white border-0 rounded cursor-pointer text-[11px] font-semibold"
                      >
                        ❌ Fail
                      </button>
                      <button
                        onClick={() => handleOutcome(tx.id, 'timeout')}
                        className="px-2.5 py-1 bg-accent-400 text-gray-800 border-0 rounded cursor-pointer text-[11px] font-semibold"
                      >
                        ⏱ Timeout
                      </button>
                    </>
                  )}
                  {tx.escrowState === 'held' && (
                    <>
                      <button
                        onClick={() => handleRelease(tx.id)}
                        className="px-2.5 py-1 bg-primary-500 text-white border-0 rounded cursor-pointer text-[11px] font-semibold"
                      >
                        Release Escrow
                      </button>
                      <button
                        onClick={() => handleRefund(tx.id)}
                        className="px-2.5 py-1 bg-orange-700 text-white border-0 rounded cursor-pointer text-[11px] font-semibold"
                      >
                        Refund Escrow
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {!loading && allTransactions.length === 0 && (
          <p className="text-gray-500 text-center py-5">No transactions found.</p>
        )}
      </div>
    </div>
  );
};

export default MockPaymentDashboard;
