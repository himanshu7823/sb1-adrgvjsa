# 🚀 Production Deployment Guide

## Quick Start (5 मिनट में deploy करें)

### 1. Supabase Setup
```bash
1. https://supabase.com पर account बनाएं
2. New Project बनाएं
3. SQL Editor में migration file run करें
4. API keys copy करें
```

### 2. Environment Variables
```bash
# .env file बनाएं
VITE_SUPABASE_URL=your_url_here
VITE_SUPABASE_ANON_KEY=your_key_here
```

### 3. Netlify Deploy
```bash
1. GitHub पर code push करें
2. Netlify से GitHub connect करें
3. Environment variables add करें
4. Deploy करें
```

## Detailed Steps

### Supabase Database Setup

1. **Account Creation:**
   - Visit: https://supabase.com
   - Click "Start your project"
   - Sign up with GitHub/Google

2. **Project Creation:**
   - Click "New Project"
   - Name: `top-10-habits-mlm`
   - Password: Create strong password (save it!)
   - Region: Singapore (closest to India)
   - Click "Create new project"

3. **Database Migration:**
   - Go to SQL Editor
   - Copy content from `supabase/migrations/20250619181045_shy_silence.sql`
   - Paste and click "RUN"
   - Wait for success message

4. **Get API Keys:**
   - Go to Settings → API
   - Copy "Project URL" and "anon public" key

### Environment Setup

Create `.env` file in project root:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### GitHub Repository

1. Create new repository on GitHub
2. Upload your project files
3. Make sure `.env` is in `.gitignore`

### Netlify Deployment

1. **Connect to Netlify:**
   - Visit: https://netlify.com
   - Sign up with GitHub
   - Click "Add new site" → "Import an existing project"
   - Choose GitHub and select your repository

2. **Build Settings:**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: 18

3. **Environment Variables:**
   - Go to Site settings → Environment variables
   - Add your Supabase URL and key

4. **Deploy:**
   - Click "Deploy site"
   - Wait for build to complete
   - Your site will be live!

### Custom Domain (Optional)

1. Buy domain from GoDaddy/Namecheap
2. In Netlify: Site settings → Domain management
3. Add custom domain
4. Update DNS settings as instructed

## Admin Access

**Default Admin Login:**
- Phone: `admin`
- Password: `admin123`

**Change Admin Password:**
1. Login as admin
2. Go to Profile section
3. Update password

## Testing Your Deployment

### User Flow Test:
1. Register new user with referral code `ADMIN001`
2. Check if unique referral code is generated
3. Test payment flow with QR code
4. Submit UTR number
5. Login as admin and activate user
6. Check commission distribution

### Admin Flow Test:
1. Login as admin
2. Check activation requests
3. Activate a user
4. Verify commission distribution
5. Test recharge request processing

## Monitoring & Maintenance

### Daily Tasks:
- Check activation requests
- Process recharge requests
- Monitor user registrations
- Handle support queries

### Weekly Tasks:
- Review commission payouts
- Check system performance
- Update QR code if needed
- Backup important data

### Monthly Tasks:
- Analyze user growth
- Review revenue metrics
- Plan system improvements
- Update documentation

## Troubleshooting

### Common Issues:

**Database Connection Error:**
- Verify Supabase URL and key
- Check if project is active
- Ensure migration ran successfully

**Build Failures:**
- Check Node.js version (use 18+)
- Verify all dependencies installed
- Check for TypeScript errors

**Login Issues:**
- Clear browser cache
- Check network connection
- Verify database is accessible

**Commission Not Working:**
- Check referral chain in database
- Verify activation status
- Check commission calculation logic

## Security Checklist

- [ ] Environment variables properly set
- [ ] Database RLS policies active
- [ ] Admin access secured
- [ ] No sensitive data in frontend
- [ ] HTTPS enabled (automatic with Netlify)
- [ ] Regular backups configured

## Performance Optimization

- [ ] Images optimized
- [ ] CSS/JS minified (automatic)
- [ ] CDN enabled (automatic with Netlify)
- [ ] Database queries optimized
- [ ] Caching configured

## Support & Updates

### Getting Help:
1. Check browser console for errors
2. Review Supabase logs
3. Check Netlify build logs
4. Review this documentation

### Regular Updates:
1. Keep dependencies updated
2. Monitor security advisories
3. Update content as needed
4. Improve user experience

---

**🎉 Congratulations!** 

Your MLM platform is now live and ready for users. Share your website URL and start growing your network!

**Next Steps:**
1. Test all functionality thoroughly
2. Create user documentation
3. Plan marketing strategy
4. Monitor and optimize performance