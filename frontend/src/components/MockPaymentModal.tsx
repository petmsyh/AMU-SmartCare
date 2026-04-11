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

  const outcomes: { value: MockOutcome; label: string; desc: string; borderCls: string; bgCls: string }[] = [
    { value: 'success', label: '✅ Success', desc: 'Payment completes successfully', borderCls: 'border-success-500', bgCls: 'bg-success-100' },
    { value: 'failure', label: '❌ Failure', desc: 'Payment is declined/fails', borderCls: 'border-danger-500', bgCls: 'bg-danger-100' },
    { value: 'timeout', label: '⏱ Timeout', desc: 'Payment times out (pending)', borderCls: 'border-accent-400', bgCls: 'bg-accent-50' },
  ];

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-auth"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-gray-900 mb-2">💳 Mock Payment</h2>
        <p className="text-sm text-gray-500 mb-5">
          Consultation fee: <strong className="text-gray-800">₹{amount}</strong>
          <br />
          Select a simulated payment outcome:
        </p>

        <div className="flex flex-col gap-2 mb-5">
          {outcomes.map((o) => (
            <label
              key={o.value}
              className={`flex items-center gap-3 p-3 border-2 rounded-xl cursor-pointer transition-all ${
                outcome === o.value ? `${o.borderCls} ${o.bgCls}` : 'border-gray-200 bg-white'
              }`}
            >
              <input
                type="radio"
                name="mockOutcome"
                value={o.value}
                checked={outcome === o.value}
                onChange={() => setOutcome(o.value)}
                className="accent-primary-500"
              />
              <div>
                <div className="font-semibold text-sm text-gray-800">{o.label}</div>
                <div className="text-xs text-gray-500">{o.desc}</div>
              </div>
            </label>
          ))}
        </div>

        {error && (
          <div className="bg-danger-100 text-danger-700 px-4 py-2.5 rounded-xl text-sm mb-4">
            {error}
          </div>
        )}

        <div className="flex gap-2 justify-end">
          <button onClick={onClose} className="btn-ghost btn-sm">
            Cancel
          </button>
          <button onClick={handlePay} disabled={loading} className="btn-primary btn-sm">
            {loading ? 'Processing…' : 'Pay Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MockPaymentModal;
