// 重新导出Prisma客户端和工具函数
export { default as prisma } from './client';
export type { PrismaClient } from '@prisma/client';

// 数据库工具函数
export const createAuditLog = async (
  userId: string | null,
  action: string,
  resource: string,
  details?: any,
  ipAddress?: string,
  userAgent?: string
) => {
  const { prisma } = await import('./client');
  
  return prisma.auditLog.create({
    data: {
      userId,
      action,
      resource,
      details,
      ipAddress,
      userAgent,
    },
  });
};

export const getSetting = async (key: string): Promise<string | null> => {
  const { prisma } = await import('./client');
  
  const setting = await prisma.setting.findUnique({
    where: { key },
  });
  
  return setting?.value || null;
};

export const setSetting = async (key: string, value: string, type = 'string'): Promise<void> => {
  const { prisma } = await import('./client');
  
  await prisma.setting.upsert({
    where: { key },
    update: { value, type },
    create: { key, value, type },
  });
};