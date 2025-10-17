// Rebrand entire platform from Intertek to CalPro
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./calibration.db');

console.log('🎨 Rebranding Platform to CalPro...\n');

db.serialize(() => {
  // Update admin user to generic name
  db.run(`
    UPDATE users 
    SET full_name = 'John Doe',
        email = 'admin@calpro.com',
        company_name = 'CalPro Calibration Services',
        phone = '+1 (555) 123-4567'
    WHERE id = 1
  `, (err) => {
    if (err) {
      console.error('❌ Error updating admin:', err);
    } else {
      console.log('✅ Admin user updated to generic data');
      console.log('   Name: John Doe');
      console.log('   Email: admin@calpro.com');
      console.log('   Company: CalPro Calibration Services\n');
    }
  });

  // Update equipment responsible persons
  db.run(`
    UPDATE equipment 
    SET responsible_person = 'John Doe',
        department = 'Calibration Lab',
        location = 'Main Laboratory'
    WHERE responsible_person LIKE '%Mensah%' OR responsible_person LIKE '%E.%'
  `, function(err) {
    if (err) {
      console.error('❌ Error updating equipment:', err);
    } else {
      console.log(`✅ Updated ${this.changes} equipment records with generic data\n`);
    }
    
    db.close(() => {
      console.log('✅ Database rebranding complete!');
      console.log('\n📋 Next Steps:');
      console.log('   1. Update .env file with new company details');
      console.log('   2. Replace logos in public/images/');
      console.log('   3. Restart server\n');
    });
  });
});
