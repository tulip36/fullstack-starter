import type { FastifyRequest, FastifyReply } from 'fastify';

// 临时定义响应函数
const createSuccessResponse = (data: any) => ({
  success: true,
  data,
  meta: {
    timestamp: new Date().toISOString(),
    requestId: 'req_' + Date.now(),
    version: 'v1',
  },
});

export async function healthCheckHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    // 检查数据库连接
    const db = (request.server as any).db;
    await db.$queryRaw`SELECT 1`;
    const dbStatus = 'healthy';

    const response = createSuccessResponse({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      uptime: process.uptime(),
      services: {
        database: dbStatus,
      },
    });

    return reply.send(response);
  } catch (error) {
    const response = createSuccessResponse({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      uptime: process.uptime(),
      services: {
        database: 'unhealthy',
      },
    });

    return reply.status(503).send(response);
  }
}

export async function systemInfoHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const response = createSuccessResponse({
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    features: {
      registration: true,
      emailVerification: false,
      fileUpload: true,
    },
  });

  return reply.send(response);
}