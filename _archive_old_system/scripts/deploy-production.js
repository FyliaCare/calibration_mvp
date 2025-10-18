#!/usr/bin/env node
/**
 * Quick Production Deploy Script
 * Deploys CalPro to Railway (backend) and Netlify (frontend)
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 CalPro Production Deployment\n');

// Check if required tools are installed
function checkRequirements() {
  const requirements = [
    { cmd: 'railway', install: 'npm install -g @railway/cli' },
    { cmd: 'netlify', install: 'npm install -g netlify-cli' }
  ];

  requirements.forEach(req => {
    try {
      execSync(`${req.cmd} --version`, { stdio: 'ignore' });
      console.log(`✅ ${req.cmd} CLI installed`);
    } catch (error) {
      console.log(`❌ ${req.cmd} CLI not found`);
      console.log(`   Install with: ${req.install}\n`);
      process.exit(1);
    }
  });
}

// Deploy backend to Railway
function deployBackend() {
  console.log('\n📦 Deploying Backend to Railway...');
  
  try {
    process.chdir(path.join(__dirname, '../backend'));
    
    // Initialize Railway project if needed
    try {
      execSync('railway status', { stdio: 'ignore' });
    } catch {
      console.log('🔧 Initializing Railway project...');
      execSync('railway init', { stdio: 'inherit' });
    }
    
    // Deploy
    console.log('🚀 Deploying to Railway...');
    execSync('railway up', { stdio: 'inherit' });
    
    // Get domain
    const domain = execSync('railway domain', { encoding: 'utf8' }).trim();
    console.log(`✅ Backend deployed: ${domain}`);
    
    return domain;
  } catch (error) {
    console.error('❌ Backend deployment failed:', error.message);
    process.exit(1);
  }
}

// Update netlify.toml with backend URL
function updateNetlifyConfig(backendUrl) {
  console.log('\n🔧 Updating Netlify configuration...');
  
  const netlifyPath = path.join(__dirname, '../netlify.toml');
  let content = fs.readFileSync(netlifyPath, 'utf8');
  
  // Update the API redirect URL
  content = content.replace(
    /to = "https:\/\/your-backend-url\.railway\.app\/api\/:splat"/,
    `to = "${backendUrl}/api/:splat"`
  );
  
  fs.writeFileSync(netlifyPath, content);
  console.log('✅ Netlify configuration updated');
}

// Deploy frontend to Netlify
function deployFrontend() {
  console.log('\n🌐 Deploying Frontend to Netlify...');
  
  try {
    process.chdir(path.join(__dirname, '..'));
    
    // Initialize Netlify site if needed
    try {
      execSync('netlify status', { stdio: 'ignore' });
    } catch {
      console.log('🔧 Initializing Netlify site...');
      execSync('netlify init', { stdio: 'inherit' });
    }
    
    // Deploy
    console.log('🚀 Deploying to Netlify...');
    execSync('netlify deploy --prod --dir=public', { stdio: 'inherit' });
    
    console.log('✅ Frontend deployed successfully');
  } catch (error) {
    console.error('❌ Frontend deployment failed:', error.message);
    process.exit(1);
  }
}

// Main deployment flow
async function deploy() {
  console.log('Checking requirements...');
  checkRequirements();
  
  const backendUrl = deployBackend();
  updateNetlifyConfig(backendUrl);
  deployFrontend();
  
  console.log('\n🎉 Deployment Complete!');
  console.log(`\n📍 Your CalPro system is now live:`);
  console.log(`   Backend: ${backendUrl}`);
  console.log(`   Frontend: Check Netlify dashboard for URL`);
  console.log(`\n📖 Next steps:`);
  console.log(`   1. Set up custom domain (optional)`);
  console.log(`   2. Configure monitoring`);
  console.log(`   3. Set up backups`);
  console.log(`\n📚 See DEPLOYMENT_CHECKLIST.md for more details`);
}

// Run deployment
deploy().catch(error => {
  console.error('❌ Deployment failed:', error);
  process.exit(1);
});