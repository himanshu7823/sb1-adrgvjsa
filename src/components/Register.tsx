import React, { useState } from 'react';
import { Eye, EyeOff, Phone, Lock, Users } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface RegisterProps {
  onSwitchToLogin: () => void;
}

export const Register: React.FC<RegisterProps> = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
    referralCode: 'ADMIN001' // Default referral code
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.phone || !formData.password || !formData.referralCode) {
      setMessage('सभी फील्ड भरना अनिवार्य है');
      return;
    }

    if (formData.phone.length !== 10) {
      setMessage('फोन नंबर 10 अंकों का होना चाहिए');
      return;
    }

    if (formData.password.length < 6) {
      setMessage('पासवर्ड कम से कम 6 अक्षर का होना चाहिए');
      return;
    }

    setLoading(true);
    setMessage('');

    const result = await register(formData.phone, formData.password, formData.referralCode);
    
    setLoading(false);
    setMessage(result.message);
    
    if (result.success) {
      setTimeout(() => {
        onSwitchToLogin();
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8 border-t-4 border-yellow-400">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">रजिस्ट्रेशन</h2>
            <p className="text-gray-600">सफलता की शुरुआत यहाँ से करें</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                फोन नंबर *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="tel"
                  maxLength={10}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="10 अंकों का फोन नंबर"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                पासवर्ड *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="कम से कम 6 अक्षर का पासवर्ड"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                रेफर कोड *
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={formData.referralCode}
                  onChange={(e) => setFormData({ ...formData, referralCode: e.target.value.toUpperCase() })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="रेफर कोड डालें"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                पहली रजिस्ट्रेशन के लिए: <span className="font-mono font-bold text-blue-600">ADMIN001</span>
              </p>
            </div>

            {message && (
              <div className={`p-4 rounded-lg text-center font-medium ${
                message.includes('सफल') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 focus:ring-4 focus:ring-blue-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'रजिस्ट्रेशन हो रहा है...' : 'रजिस्ट्रेशन करें'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              पहले से अकाउंट है?{' '}
              <button
                onClick={onSwitchToLogin}
                className="text-blue-600 font-medium hover:text-blue-700 transition-colors"
              >
                लॉगिन करें
              </button>
            </p>
          </div>

          {/* Instructions */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-bold text-blue-800 mb-2">महत्वपूर्ण जानकारी:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• रजिस्ट्रेशन के बाद आपको एक यूनिक रेफरल कोड मिलेगा</li>
              <li>• यह कोड 5 अंकों का होगा (जैसे: 00001, 00002)</li>
              <li>• बुक खरीदने के बाद ही आप रेफरल कमीशन पा सकेंगे</li>
              <li>• पहली रजिस्ट्रेशन के लिए ADMIN001 का उपयोग करें</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};