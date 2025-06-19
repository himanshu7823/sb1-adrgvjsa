# 🚀 5 मिनट में Deploy करें!

## Step 1: Supabase Database (2 मिनट)

1. **https://supabase.com** पर जाएं और account बनाएं
2. **"New Project"** पर click करें:
   - Name: `top-10-habits-mlm`
   - Password: कोई strong password
   - Region: Singapore
3. **SQL Editor** में जाएं
4. `supabase/migrations/create_complete_schema.sql` का content copy करें
5. Paste करके **"RUN"** पर click करें
6. **Settings → API** से URL और key copy करें

## Step 2: Environment Variables (1 मिनट)

`.env` file बनाएं:
```env
VITE_SUPABASE_URL=आपका_supabase_url
VITE_SUPABASE_ANON_KEY=आपका_supabase_key
```

## Step 3: Deploy (2 मिनट)

### Option A: Netlify (Recommended)
1. **https://netlify.com** पर account बनाएं
2. **"Sites"** में drag-and-drop करें `dist` folder
3. **Site settings → Environment variables** में .env की values add करें
4. **Done!** आपका URL ready है

### Option B: Manual Build
```bash
npm run build
```
फिर `dist` folder को किसी भी hosting पर upload करें

## 🎯 Admin Access
- **Phone:** `admin`
- **Password:** `admin123`

## 🔥 Features Ready:
✅ User Registration with Referral Codes  
✅ QR Code Payment System  
✅ 10-Level Commission (25% to 1%)  
✅ Mobile Recharge System  
✅ Admin Panel for Management  
✅ Wallet System  
✅ UTR Verification  

## 📱 Test Flow:
1. Register with referral code `ADMIN001`
2. Pay via QR code and submit UTR
3. Admin activates user
4. User gets referral code and can refer others
5. Commission automatically distributed

**🎉 Ready to launch!** Share your URL और users को invite करें!