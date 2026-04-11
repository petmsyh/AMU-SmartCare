import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import { initiatePayment } from '../store/slices/paymentsSlice';

interface MockPaymentModalProps {
  consultationId: string;
  amount: number;
  onClose: () => void;
  onSuccess: () => void;
}

type MockOutcome = 'success' | 'failure' | 'timeout';

const MockPaymentModal: React.FC<MockPaymentModalProps> = ({
  consultationId,
  amount,
  onClose,
  onSuccess,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [outcome, setOutcome] = useState<MockOutcome>('success');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePay = async () => {
    setLoading(true);
    setError('');
    const result = await dispatch(
      initiatePayment({ consultationId, amount, mockOutcome: outcome })
    );
    setLoading(false);
    if (initiatePayment.fulfilled.match(result)) {
      onSuccess();
    } else {
      setError((result.payload as string) || 'Payment failed');
    }
  };

  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  };

  const modalStyle: React.CSSProperties = {
    background: '#fff',
    borderRadius: 8,
    padding: 32,
    width: 420,
    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
  };

  const outcomes: { value: MockOutcome; label: string; desc: string; color: string }[] = [
    { value: 'success', label: '✅ Success', desc: 'Payment completes successfully', color: '#34a853' },
    { value: 'failure', label: '❌ Failure', desc: 'Payment is declined/fails', color: '#ea4335' },
    { value: 'timeout', label: '⏱ Timeout', desc: 'Payment times out (pending)', color: '#fbbc04' },
  ];

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <h2 style={{ margin: '0 0 8px', fontSize: 20 }}>💳 Mock Payment</h2>
        <p style={{ color: '#666', margin: '0 0 20px', fontSize: 14 }}>
          Consultation fee: <strong>₹{amount}</strong>
          <br />
          Select a simulated payment outcome:
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
          {outcomes.map((o) => (
            <label
              key={o.value}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 14px',
                border: `2px solid ${outcome === o.value ? o.color : '#e0e0e0'}`,
                borderRadius: 6,
                cursor: 'pointer',
                background: outcome === o.value ? `${o.color}10` : '#fff',
                transition: 'all 0.15s',
              }}
            >
              <input
                type="radio"
                name="mockOutcome"
                value={o.value}
                checked={outcome === o.value}
                onChange={() => setOutcome(o.value)}
                style={{ accentColor: o.color }}
              />
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{o.label}</div>
                <div style={{ fontSize: 12, color: '#666' }}>{o.desc}</div>
              </div>
            </label>
          ))}
        </div>

        {error && (
          <div
            style={{
              background: '#fce8e6',
              color: '#c5221f',
              padding: '8px 12px',
              borderRadius: 4,
              marginBottom: 16,
              fontSize: 14,
            }}
          >
            {error}
          </div>
        )}

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px',
              border: '1px solid #ddd',
              borderRadius: 4,
              cursor: 'pointer',
              background: '#fff',
              fontSize: 14,
            }}
          >
            Cancel
          </button>
          <button
            onClick={handlePay}
            disabled={loading}
            style={{
              padding: '8px 20px',
              background: '#1a73e8',
              color: '#fff',
              border: 'none',
              borderRadius: 4,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            {loading ? 'Processing…' : 'Pay Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MockPaymentModal;
