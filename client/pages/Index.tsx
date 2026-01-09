import { useEffect, useState } from 'react';
import { useAppContext } from '@/lib/appContext';
import { Gift } from 'lucide-react';

export default function Index() {
  const { currentUser, setCurrentUser, miningBalance, setMiningBalance, adminConfig } = useAppContext();
  const [dailyBonusAvailable, setDailyBonusAvailable] = useState(true);
  const [lastBonusDate, setLastBonusDate] = useState<string | null>(null);

  // Mining simulation - increments balance
  useEffect(() => {
    const miningInterval = setInterval(() => {
      setMiningBalance(prev => {
        const newBalance = parseFloat((prev + adminConfig.miningAmount).toFixed(8));
        return newBalance;
      });
    }, 1000);

    return () => clearInterval(miningInterval);
  }, [adminConfig.miningAmount, setMiningBalance]);

  // Update user balance with mined amount
  useEffect(() => {
    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        balance: miningBalance,
        miningRate: adminConfig.miningAmount,
      });
    }
  }, [miningBalance, currentUser, setCurrentUser, adminConfig.miningAmount]);

  // Check daily bonus availability
  useEffect(() => {
    const today = new Date().toDateString();
    const bonusDate = localStorage.getItem('lastBonusDate');
    setLastBonusDate(bonusDate);
    setDailyBonusAvailable(bonusDate !== today);
  }, []);

  const handleDailyBonus = () => {
    if (!dailyBonusAvailable || !currentUser) return;

    const today = new Date().toDateString();
    localStorage.setItem('lastBonusDate', today);
    setDailyBonusAvailable(false);

    const newBalance = parseFloat((miningBalance + adminConfig.dailyBonus).toFixed(8));
    setMiningBalance(newBalance);
  };

  const formatBalance = (balance: number) => {
    return balance.toFixed(8).replace(/\.?0+$/, '') || '0.00000000';
  };

  return (
    <div className="min-h-screen pb-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 pt-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Cloud Mining</h1>
        <p className="text-gray-600 text-sm mt-1">Keep your device on to mine</p>
      </div>

      {/* Balance Card */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="text-center">
          <p className="text-gray-600 text-sm mb-2">Your Balance</p>
          <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 font-mono">
            {formatBalance(miningBalance)}
          </p>
          <p className="text-gray-500 text-xs mt-2">≈ {(miningBalance * 40000).toFixed(2)} USDT</p>
        </div>
      </div>

      {/* Mining Circle */}
      <div className="flex justify-center mb-8">
        <div className="relative w-40 h-40">
          {/* Outer pulsing ring */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 animate-pulse"></div>
          
          {/* Middle ring */}
          <div className="absolute inset-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
            {/* Inner circle */}
            <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-2xl">
              {/* Spinning animation element */}
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-white border-r-blue-200 animate-spin"></div>
              
              {/* Center text */}
              <div className="text-center z-10">
                <svg className="w-8 h-8 text-white mx-auto mb-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z" />
                </svg>
                <p className="text-white text-xs font-semibold">Mining</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mining Rate */}
      <div className="bg-white rounded-xl shadow p-4 mb-6 text-center">
        <p className="text-gray-600 text-sm mb-1">Mining Rate</p>
        <p className="text-xl font-bold text-blue-600 font-mono">
          +{formatBalance(adminConfig.miningAmount)}/sec
        </p>
      </div>

      {/* Daily Bonus */}
      <button
        onClick={handleDailyBonus}
        disabled={!dailyBonusAvailable}
        className={`w-full py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 mb-6 ${
          dailyBonusAvailable
            ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-lg hover:shadow-xl'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
      >
        <Gift size={20} />
        {dailyBonusAvailable 
          ? `Claim Daily Bonus +${formatBalance(adminConfig.dailyBonus)}` 
          : 'Daily Bonus Claimed'}
      </button>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
        <p className="text-blue-900 text-sm">
          💡 <strong>Tip:</strong> Refer friends to earn more! Every referral gets you {adminConfig.referralProfit}% of their mining.
        </p>
      </div>
    </div>
  );
}
