const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('开始数据库种子数据初始化...');
  
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

  console.log('创建测试用户:', testUser.email);
  console.log('数据库种子数据初始化完成!');
}

main().catch(console.error).finally(() => prisma.$disconnect());