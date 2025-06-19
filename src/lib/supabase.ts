import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          phone: string;
          password: string;
          referral_code: string;
          referred_by_code: string | null;
          wallet_balance: number;
          is_activated: boolean;
          sequential_id: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          phone: string;
          password: string;
          referral_code: string;
          referred_by_code?: string | null;
          wallet_balance?: number;
          is_activated?: boolean;
          sequential_id: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          phone?: string;
          password?: string;
          referral_code?: string;
          referred_by_code?: string | null;
          wallet_balance?: number;
          is_activated?: boolean;
          sequential_id?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      recharge_requests: {
        Row: {
          id: number;
          user_id: string;
          mobile_number: string;
          operator: string;
          amount: number;
          data_pack: string | null;
          additional_info: string | null;
          status: string;
          admin_amount: number | null;
          created_at: string;
        };
        Insert: {
          user_id: string;
          mobile_number: string;
          operator: string;
          amount: number;
          data_pack?: string | null;
          additional_info?: string | null;
          status?: string;
          admin_amount?: number | null;
        };
        Update: {
          id?: number;
          user_id?: string;
          mobile_number?: string;
          operator?: string;
          amount?: number;
          data_pack?: string | null;
          additional_info?: string | null;
          status?: string;
          admin_amount?: number | null;
        };
      };
      commissions: {
        Row: {
          id: number;
          from_user_id: string;
          to_user_id: string;
          amount: number;
          level: number;
          created_at: string;
        };
        Insert: {
          from_user_id: string;
          to_user_id: string;
          amount: number;
          level: number;
        };
        Update: {
          id?: number;
          from_user_id?: string;
          to_user_id?: string;
          amount?: number;
          level?: number;
        };
      };
      activation_requests: {
        Row: {
          id: number;
          user_id: string;
          utr_number: string;
          status: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          utr_number: string;
          status?: string;
        };
        Update: {
          id?: number;
          user_id?: string;
          utr_number?: string;
          status?: string;
        };
      };
    };
  };
};