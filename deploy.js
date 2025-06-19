const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Production Deployment...\n');

// Check if .env file exists
if (!fs.existsSync('.env')) {
  console.log('❌ .env file not found!');
  console.log('Please create .env file with your Supabase credentials:');
  console.log('VITE_SUPABASE_URL=your_supabase_url');
  console.log('VITE_SUPABASE_ANON_KEY=your_supabase_key');
  process.exit(1);
}

try {
  // Build the project
  console.log('📦 Building project...');
  execSync('npm run build', { stdio: 'inherit' });
  
  console.log('✅ Build completed successfully!');
  console.log('\n🎉 Your MLM Platform is ready for deployment!');
  console.log('\nNext steps:');
  console.log('1. Upload the "dist" folder to your hosting provider');
  console.log('2. Or use Netlify drag-and-drop deployment');
  console.log('3. Set up your Supabase database using the migration file');
  console.log('\nAdmin Login:');
  console.log('Phone: admin');
  console.log('Password: admin123');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}