// 简单数据库连接测试
import { PrismaClient } from '@prisma/client';

async function testDatabase() {
  const prisma = new PrismaClient();

  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');

    // 检查现有用户数量
    const userCount = await prisma.user.count();
    console.log('✅ Existing users:', userCount);

    // 测试原始SQL查询
    const result = await prisma.$queryRaw`SELECT name FROM sqlite_master WHERE type='table'`;
    console.log('✅ Tables in database:', result);

    console.log('🎉 Basic database operations successful!');
  } catch (error) {
    console.error('❌ Database test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();