#!/usr/bin/env node

/**
 * Generate secure random secrets for JWT tokens
 * Run this script and copy the output to your Render environment variables
 */

const crypto = require('crypto');

console.log('\n🔐 JWT Secret Generator for Render Deployment\n');
console.log('='.repeat(60));
console.log('\n📋 Copy these values to your Render environment variables:\n');

const accessSecret = crypto.randomBytes(64).toString('hex');
const refreshSecret = crypto.randomBytes(64).toString('hex');

console.log('JWT_ACCESS_SECRET=');
console.log(accessSecret);
console.log('\nJWT_REFRESH_SECRET=');
console.log(refreshSecret);

console.log('\n' + '='.repeat(60));
console.log('\n✅ Secrets generated successfully!');
console.log('\n📌 Next steps:');
console.log('1. Go to Render Dashboard → Your Backend Service');
console.log('2. Navigate to Environment tab');
console.log('3. Add these two environment variables');
console.log('4. Save and redeploy\n');
