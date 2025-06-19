import React, { useState } from 'react';
import { Book, CreditCard, Star, CheckCircle, QrCode } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { habits } from '../data/habits';
import { supabase } from '../lib/supabase';

export const Dashboard: React.FC = () => {
  const { currentUser, refreshUser } = useAuth();
  const [showPayment, setShowPayment] = useState(false);
  const [utrNumber, setUtrNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  if (!currentUser) return null;

  const handleActivationRequest = async () => {
    if (!utrNumber.trim()) {
      setMessage('UTR नंबर आवश्यक है');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('activation_requests')
        .insert({
          user_id: currentUser.id,
          utr_number: utrNumber.trim(),
          status: 'pending'
        });

      if (error) {
        setMessage('अनुरोध भेजने में त्रुटि हुई');
      } else {
        setMessage('एक्टिवेशन अनुरोध भेजा गया! एडमिन द्वारा वेरिफिकेशन का इंतजार करें।');
        setUtrNumber('');
        setShowPayment(false);
      }
    } catch (error) {
      setMessage('अनुरोध भेजने में त्रुटि हुई');
    }
    setLoading(false);
  };

  if (!currentUser.is_activated) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-yellow-400">
          <div className="text-center mb-8">
            <Book className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">टॉप 10 सफलता की आदतें</h1>
            <p className="text-gray-600">भगवत गीता के सार के साथ</p>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">महत्वपूर्ण सूचना</h2>
            <p className="text-gray-700 leading-relaxed text-center">
              <strong className="text-blue-600">फ्री की वस्तु का उपयोग नहीं होता</strong> और <strong className="text-green-600">खरीदी गई वस्तु का उपयोग करना पड़ता है</strong> इसलिए हम <strong className="text-red-600">₹100 चार्ज कर रहे हैं</strong> और अगर किसी को फ्री में इस भागवत गीता के सार को किसी को भेजने को कहेंगे तो कोई नहीं करेगा इसलिए सभी लोगों तक पहुंचाने के लिए कमीशन इस प्रकार <strong className="text-purple-600">(25% 15% 10% 8% 6% 5% 4% 3% 2% 1%)</strong> दिया जाएगा ताकि भगवत गीता का सार हर व्यक्ति तक पहुंचा जा सके।
            </p>
          </div>

          <div className="bg-white border-2 border-yellow-400 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-800">बुक एक्टिवेशन</h3>
                <p className="text-gray-600">सभी 10 आदतों को अनलॉक करें</p>
                <p className="text-sm text-blue-600 mt-2">आपका रेफरल कोड: <span className="font-mono font-bold">{currentUser.referral_code}</span></p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-green-600">₹100</div>
                <div className="text-sm text-gray-500">एक बार का भुगतान</div>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-700">सभी 10 सफलता की आदतें</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-700">व्यावहारिक उदाहरण</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-700">भगवत गीता के सार</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-700">रेफरल कमीशन सिस्टम</span>
              </div>
            </div>

            {!showPayment ? (
              <button
                onClick={() => setShowPayment(true)}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 px-6 rounded-lg font-bold text-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center justify-center space-x-3"
              >
                <QrCode className="w-6 h-6" />
                <span>₹100 भुगतान करें</span>
              </button>
            ) : (
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-lg font-bold text-gray-800 mb-4 text-center">QR Code से भुगतान करें</h4>
                
                <div className="text-center mb-6">
                  <img 
                    src="/qr-code.png" 
                    alt="Payment QR Code" 
                    className="mx-auto max-w-xs w-full h-auto rounded-lg shadow-md"
                  />
                  <p className="text-sm text-gray-600 mt-2">QR Code स्कैन करके ₹100 का भुगतान करें</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      UTR नंबर दर्ज करें *
                    </label>
                    <input
                      type="text"
                      value={utrNumber}
                      onChange={(e) => setUtrNumber(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="12 अंकों का UTR नंबर"
                      maxLength={12}
                    />
                    <p className="text-xs text-gray-500 mt-1">भुगतान के बाद मिलने वाला UTR नंबर यहाँ डालें</p>
                  </div>

                  {message && (
                    <div className={`p-4 rounded-lg text-center font-medium ${
                      message.includes('भेजा गया') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {message}
                    </div>
                  )}

                  <div className="flex space-x-3">
                    <button
                      onClick={handleActivationRequest}
                      disabled={loading || !utrNumber.trim()}
                      className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'भेजा जा रहा है...' : 'UTR सबमिट करें'}
                    </button>
                    <button
                      onClick={() => {
                        setShowPayment(false);
                        setMessage('');
                        setUtrNumber('');
                      }}
                      className="flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-400"
                    >
                      रद्द करें
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">टॉप 10 सफलता की आदतें</h1>
        <p className="text-gray-600">आपकी सफलता की यात्रा यहाँ से शुरू होती है</p>
        <p className="text-sm text-blue-600 mt-2">आपका रेफरल कोड: <span className="font-mono font-bold">{currentUser.referral_code}</span></p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {habits.map((habit) => (
          <div key={habit.id} className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-400 hover:shadow-xl transition-all duration-300">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                  <Star className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800 mb-3">{habit.title}</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">{habit.description}</p>
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">उदाहरण:</h4>
                  <p className="text-blue-700 text-sm">{habit.example}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">अंतिम सलाह</h2>
        <p className="text-gray-700 leading-relaxed max-w-4xl mx-auto">
          अमीर बनने के लिए आपको अपने सपनों को बड़ा बनाना होगा, लेकिन उसके साथ-साथ छोटे-छोटे लक्ष्यों को पूरा करना भी जरूरी है। 
          याद रखें, <strong>"धीमी और स्थिर चाल से दौड़ जीती जाती है।"</strong>
        </p>
        <p className="text-gray-700 mt-4">
          इन आदतों को अपनाकर और लगातार मेहनत करके, आप अपने सपने को साकार कर सकते हैं।
        </p>
      </div>
    </div>
  );
};