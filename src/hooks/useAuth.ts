import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type User = Database['public']['Tables']['users']['Row'];

export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
    setLoading(false);
  }, []);

  const generateReferralCode = (sequentialId: number): string => {
    return sequentialId.toString().padStart(5, '0');
  };

  const register = async (phone: string, password: string, referralCode: string): Promise<{ success: boolean; message: string }> => {
    try {
      // Check if phone already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('phone')
        .eq('phone', phone)
        .single();

      if (existingUser) {
        return { success: false, message: 'इस फोन नंबर से पहले से रजिस्ट्रेशन है' };
      }

      // Validate referral code if provided
      if (referralCode) {
        const { data: referrer } = await supabase
          .from('users')
          .select('id')
          .eq('referral_code', referralCode)
          .single();

        if (!referrer) {
          return { success: false, message: 'अमान्य रेफर कोड' };
        }
      }

      // Get next sequential ID
      const { data: lastUser } = await supabase
        .from('users')
        .select('sequential_id')
        .order('sequential_id', { ascending: false })
        .limit(1)
        .single();

      const nextSequentialId = (lastUser?.sequential_id || 0) + 1;
      const newReferralCode = generateReferralCode(nextSequentialId);

      // Create new user
      const { error } = await supabase
        .from('users')
        .insert({
          phone,
          password,
          referral_code: newReferralCode,
          referred_by_code: referralCode || null,
          sequential_id: nextSequentialId,
          wallet_balance: 0,
          is_activated: false
        });

      if (error) {
        console.error('Registration error:', error);
        return { success: false, message: 'रजिस्ट्रेशन में त्रुटि हुई' };
      }

      return { success: true, message: 'रजिस्ट्रेशन सफल! कृपया लॉगिन करें।' };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: 'रजिस्ट्रेशन में त्रुटि हुई' };
    }
  };

  const login = async (phone: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('phone', phone)
        .eq('password', password)
        .single();

      if (error || !user) {
        return { success: false, message: 'गलत फोन नंबर या पासवर्ड' };
      }

      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return { success: true, message: 'लॉगिन सफल!' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'लॉगिन में त्रुटि हुई' };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const updateUser = async (updatedUser: User) => {
    try {
      const { error } = await supabase
        .from('users')
        .update(updatedUser)
        .eq('id', updatedUser.id);

      if (!error) {
        setCurrentUser(updatedUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Update user error:', error);
    }
  };

  const refreshUser = async () => {
    if (!currentUser) return;

    try {
      const { data: user } = await supabase
        .from('users')
        .select('*')
        .eq('id', currentUser.id)
        .single();

      if (user) {
        setCurrentUser(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
      }
    } catch (error) {
      console.error('Refresh user error:', error);
    }
  };

  return {
    currentUser,
    loading,
    register,
    login,
    logout,
    updateUser,
    refreshUser
  };
};