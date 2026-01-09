import { useState } from "react";
import { useAppContext } from "@/lib/appContext";
import { Copy, Check, Share2, User } from "lucide-react";

export default function Referrals() {
  const { currentUser, referrals, adminConfig } = useAppContext();
  const [copied, setCopied] = useState(false);

  const referralLink = `https://t.me/YourBotName?start=${currentUser?.id}`;

  const totalReferralEarnings = referrals.reduce((sum, ref) => {
    return sum + ref.balance * (adminConfig.referralProfit / 100);
  }, 0);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareLink = () => {
    const text = `Join me in Cloud Mining! 🚀 I'm already earning crypto. Click to start: ${referralLink}`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent("Join me in Cloud Mining!")}`;

    // Try Telegram share first
    window.open(telegramUrl, "_blank");
  };

  return (
    <div className="min-h-screen pb-20 bg-gradient-to-br from-green-50 via-emerald-50 to-green-50 px-4 pt-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Referrals</h1>
        <p className="text-gray-600 text-sm mt-1">
          Earn {adminConfig.referralProfit}% from each friend's mining
        </p>
      </div>

      {/* Earnings Summary */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-white rounded-xl shadow p-4">
          <p className="text-gray-600 text-xs mb-1">Total Referrals</p>
          <p className="text-3xl font-bold text-green-600">
            {referrals.length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <p className="text-gray-600 text-xs mb-1">Referral Earnings</p>
          <p className="text-2xl font-bold text-green-600 font-mono">
            {totalReferralEarnings.toFixed(8)}
          </p>
        </div>
      </div>

      {/* Referral Link Card */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Your Referral Link
        </h2>

        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={referralLink}
              readOnly
              className="flex-1 bg-gray-100 rounded-lg px-4 py-2 text-sm font-mono text-gray-600 truncate"
            />
            <button
              onClick={handleCopyLink}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>

          <button
            onClick={handleShareLink}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Share2 size={20} />
            Share with Friends
          </button>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-4 text-sm text-green-900">
          <p>
            💡 Share your link with friends to earn rewards when they start
            mining!
          </p>
        </div>
      </div>

      {/* Referrals List */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-3">Your Referrals</h2>

        {referrals.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-8 text-center">
            <User size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-600 mb-2">No referrals yet</p>
            <p className="text-gray-500 text-sm">
              Share your link to start earning!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {referrals.map((ref) => {
              const earnings = ref.balance * (adminConfig.referralProfit / 100);
              return (
                <div key={ref.id} className="bg-white rounded-xl shadow p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white font-bold">
                        {ref.id.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          User {ref.id}
                        </p>
                        <p className="text-xs text-gray-500">
                          Mining: {ref.miningRate.toFixed(8)}/sec
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">
                        {earnings.toFixed(8)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {adminConfig.referralProfit}% earnings
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center mt-6">
        <p className="text-blue-900 text-sm">
          🎯 <strong>Pro Tip:</strong> The more friends you refer, the more you
          earn! Start sharing now.
        </p>
      </div>
    </div>
  );
}
