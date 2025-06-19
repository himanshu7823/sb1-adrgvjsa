import React, { useState, useEffect } from 'react';
import { Users, Copy, Share2, TrendingUp } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type User = Database['public']['Tables']['users']['Row'];
type Commission = Database['public']['Tables']['commissions']['Row'];

const commissionRates = [0.25, 0.15, 0.10, 0.08, 0.06, 0.05, 0.04, 0.03, 0.02, 0.01];

export const Referrals: React.FC = () => {
  const { currentUser } = useAuth();
  const [copySuccess, setCopySuccess] = useState(false);
  const [directReferrals, setDirectReferrals] = useState<User[]>([]);
  const [commissions, setCommissions] = useState<Commission[]>([]);

  useEffect(() => {
    if (currentUser) {
      fetchDirectReferrals();
      fetchCommissions();
    }
  }, [currentUser]);

  const fetchDirectReferrals = async () => {
    if (!currentUser) return;

    try {
      const { data } = await supabase
        .from('users')
        .select('*')
        .eq('referred_by_code', currentUser.referral_code)
        .order('created_at', { ascending: false });

      if (data) {
        setDirectReferrals(data);
      }
    } catch (error) {
      console.error('Error fetching referrals:', error);
    }
  };

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

  const copyReferralCode = async () => {
    if (!currentUser) return;

    try {
      await navigator.clipboard.writeText(currentUser.referral_code);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = currentUser.referral_code;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const shareReferralCode = async () => {
    if (!currentUser) return;

    const shareText = `टॉप 10 सफलता की आदतें सीखें और पैसे कमाएं!\n\nमेरा रेफर कोड: ${currentUser.referral_code}\n\nअभी जॉइन करें और ₹100 में भगवत गीता के सार के साथ सफलता की आदतें सीखें। रेफरल से कमीशन भी पाएं!`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'टॉप 10 सफलता की आदतें',
          text: shareText
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback
      copyReferralCode();
    }
  };

  if (!currentUser) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <Users className="w-8 h-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-800">रेफरल सिस्टम</h1>
      </div>

      {/* Referral Code Card */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
        <h2 className="text-xl font-bold mb-2">आपका रेफरल कोड</h2>
        <div className="bg-white bg-opacity-20 rounded-lg p-4 mb-4">
          <div className="text-center">
            <div className="text-3xl font-mono font-bold mb-2">{currentUser.referral_code}</div>
            <p className="text-sm opacity-90">इस कोड को शेयर करके कमीशन पाएं</p>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={copyReferralCode}
            className="flex-1 bg-white bg-opacity-20 hover:bg-opacity-30 py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-all"
          >
            <Copy className="w-4 h-4" />
            <span>{copySuccess ? 'कॉपी हो गया!' : 'कॉपी करें'}</span>
          </button>
          <button
            onClick={shareReferralCode}
            className="flex-1 bg-white bg-opacity-20 hover:bg-opacity-30 py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-all"
          >
            <Share2 className="w-4 h-4" />
            <span>शेयर करें</span>
          </button>
        </div>
      </div>

      {/* Commission Structure */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">कमीशन स्ट्रक्चर</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {commissionRates.map((rate, index) => (
            <div key={index} className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 text-center">
              <div className="text-sm text-gray-600">लेवल {index + 1}</div>
              <div className="text-lg font-bold text-green-600">{(rate * 100).toFixed(0)}%</div>
              <div className="text-xs text-gray-500">₹{Math.floor(100 * rate)}</div>
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-600 mt-4 text-center">
          हर बुक सेल (₹100) पर आपको ऊपर दिए गए रेट से कमीशन मिलेगा
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">डायरेक्ट रेफरल</h3>
              <p className="text-2xl font-bold text-blue-600">{directReferrals.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">कुल कमीशन</h3>
              <p className="text-2xl font-bold text-green-600">
                ₹{commissions.reduce((sum, c) => sum + c.amount, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">एक्टिव रेफरल</h3>
              <p className="text-2xl font-bold text-purple-600">
                {directReferrals.filter(u => u.is_activated).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Direct Referrals List */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">आपके डायरेक्ट रेफरल</h3>
        
        {directReferrals.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>अभी तक कोई रेफरल नहीं</p>
            <p className="text-sm">अपना रेफरल कोड शेयर करें</p>
          </div>
        ) : (
          <div className="space-y-3">
            {directReferrals.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${user.is_activated ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  <div>
                    <p className="font-medium text-gray-800">{user.phone}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(user.created_at).toLocaleDateString('hi-IN')} को जॉइन किया
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    user.is_activated ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {user.is_activated ? 'एक्टिव' : 'पेंडिंग'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};