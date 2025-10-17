// Update admin user to E. Mensah
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./calibration.db');

console.log('📝 Updating admin user to E. Mensah...\n');

const updates = {
  full_name: 'E. Mensah',
  job_title: 'Laboratory Manager',
  department: 'Calibration Services',
  phone: '+233 24 123 4567',
  lab_code: 'IGL-001'
};

db.run(`
  UPDATE users 
  SET full_name = ?,
      job_title = ?,
      department = ?,
      phone = ?,
      lab_code = ?,
      updated_at = datetime('now')
  WHERE id = 1
`, [updates.full_name, updates.job_title, updates.department, updates.phone, updates.lab_code], function(err) {
  if (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
  
  console.log(`✅ Updated ${this.changes} user(s)\n`);
  
  // Verify the update
  db.get('SELECT id, email, full_name, job_title, department, phone, lab_code FROM users WHERE id = 1', [], (err, user) => {
    if (err) {
      console.error('❌ Error verifying:', err.message);
      process.exit(1);
    }
    
    console.log('Updated user details:');
    console.log(`  ID: ${user.id}`);
    console.log(`  Email: ${user.email}`);
    console.log(`  Full Name: ${user.full_name}`);
    console.log(`  Job Title: ${user.job_title}`);
    console.log(`  Department: ${user.department}`);
    console.log(`  Phone: ${user.phone}`);
    console.log(`  Lab Code: ${user.lab_code}`);
    console.log('\n✅ All done! Please refresh your browser (Ctrl+F5) to see the changes.');
    
    db.close();
  });
});
