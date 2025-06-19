import React, { useState, useEffect } from 'react';
import { Wallet as WalletIcon, TrendingUp, ArrowDownLeft, CreditCard, Smartphone, Send } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type Commission = Database['public']['Tables']['commissions']['Row'];
type RechargeRequest = Database['public']['Tables']['recharge_requests']['Row'];

export const Wallet: React.FC = () => {
  const { currentUser, refreshUser } = useAuth();
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [showRecharge, setShowRecharge] = useState(false);
  const [rechargeData, setRechargeData] = useState({
    mobileNumber: '',
    operator: 'jio',
    amount: '',
    dataPack: '',
    additionalInfo: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (currentUser) {
      fetchCommissions();
    }
  }, [currentUser]);

  const fetchCommissions = async () => {
    if (!currentUser) return;

    try {
      const { data } = await supabase
        .from('commissions')
        .select('*')
        .eq('to_user_id', currentUser.id)
        .order('created_at', { ascending: false });

      if (data) {
        setCommissions(data);
      }
    } catch (error) {
      console.error('Error fetching commissions:', error);
    }
  };

  const handleRechargeRequest = async () => {
    if (!rechargeData.mobileNumber || !rechargeData.amount) {
      setMessage('मोबाइल नंबर और राशि आवश्यक है');
      return;
    }

    if (rechargeData.mobileNumber.length !== 10) {
      setMessage('मोबाइल नंबर 10 अंकों का होना चाहिए');
      return;
    }

    const amount = parseInt(rechargeData.amount);
    if (amount <= 0 || amount > currentUser!.wallet_balance) {
      setMessage('अमान्य राशि या अपर्याप्त बैलेंस');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('recharge_requests')
        .insert({
          user_id: currentUser!.id,
          mobile_number: rechargeData.mobileNumber,
          operator: rechargeData.operator,
          amount: amount,
          data_pack: rechargeData.dataPack || null,
          additional_info: rechargeData.additionalInfo || null,
          status: 'pending'
        });

      if (error) {
        setMessage('रिचार्ज अनुरोध भेजने में त्रुटि हुई');
      } else {
        setMessage('रिचार्ज अनुरोध भेजा गया! एडमिन द्वारा प्रोसेसिंग का इंतजार करें।');
        setRechargeData({
          mobileNumber: '',
          operator: 'jio',
          amount: '',
          dataPack: '',
          additionalInfo: ''
        });
        setShowRecharge(false);
      }
    } catch (error) {
      setMessage('रिचार्ज अनुरोध भेजने में त्रुटि हुई');
    }
    setLoading(false);
  };

  if (!currentUser) return null;

  const totalEarnings = commissions.reduce((sum, c) => sum + c.amount, 0);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <WalletIcon className="w-8 h-8 text-green-600" />
        <h1 className="text-3xl font-bold text-gray-800">मेरा वॉलेट</h1>
      </div>

      {/* Wallet Balance Card */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium opacity-90">वर्तमान बैलेंस</h2>
            <div className="text-4xl font-bold">₹{currentUser.wallet_balance}</div>
          </div>
          <WalletIcon className="w-12 h-12 opacity-80" />
        </div>
        <div className="mt-4 flex justify-between text-sm opacity-90">
          <span>कुल कमाई: ₹{totalEarnings}</span>
          <span>सक्रिय: {currentUser.is_activated ? 'हाँ' : 'नहीं'}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => setShowRecharge(true)}
          disabled={currentUser.wallet_balance <= 0 || !currentUser.is_activated}
          className="bg-white rounded-xl p-6 shadow-lg border-2 border-blue-200 hover:border-blue-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Smartphone className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-gray-800">मोबाइल रिचार्ज</h3>
              <p className="text-sm text-gray-600">वॉलेट से रिचार्ज करें</p>
            </div>
          </div>
        </button>

        <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-gray-800">कुल कमीशन</h3>
              <p className="text-lg font-bold text-purple-600">₹{totalEarnings}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Commission History */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">कमीशन हिस्ट्री</h3>
        
        {commissions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <CreditCard className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>अभी तक कोई कमीशन नहीं मिला</p>
          </div>
        ) : (
          <div className="space-y-3">
            {commissions.slice(0, 10).map((commission) => (
              <div key={commission.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <ArrowDownLeft className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">लेवल {commission.level} कमीशन</p>
                    <p className="text-sm text-gray-600">
                      {new Date(commission.created_at).toLocaleDateString('hi-IN')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">+₹{commission.amount}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recharge Modal */}
      {showRecharge && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-800 mb-4">मोबाइल रिचार्ज</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  मोबाइल नंबर *
                </label>
                <input
                  type="tel"
                  value={rechargeData.mobileNumber}
                  onChange={(e) => setRechargeData({...rechargeData, mobileNumber: e.target.value.replace(/\D/g, '')})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="10 अंकों का मोबाइल नंबर"
                  maxLength={10}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ऑपरेटर *
                </label>
                <select
                  value={rechargeData.operator}
                  onChange={(e) => setRechargeData({...rechargeData, operator: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="jio">Jio</option>
                  <option value="airtel">Airtel</option>
                  <option value="vi">Vi (Vodafone Idea)</option>
                  <option value="bsnl">BSNL</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  राशि (₹) *
                </label>
                <input
                  type="number"
                  value={rechargeData.amount}
                  onChange={(e) => setRechargeData({...rechargeData, amount: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="रिचार्ज राशि"
                  min="1"
                  max={currentUser.wallet_balance}
                />
                <p className="text-xs text-gray-500 mt-1">उपलब्ध बैलेंस: ₹{currentUser.wallet_balance}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  डेटा पैक (वैकल्पिक)
                </label>
                <input
                  type="text"
                  value={rechargeData.dataPack}
                  onChange={(e) => setRechargeData({...rechargeData, dataPack: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="जैसे: 1GB/day, 28 days"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  अतिरिक्त जानकारी (वैकल्पिक)
                </label>
                <textarea
                  value={rechargeData.additionalInfo}
                  onChange={(e) => setRechargeData({...rechargeData, additionalInfo: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="कोई विशेष निर्देश या जानकारी"
                  rows={3}
                />
              </div>

              {message && (
                <div className={`p-3 rounded-lg text-center ${
                  message.includes('भेजा गया') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {message}
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  onClick={handleRechargeRequest}
                  disabled={loading || !rechargeData.mobileNumber || !rechargeData.amount}
                  className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? 'भेजा जा रहा है...' : 'रिचार्ज अनुरोध भेजें'}</span>
                </button>
                <button
                  onClick={() => {
                    setShowRecharge(false);
                    setMessage('');
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-400"
                >
                  रद्द करें
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};