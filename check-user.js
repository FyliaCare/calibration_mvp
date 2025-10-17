// Quick script to check user data in database
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./calibration.db');

console.log('📊 Checking user data in database...\n');

db.all('SELECT * FROM users', [], (err, users) => {
  if (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
  
  console.log(`Found ${users.length} users:\n`);
  users.forEach((user, index) => {
    console.log(`User ${index + 1}:`);
    console.log(`  ID: ${user.id}`);
    console.log(`  Email: ${user.email}`);
    console.log(`  Full Name: ${user.full_name}`);
    console.log(`  Job Title: ${user.job_title || 'N/A'}`);
    console.log(`  Role: ${user.role}`);
    console.log(`  Company: ${user.company_name || 'N/A'}`);
    console.log(`  Lab Code: ${user.lab_code || 'N/A'}`);
    console.log(`  Columns: ${Object.keys(user).join(', ')}`);
    console.log('');
  });
  
  db.close();
});
