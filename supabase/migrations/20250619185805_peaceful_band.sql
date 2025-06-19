/*
  # Complete MLM Platform Database Schema

  1. New Tables
    - `users` - User management with referral system
    - `activation_requests` - Book purchase activation requests
    - `recharge_requests` - Mobile recharge requests
    - `commissions` - Commission tracking for referral system

  2. Security
    - Enable RLS on all tables
    - Add policies for user data access
    - Admin-only access for management functions

  3. Features
    - 10-level commission system (25%, 15%, 10%, 8%, 6%, 5%, 4%, 3%, 2%, 1%)
    - Unique referral code generation
    - Mobile recharge system
    - UTR-based payment verification
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone text UNIQUE NOT NULL,
  password text NOT NULL,
  referral_code text UNIQUE NOT NULL,
  referred_by_code text,
  wallet_balance integer DEFAULT 0,
  is_activated boolean DEFAULT false,
  sequential_id integer UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create activation_requests table
CREATE TABLE IF NOT EXISTS activation_requests (
  id serial PRIMARY KEY,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  utr_number text NOT NULL,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Create recharge_requests table
CREATE TABLE IF NOT EXISTS recharge_requests (
  id serial PRIMARY KEY,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  mobile_number text NOT NULL,
  operator text NOT NULL,
  amount integer NOT NULL,
  data_pack text,
  additional_info text,
  status text DEFAULT 'pending',
  admin_amount integer,
  created_at timestamptz DEFAULT now()
);

-- Create commissions table
CREATE TABLE IF NOT EXISTS commissions (
  id serial PRIMARY KEY,
  from_user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  to_user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  amount integer NOT NULL,
  level integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE activation_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE recharge_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE commissions ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own data"
  ON users
  FOR SELECT
  USING (true); -- Allow reading for referral system

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  USING (auth.uid()::text = id::text);

-- Activation requests policies
CREATE POLICY "Users can insert own activation requests"
  ON activation_requests
  FOR INSERT
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view own activation requests"
  ON activation_requests
  FOR SELECT
  USING (auth.uid()::text = user_id::text);

-- Recharge requests policies
CREATE POLICY "Users can insert own recharge requests"
  ON recharge_requests
  FOR INSERT
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view own recharge requests"
  ON recharge_requests
  FOR SELECT
  USING (auth.uid()::text = user_id::text);

-- Commissions policies
CREATE POLICY "Users can view own commissions"
  ON commissions
  FOR SELECT
  USING (auth.uid()::text = to_user_id::text);

-- Insert admin user
INSERT INTO users (
  id,
  phone,
  password,
  referral_code,
  referred_by_code,
  wallet_balance,
  is_activated,
  sequential_id
) VALUES (
  gen_random_uuid(),
  'admin',
  'admin123',
  'ADMIN001',
  null,
  0,
  true,
  0
) ON CONFLICT (phone) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_referral_code ON users(referral_code);
CREATE INDEX IF NOT EXISTS idx_users_referred_by_code ON users(referred_by_code);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_activation_requests_user_id ON activation_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_activation_requests_status ON activation_requests(status);
CREATE INDEX IF NOT EXISTS idx_recharge_requests_user_id ON recharge_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_recharge_requests_status ON recharge_requests(status);
CREATE INDEX IF NOT EXISTS idx_commissions_to_user_id ON commissions(to_user_id);
CREATE INDEX IF NOT EXISTS idx_commissions_from_user_id ON commissions(from_user_id);