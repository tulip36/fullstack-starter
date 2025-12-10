import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  datasources: {
    db: {
      url: 'file:/home/learn/codes/starter/packages/database/prisma/data/app.db',
    },
  },
});

export async function databasePlugin(fastify: FastifyInstance) {
  // 测试数据库连接
  try {
    await prisma.$connect();
    fastify.log.info('✅ 数据库连接成功');
  } catch (error) {
    fastify.log.error('❌ 数据库连接失败:', error);
    throw error;
  }

  // 优雅关闭时断开数据库连接
  fastify.addHook('onClose', async () => {
    await prisma.$disconnect();
    fastify.log.info('🔌 数据库连接已断开');
  });

  // 将Prisma实例添加到fastify实例
  fastify.decorate('db', prisma);
}

// 声明模块类型
declare module 'fastify' {
  export interface FastifyInstance {
    db: typeof prisma;
  }
}