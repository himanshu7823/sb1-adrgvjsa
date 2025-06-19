import React, { useState, useEffect } from 'react';
import { Settings, Users, CreditCard, CheckCircle, XCircle, DollarSign, Smartphone, Plus } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type User = Database['public']['Tables']['users']['Row'];
type ActivationRequest = Database['public']['Tables']['activation_requests']['Row'];
type RechargeRequest = Database['public']['Tables']['recharge_requests']['Row'];

const commissionRates = [0.25, 0.15, 0.10, 0.08, 0.06, 0.05, 0.04, 0.03, 0.02, 0.01];

export const Admin: React.FC = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'users' | 'activations' | 'recharges'>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [activationRequests, setActivationRequests] = useState<ActivationRequest[]>([]);
  const [rechargeRequests, setRechargeRequests] = useState<RechargeRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState<{[key: number]: string}>({});

  useEffect(() => {
    if (currentUser?.phone === 'admin') {
      fetchUsers();
      fetchActivationRequests();
      fetchRechargeRequests();
    }
  }, [currentUser]);

  const fetchUsers = async () => {
    try {
      const { data } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) {
        setUsers(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchActivationRequests = async () => {
    try {
      const { data } = await supabase
        .from('activation_requests')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (data) {
        setActivationRequests(data);
      }
    } catch (error) {
      console.error('Error fetching activation requests:', error);
    }
  };

  const fetchRechargeRequests = async () => {
    try {
      const { data } = await supabase
        .from('recharge_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) {
        setRechargeRequests(data);
      }
    } catch (error) {
      console.error('Error fetching recharge requests:', error);
    }
  };

  const handleActivationAction = async (requestId: number, action: 'approved' | 'rejected') => {
    setLoading(true);
    try {
      // Update activation request status
      const { error: updateError } = await supabase
        .from('activation_requests')
        .update({ status: action })
        .eq('id', requestId);

      if (updateError) throw updateError;

      if (action === 'approved') {
        // Get the activation request to find user
        const request = activationRequests.find(r => r.id === requestId);
        if (request) {
          // Activate user
          const { error: userError } = await supabase
            .from('users')
            .update({ is_activated: true })
            .eq('id', request.user_id);

          if (userError) throw userError;

          // Process commission for referral chain
          await processCommissions(request.user_id);
        }
      }

      // Refresh data
      fetchActivationRequests();
      fetchUsers();
    } catch (error) {
      console.error('Error handling activation:', error);
    }
    setLoading(false);
  };

  const processCommissions = async (newUserId: string) => {
    try {
      // Get the new user
      const { data: newUser } = await supabase
        .from('users')
        .select('*')
        .eq('id', newUserId)
        .single();

      if (!newUser || !newUser.referred_by_code) return;

      // Find referral chain
      let currentReferrerCode = newUser.referred_by_code;
      let level = 0;

      while (currentReferrerCode && level < 10) {
        const { data: referrer } = await supabase
          .from('users')
          .select('*')
          .eq('referral_code', currentReferrerCode)
          .single();

        if (!referrer) break;

        const commissionAmount = Math.floor(100 * commissionRates[level]);

        // Add commission
        await supabase
          .from('commissions')
          .insert({
            from_user_id: newUserId,
            to_user_id: referrer.id,
            amount: commissionAmount,
            level: level + 1
          });

        // Update referrer's wallet
        await supabase
          .from('users')
          .update({ 
            wallet_balance: referrer.wallet_balance + commissionAmount 
          })
          .eq('id', referrer.id);

        // Move to next level
        currentReferrerCode = referrer.referred_by_code;
        level++;
      }
    } catch (error) {
      console.error('Error processing commissions:', error);
    }
  };

  const handleRechargeAction = async (requestId: number, action: 'completed' | 'cancelled') => {
    setLoading(true);
    try {
      const request = rechargeRequests.find(r => r.id === requestId);
      if (!request) return;

      if (action === 'completed') {
        const amount = parseInt(rechargeAmount[requestId] || '0');
        if (amount <= 0) {
          alert('कृपया वैध राशि दर्ज करें');
          setLoading(false);
          return;
        }

        // Update recharge request
        await supabase
          .from('recharge_requests')
          .update({ 
            status: 'completed',
            admin_amount: amount
          })
          .eq('id', requestId);

        // Deduct amount from user's wallet
        const { data: user } = await supabase
          .from('users')
          .select('wallet_balance')
          .eq('id', request.user_id)
          .single();

        if (user) {
          await supabase
            .from('users')
            .update({ 
              wallet_balance: Math.max(0, user.wallet_balance - amount)
            })
            .eq('id', request.user_id);
        }
      } else {
        // Cancel recharge request
        await supabase
          .from('recharge_requests')
          .update({ status: 'cancelled' })
          .eq('id', requestId);
      }

      fetchRechargeRequests();
      fetchUsers();
    } catch (error) {
      console.error('Error handling recharge:', error);
    }
    setLoading(false);
  };

  if (currentUser?.phone !== 'admin') {
    return <div className="text-center py-8">Access Denied</div>;
  }

  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.is_activated).length;
  const totalRevenue = users.filter(u => u.is_activated).length * 100;
  const pendingActivations = activationRequests.length;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <Settings className="w-8 h-8 text-purple-600" />
        <h1 className="text-3xl font-bold text-gray-800">एडमिन पैनल</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">कुल यूजर</h3>
              <p className="text-2xl font-bold text-blue-600">{totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">एक्टिव यूजर</h3>
              <p className="text-2xl font-bold text-green-600">{activeUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">कुल रेवेन्यू</h3>
              <p className="text-2xl font-bold text-purple-600">₹{totalRevenue}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">पेंडिंग एक्टिवेशन</h3>
              <p className="text-2xl font-bold text-red-600">{pendingActivations}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-lg">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('users')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'users'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              सभी यूजर
            </button>
            <button
              onClick={() => setActiveTab('activations')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'activations'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              एक्टिवेशन अनुरोध ({pendingActivations})
            </button>
            <button
              onClick={() => setActiveTab('recharges')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'recharges'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              रिचार्ज अनुरोध
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'users' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-800">सभी यूजर की सूची</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">फोन</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">रेफरल कोड</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">स्टेटस</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">वॉलेट</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">जॉइन डेट</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {user.phone}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-blue-600">
                          {user.referral_code}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            user.is_activated 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {user.is_activated ? 'एक्टिव' : 'पेंडिंग'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₹{user.wallet_balance}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(user.created_at).toLocaleDateString('hi-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'activations' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-800">एक्टिवेशन अनुरोध</h3>
              {activationRequests.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>कोई पेंडिंग एक्टिवेशन अनुरोध नहीं</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activationRequests.map((request) => {
                    const user = users.find(u => u.id === request.user_id);
                    return (
                      <div key={request.id} className="bg-gray-50 rounded-lg p-6">
                        <div className="flex items-center justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-4">
                              <div>
                                <p className="font-medium text-gray-800">
                                  फोन: {user?.phone}
                                </p>
                                <p className="text-sm text-gray-600">
                                  UTR: {request.utr_number}
                                </p>
                                <p className="text-sm text-gray-600">
                                  रेफरल कोड: {user?.referral_code}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <span>दिनांक: {new Date(request.created_at).toLocaleDateString('hi-IN')}</span>
                            </div>
                          </div>
                          <div className="flex space-x-3">
                            <button
                              onClick={() => handleActivationAction(request.id, 'approved')}
                              disabled={loading}
                              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                            >
                              <CheckCircle className="w-4 h-4" />
                              <span>एक्टिवेट करें</span>
                            </button>
                            <button
                              onClick={() => handleActivationAction(request.id, 'rejected')}
                              disabled={loading}
                              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                            >
                              <XCircle className="w-4 h-4" />
                              <span>रिजेक्ट करें</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'recharges' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-800">रिचार्ज अनुरोध</h3>
              {rechargeRequests.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Smartphone className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>कोई रिचार्ज अनुरोध नहीं</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {rechargeRequests.map((request) => {
                    const user = users.find(u => u.id === request.user_id);
                    return (
                      <div key={request.id} className="bg-gray-50 rounded-lg p-6">
                        <div className="flex items-center justify-between">
                          <div className="space-y-2">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="font-medium text-gray-800">यूजर: {user?.phone}</p>
                                <p className="text-sm text-gray-600">वॉलेट: ₹{user?.wallet_balance}</p>
                                <p className="text-sm text-gray-600">मोबाइल: {request.mobile_number}</p>
                                <p className="text-sm text-gray-600">ऑपरेटर: {request.operator.toUpperCase()}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">राशि: ₹{request.amount}</p>
                                {request.data_pack && <p className="text-sm text-gray-600">डेटा पैक: {request.data_pack}</p>}
                                {request.additional_info && <p className="text-sm text-gray-600">जानकारी: {request.additional_info}</p>}
                                <p className="text-sm text-gray-600">स्टेटस: 
                                  <span className={`ml-1 px-2 py-1 rounded text-xs ${
                                    request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                    request.status === 'completed' ? 'bg-green-100 text-green-800' :
                                    'bg-red-100 text-red-800'
                                  }`}>
                                    {request.status === 'pending' ? 'पेंडिंग' : 
                                     request.status === 'completed' ? 'पूर्ण' : 'रद्द'}
                                  </span>
                                </p>
                              </div>
                            </div>
                            <p className="text-xs text-gray-500">
                              दिनांक: {new Date(request.created_at).toLocaleDateString('hi-IN')}
                            </p>
                          </div>
                          
                          {request.status === 'pending' && (
                            <div className="flex flex-col space-y-3">
                              <div className="flex items-center space-x-2">
                                <input
                                  type="number"
                                  placeholder="राशि दर्ज करें"
                                  value={rechargeAmount[request.id] || ''}
                                  onChange={(e) => setRechargeAmount({
                                    ...rechargeAmount,
                                    [request.id]: e.target.value
                                  })}
                                  className="w-32 px-3 py-1 border border-gray-300 rounded text-sm"
                                />
                              </div>
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleRechargeAction(request.id, 'completed')}
                                  disabled={loading}
                                  className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50"
                                >
                                  <CheckCircle className="w-3 h-3" />
                                  <span>पूर्ण</span>
                                </button>
                                <button
                                  onClick={() => handleRechargeAction(request.id, 'cancelled')}
                                  disabled={loading}
                                  className="flex items-center space-x-1 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 disabled:opacity-50"
                                >
                                  <XCircle className="w-3 h-3" />
                                  <span>रद्द</span>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};