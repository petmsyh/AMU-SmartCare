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

  const typeColors: Record<string, string> = {
    payment: '#34a853',
    escrow_hold: '#1a73e8',
    escrow_release: '#0d47a1',
    refund: '#ea4335',
    withdrawal: '#e65100',
    commission: '#6a1b9a',
  };

  const statusColors: Record<string, { bg: string; color: string }> = {
    pending: { bg: '#fff3e0', color: '#e65100' },
    completed: { bg: '#e8f5e9', color: '#2e7d32' },
    failed: { bg: '#fce8e6', color: '#c5221f' },
    refunded: { bg: '#f3e5f5', color: '#6a1b9a' },
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 22 }}>Mock Payment Dashboard</h2>
        <button
          onClick={handleResetWallets}
          disabled={resetting}
          style={{
            padding: '8px 18px',
            background: '#c62828',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            cursor: resetting ? 'not-allowed' : 'pointer',
            fontSize: 13,
            fontWeight: 600,
            opacity: resetting ? 0.7 : 1,
          }}
        >
          {resetting ? 'Resetting…' : '🔄 Reset All Wallets'}
        </button>
      </div>

      {actionMsg && (
        <div
          style={{
            background: '#e8f5e9',
            color: '#2e7d32',
            padding: '8px 14px',
            borderRadius: 6,
            marginBottom: 14,
            fontSize: 13,
          }}
        >
          ✅ {actionMsg}
        </div>
      )}

      {loading && <p style={{ color: '#666' }}>Loading transactions…</p>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {allTransactions.map((tx) => {
          const s = statusColors[tx.status] || { bg: '#f5f5f5', color: '#333' };
          return (
            <div
              key={tx.id}
              style={{
                background: '#fff',
                border: '1px solid #e0e0e0',
                borderRadius: 8,
                padding: '14px 18px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: 12,
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span
                      style={{
                        color: typeColors[tx.type] || '#333',
                        fontWeight: 700,
                        fontSize: 12,
                        textTransform: 'uppercase',
                      }}
                    >
                      {tx.type.replace(/_/g, ' ')}
                    </span>
                    <span
                      style={{
                        background: s.bg,
                        color: s.color,
                        fontSize: 10,
                        padding: '1px 6px',
                        borderRadius: 8,
                        fontWeight: 600,
                      }}
                    >
                      {tx.status.toUpperCase()}
                    </span>
                    {tx.transactionMode === 'mock' && (
                      <span
                        style={{
                          background: '#e3f2fd',
                          color: '#1565c0',
                          fontSize: 10,
                          padding: '1px 6px',
                          borderRadius: 8,
                          fontWeight: 600,
                        }}
                      >
                        MOCK
                      </span>
                    )}
                    {tx.escrowState && (
                      <span
                        style={{
                          background: '#f3e5f5',
                          color: '#6a1b9a',
                          fontSize: 10,
                          padding: '1px 6px',
                          borderRadius: 8,
                          fontWeight: 600,
                        }}
                      >
                        ESCROW: {tx.escrowState.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 12, color: '#666' }}>
                    User: {tx.userId} &bull; Amount: <strong>₹{tx.amount.toFixed(2)}</strong> &bull;{' '}
                    {new Date(tx.createdAt).toLocaleString()}
                  </div>
                  {tx.description && (
                    <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>{tx.description}</div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: 6, flexShrink: 0, flexWrap: 'wrap' }}>
                  {tx.transactionMode === 'mock' && tx.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleOutcome(tx.id, 'success')}
                        style={{ padding: '4px 10px', background: '#34a853', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 11, fontWeight: 600 }}
                      >
                        ✅ Success
                      </button>
                      <button
                        onClick={() => handleOutcome(tx.id, 'failure')}
                        style={{ padding: '4px 10px', background: '#ea4335', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 11, fontWeight: 600 }}
                      >
                        ❌ Fail
                      </button>
                      <button
                        onClick={() => handleOutcome(tx.id, 'timeout')}
                        style={{ padding: '4px 10px', background: '#fbbc04', color: '#333', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 11, fontWeight: 600 }}
                      >
                        ⏱ Timeout
                      </button>
                    </>
                  )}
                  {tx.escrowState === 'held' && (
                    <>
                      <button
                        onClick={() => handleRelease(tx.id)}
                        style={{ padding: '4px 10px', background: '#1a73e8', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 11, fontWeight: 600 }}
                      >
                        Release Escrow
                      </button>
                      <button
                        onClick={() => handleRefund(tx.id)}
                        style={{ padding: '4px 10px', background: '#e65100', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 11, fontWeight: 600 }}
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
          <p style={{ color: '#666', textAlign: 'center', padding: 20 }}>No transactions found.</p>
        )}
      </div>
    </div>
  );
};

export default MockPaymentDashboard;
