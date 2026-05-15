import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ── Create Admin User ───────────────────────────────────────────────────
  const existingAdmin = await prisma.adminUser.findUnique({
    where: { email: 'himanshupaliwalpbp@gmail.com' },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('Paliwal@2025', 12);
    await prisma.adminUser.create({
      data: {
        email: 'himanshupaliwalpbp@gmail.com',
        name: 'Himanshu Paliwal',
        passwordHash: hashedPassword,
        role: 'ADMIN',
        isActive: true,
        mfaEnabled: false,
      },
    });
    console.log('✅ Admin user created: himanshupaliwalpbp@gmail.com');
  } else {
    console.log('ℹ️ Admin user already exists');
  }

  // ── Create GA Setting ───────────────────────────────────────────────────
  const existingGA = await prisma.siteSetting.findUnique({
    where: { key: 'ga_measurement_id' },
  });

  if (!existingGA) {
    await prisma.siteSetting.create({
      data: {
        key: 'ga_measurement_id',
        value: 'G-WTQDXFZC5F',
        description: 'Google Analytics Measurement ID',
        updatedBy: 'system',
      },
    });
    console.log('✅ GA Measurement ID created: G-WTQDXFZC5F');
  } else {
    console.log('ℹ️ GA setting already exists');
  }

  // ── Create Site Settings ────────────────────────────────────────────────
  const settingsToCreate = [
    { key: 'site_name', value: 'Paliwal Secure', description: 'Site name' },
    { key: 'site_tagline', value: 'AI se Best Plan, Humse Easy Claim', description: 'Site tagline' },
  ];

  for (const setting of settingsToCreate) {
    const existing = await prisma.siteSetting.findUnique({
      where: { key: setting.key },
    });
    if (!existing) {
      await prisma.siteSetting.create({
        data: { ...setting, updatedBy: 'system' },
      });
      console.log(`✅ Setting created: ${setting.key}`);
    }
  }

  console.log('🎉 Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
