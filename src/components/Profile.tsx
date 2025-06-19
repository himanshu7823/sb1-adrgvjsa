import React, { useState } from 'react';
import { User, Phone, Calendar, Award, Edit3, Save, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const Profile: React.FC = () => {
  const { currentUser, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  if (!currentUser) return null;

  const handlePasswordUpdate = () => {
    if (!newPassword || newPassword.length < 6) {
      setMessage('पासवर्ड कम से कम 6 अक्षर का होना चाहिए');
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage('पासवर्ड मैच नहीं कर रहे');
      return;
    }

    const updatedUser = {
      ...currentUser,
      password: newPassword
    };

    updateUser(updatedUser);
    setMessage('पासवर्ड अपडेट हो गया');
    setNewPassword('');
    setConfirmPassword('');
    setIsEditing(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <User className="w-8 h-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-800">मेरी प्रोफाइल</h1>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{currentUser.phone}</h2>
              <p className="text-gray-600">
                {currentUser.isActive ? 'सक्रिय सदस्य' : 'निष्क्रिय सदस्य'}
              </p>
            </div>
          </div>
          <div className={`px-4 py-2 rounded-full ${
            currentUser.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
          }`}>
            {currentUser.isActive ? 'एक्टिव' : 'पेंडिंग'}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <Phone className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-sm text-gray-600">फोन नंबर</p>
                <p className="font-medium text-gray-800">{currentUser.phone}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <Calendar className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-sm text-gray-600">जॉइन डेट</p>
                <p className="font-medium text-gray-800">
                  {new Date(currentUser.joinedAt).toLocaleDateString('hi-IN')}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <Award className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-sm text-gray-600">रेफरल कोड</p>
                <p className="font-mono font-bold text-blue-600">{currentUser.personalReferralCode}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <User className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-sm text-gray-600">रेफर किया गया</p>
                <p className="font-medium text-gray-800">
                  {currentUser.referralCode || 'कोई नहीं'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Password Update */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800">सुरक्षा सेटिंग्स</h3>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Edit3 className="w-4 h-4" />
              <span>पासवर्ड बदलें</span>
            </button>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                नया पासवर्ड
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="नया पासवर्ड डालें"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                पासवर्ड कन्फर्म करें
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="पासवर्ड दोबारा डालें"
              />
            </div>

            {message && (
              <div className={`p-3 rounded-lg text-center ${
                message.includes('अपडेट') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {message}
              </div>
            )}

            <div className="flex space-x-3">
              <button
                onClick={handlePasswordUpdate}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>सेव करें</span>
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setNewPassword('');
                  setConfirmPassword('');
                  setMessage('');
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                <X className="w-4 h-4" />
                <span>रद्द करें</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-600">पासवर्ड सुरक्षित रूप से संरक्षित है</p>
          </div>
        )}
      </div>

      {/* Account Stats */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">अकाउंट आंकड़े</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">₹{currentUser.wallet}</div>
            <div className="text-sm text-gray-600">वॉलेट बैलेंस</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {currentUser.hasPaidForBook ? 'हाँ' : 'नहीं'}
            </div>
            <div className="text-sm text-gray-600">बुक खरीदी</div>
          </div>
        </div>
      </div>
    </div>
  );
};