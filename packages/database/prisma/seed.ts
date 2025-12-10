import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('开始数据库种子数据初始化...');

  // 创建测试用户
  const hashedPassword = await bcrypt.hash('Password123', 12);
  
  const testUser = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      username: 'testuser',
      password: hashedPassword,
      profile: {
        create: {
          firstName: 'Test',
          lastName: 'User',
          bio: '这是一个测试用户',
        },
      },
    },
    include: {
      profile: true,
    },
  });

  console.log('创建测试用户:', testUser);

  // 创建系统设置
  const settings = [
    {
      key: 'app.name',
      value: 'Monorepo Bootstrap',
      type: 'string',
    },
    {
      key: 'app.description',
      value: '通用前后端分离Monorepo系统',
      type: 'string',
    },
    {
      key: 'auth.registration.enabled',
      value: 'true',
      type: 'boolean',
    },
    {
      key: 'auth.email.verification.enabled',
      value: 'false',
      type: 'boolean',
    },
    {
      key: 'upload.maxFileSize',
      value: '10485760', // 10MB
      type: 'number',
    },
  ];

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: setting,
      create: setting,
    });
  }

  console.log('创建系统设置完成');

  console.log('数据库种子数据初始化完成!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });