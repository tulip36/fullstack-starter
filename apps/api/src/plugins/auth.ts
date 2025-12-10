import { FastifyInstance } from 'fastify';
import jwt from '@fastify/jwt';
import { config } from '../config/app';

export async function authPlugin(fastify: FastifyInstance) {
  await fastify.register(jwt, {
    secret: config.jwt.secret,
  });

  // 添加认证装饰器
  fastify.decorate('authenticate', async (request: any, reply: any) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.code(401).send({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: '未授权访问',
        },
        meta: {
          timestamp: new Date().toISOString(),
          requestId: request.id,
          version: 'v1',
        },
      });
    }
  });
}

// 声明模块类型
declare module 'fastify' {
  export interface FastifyInstance {
    authenticate(): Promise<void>;
  }
}

declare module '@fastify/jwt' {
  export interface FastifyJWT {
    payload: { userId: string; email: string; username: string };
    user: { userId: string; email: string; username: string };
  }
}