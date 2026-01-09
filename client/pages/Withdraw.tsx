import { useState } from 'react';
import { useAppContext } from '@/lib/appContext';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';

export default function Withdraw() {
  const { currentUser, miningBalance, createWithdrawal, withdrawals, adminConfig } = useAppContext();
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validation
    if (!address.trim()) {
      setError('Please enter a withdrawal address');
      return;
    }

    if (!amount || isNaN(Number(amount))) {
      setError('Please enter a valid amount');
      return;
    }

    const numAmount = Number(amount);
    if (numAmount < adminConfig.minWithdrawal) {
      setError(`Minimum withdrawal is ${adminConfig.minWithdrawal}`);
      return;
    }

    if (numAmount > miningBalance) {
      setError('Insufficient balance');
      return;
    }

    // Create withdrawal
    createWithdrawal(address, numAmount);
    setSuccess(true);
    setAddress('');
    setAmount('');

    setTimeout(() => setSuccess(false), 3000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'text-green-600 bg-green-50';
      case 'reviewing':
        return 'text-yellow-600 bg-yellow-50';
      case 'pending':
        return 'text-blue-600 bg-blue-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle size={16} />;
      case 'reviewing':
        return <Clock size={16} />;
      case 'pending':
        return <Clock size={16} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen pb-20 bg-gradient-to-br from-red-50 via-pink-50 to-red-50 px-4 pt-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Withdraw</h1>
        <p className="text-gray-600 text-sm mt-1">Cash out your earnings</p>
      </div>

      {/* Balance Card */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="text-center">
          <p className="text-gray-600 text-sm mb-1">Available Balance</p>
          <p className="text-4xl font-bold text-red-600 font-mono mb-2">
            {miningBalance.toFixed(8)}
          </p>
          <p className="text-gray-500 text-xs">
            Min. Withdrawal: {adminConfig.minWithdrawal}
          </p>
        </div>
      </div>

      {/* Withdrawal Form */}
      <form onSubmit={handleWithdraw} className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Request Withdrawal</h2>

        {/* Address Input */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Withdrawal Address
          </label>
          <input
            type="text"
            value={address}
            onChange={e => setAddress(e.target.value)}
            placeholder="Enter your wallet address (Bitcoin, Ethereum, etc.)"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
          <p className="text-gray-500 text-xs mt-1">Make sure the address is correct</p>
        </div>

        {/* Amount Input */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Amount
          </label>
          <input
            type="number"
            step="0.00000001"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="Enter withdrawal amount"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
          <p className="text-gray-500 text-xs mt-1">
            Min: {adminConfig.minWithdrawal} | Max: {miningBalance.toFixed(8)}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-start gap-2">
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={18} />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4 flex items-start gap-2">
            <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={18} />
            <p className="text-green-700 text-sm">Withdrawal request submitted! Check status below.</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-red-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
        >
          Request Withdrawal
        </button>

        {/* Info Box */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4 text-sm text-yellow-900">
          <p>⏱️ <strong>Processing time:</strong> Your withdrawal will be processed within 24-48 hours.</p>
        </div>
      </form>

      {/* Withdrawal History */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-3">Withdrawal History</h2>
        
        {withdrawals.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-8 text-center">
            <p className="text-gray-600 mb-1">No withdrawals yet</p>
            <p className="text-gray-500 text-sm">Your withdrawal history will appear here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {withdrawals.map(withdrawal => (
              <div key={withdrawal.id} className="bg-white rounded-xl shadow p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 font-mono text-sm break-all">
                      {withdrawal.address}
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      {new Date(withdrawal.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(withdrawal.status)}`}>
                    {getStatusIcon(withdrawal.status)}
                    {withdrawal.status.charAt(0).toUpperCase() + withdrawal.status.slice(1)}
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-gray-600 text-xs mb-1">Amount</p>
                  <p className="text-xl font-bold text-gray-900 font-mono">
                    {withdrawal.amount.toFixed(8)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
