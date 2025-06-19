# टॉप 10 हैबिट्स MLM प्लेटफॉर्म - Production Setup Guide

## 🚀 Production में Deploy करने के लिए Complete Steps

### Step 1: Supabase Database Setup

1. **Supabase Account बनाएं:**
   - https://supabase.com पर जाएं
   - "Start your project" पर click करें
   - GitHub/Google से sign up करें

2. **New Project बनाएं:**
   - "New Project" पर click करें
   - Organization select करें
   - Project name: `top-10-habits-mlm`
   - Database password: एक strong password रखें (save कर लें)
   - Region: `Southeast Asia (Singapore)` select करें
   - "Create new project" पर click करें

3. **Database Setup:**
   - Project dashboard में जाएं
   - Left sidebar में "SQL Editor" पर click करें
   - `supabase/migrations/20250619181045_shy_silence.sql` file का content copy करें
   - SQL Editor में paste करें और "RUN" पर click करें

4. **API Keys निकालें:**
   - Left sidebar में "Settings" → "API" पर जाएं
   - `Project URL` और `anon public` key copy करें

### Step 2: Environment Variables Setup

`.env` file बनाएं project root में:

```env
VITE_SUPABASE_URL=your_supabase_project_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### Step 3: Netlify पर Deploy करें

1. **Netlify Account:**
   - https://netlify.com पर जाएं
   - GitHub से sign up करें

2. **GitHub Repository बनाएं:**
   - GitHub पर new repository बनाएं
   - Repository name: `top-10-habits-mlm`
   - Public रखें
   - Code upload करें

3. **Netlify से Connect:**
   - Netlify dashboard में "Add new site" → "Import an existing project"
   - GitHub select करें
   - Repository select करें
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`
   - Environment variables add करें (Step 2 वाले)
   - "Deploy site" पर click करें

### Step 4: Custom Domain Setup (Optional)

1. **Domain खरीदें:**
   - GoDaddy, Namecheap, या कोई भी domain provider से
   - Example: `yoursite.com`

2. **Netlify में Domain Add करें:**
   - Site settings → Domain management
   - "Add custom domain"
   - Domain name enter करें
   - DNS settings update करें (Netlify guide follow करें)

### Step 5: Admin Access Setup

**Default Admin Login:**
- Phone: `admin`
- Password: `admin123`

**Admin Functions:**
- User activation/deactivation
- Commission distribution
- Recharge request management
- User management

### Step 6: Payment QR Code Setup

1. **QR Code Image:**
   - `public/qr-code.png` में आपका payment QR code रखें
   - Size: 300x300 pixels recommended
   - Format: PNG

2. **Payment Details Update:**
   - UPI ID या payment details QR code में embed करें
   - Users को UTR number submit करने को कहें

### Step 7: Testing Checklist

**Registration Flow:**
- [ ] New user registration with referral code
- [ ] Unique referral code generation (00001, 00002, etc.)
- [ ] Phone number validation
- [ ] Duplicate registration prevention

**Payment Flow:**
- [ ] QR code display
- [ ] UTR number submission
- [ ] Admin activation panel
- [ ] Commission distribution (25%, 15%, 10%, etc.)

**Wallet & Recharge:**
- [ ] Wallet balance display
- [ ] Mobile recharge requests
- [ ] Admin recharge processing
- [ ] Balance deduction

**Admin Panel:**
- [ ] User management
- [ ] Activation requests
- [ ] Recharge requests
- [ ] Commission tracking

### Step 8: Security Measures

**Database Security:**
- Row Level Security (RLS) enabled
- User-specific data access
- Admin-only functions protected

**Frontend Security:**
- Environment variables properly configured
- No sensitive data in client-side code
- Secure authentication flow

### Step 9: Monitoring & Maintenance

**Regular Tasks:**
- Monitor user registrations
- Process activation requests promptly
- Handle recharge requests
- Check commission distributions
- Monitor wallet balances

**Backup Strategy:**
- Supabase automatically backs up data
- Export important data regularly
- Keep environment variables secure

### Step 10: Launch Checklist

**Pre-Launch:**
- [ ] Database properly set up
- [ ] All migrations run successfully
- [ ] Admin account working
- [ ] Test user registration
- [ ] Test payment flow
- [ ] Test commission system
- [ ] Test recharge system

**Post-Launch:**
- [ ] Monitor error logs
- [ ] Check user feedback
- [ ] Process activation requests
- [ ] Handle support queries

## 🔧 Technical Support

**Common Issues:**

1. **Database Connection Error:**
   - Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
   - Verify Supabase project is active

2. **Migration Errors:**
   - Run migrations one by one
   - Check SQL syntax
   - Verify table permissions

3. **Deployment Issues:**
   - Check build logs in Netlify
   - Verify environment variables
   - Check for TypeScript errors

**Contact Information:**
- For technical issues, check browser console
- For database issues, check Supabase logs
- For deployment issues, check Netlify build logs

## 📱 User Guide

**For End Users:**
1. Register with referral code (first user uses ADMIN001)
2. Get unique referral code after registration
3. Pay ₹100 via QR code
4. Submit UTR number
5. Wait for admin activation
6. Start referring others
7. Earn commissions in wallet
8. Use wallet for mobile recharge

**Commission Structure:**
- Level 1: 25% (₹25)
- Level 2: 15% (₹15)
- Level 3: 10% (₹10)
- Level 4: 8% (₹8)
- Level 5: 6% (₹6)
- Level 6: 5% (₹5)
- Level 7: 4% (₹4)
- Level 8: 3% (₹3)
- Level 9: 2% (₹2)
- Level 10: 1% (₹1)

## 🎯 Success Metrics

**Track These KPIs:**
- Total registrations
- Activation rate
- Commission payouts
- Recharge requests
- User retention
- Revenue generation

---

**🚀 Ready for Production!**

Follow these steps carefully और आपका MLM platform production में ready हो जाएगा। किसी भी step में problem हो तो detailed error message share करें।