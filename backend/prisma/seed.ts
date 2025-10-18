import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');
  
  // Create admin user
  const adminPassword = await bcrypt.hash('Admin@123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@calpro.com' },
    update: {},
    create: {
      email: 'admin@calpro.com',
      passwordHash: adminPassword,
      name: 'Admin User',
      role: 'ADMIN',
      isActive: true,
      emailVerified: true,
    },
  });
  
  console.log('✅ Created admin user:', admin.email);
  
  // Create sample client
  const client = await prisma.client.upsert({
    where: { id: 'sample-client' },
    update: {},
    create: {
      id: 'sample-client',
      companyName: 'Acme Corporation',
      contactName: 'John Smith',
      email: 'john@acme.com',
      phone: '555-0123',
      address: '123 Main St',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62701',
      industry: 'Manufacturing',
    },
  });
  
  console.log('✅ Created sample client:', client.companyName);
  
  // Create sample equipment
  const equipment = await prisma.equipment.create({
    data: {
      equipmentId: 'CAL-001',
      name: 'Digital Pressure Gauge',
      manufacturer: 'Fluke',
      model: '700G29',
      serialNumber: 'SN123456',
      category: 'PRESSURE',
      calibrationInterval: 365,
      status: 'ACTIVE',
      clientId: client.id,
      lastCalibrationDate: new Date('2024-01-15'),
      nextCalibrationDate: new Date('2025-01-15'),
    },
  });
  
  console.log('✅ Created sample equipment:', equipment.equipmentId);
  
  console.log('✅ Database seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
