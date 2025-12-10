import { FastifyInstance } from 'fastify';
import { healthCheckHandler, systemInfoHandler } from './system-handlers';

export default async function systemRoutes(fastify: FastifyInstance) {
  // 健康检查
  fastify.get('/health', {
    schema: {
      description: '系统健康检查',
      tags: ['System'],
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                status: { type: 'string' },
                timestamp: { type: 'string' },
                version: { type: 'string' },
                uptime: { type: 'number' },
                services: {
                  type: 'object',
                  properties: {
                    database: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
    },
  }, healthCheckHandler);

  // 系统信息
  fastify.get('/info', {
    schema: {
      description: '获取系统信息',
      tags: ['System'],
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                version: { type: 'string' },
                environment: { type: 'string' },
                features: {
                  type: 'object',
                  properties: {
                    registration: { type: 'boolean' },
                    emailVerification: { type: 'boolean' },
                    fileUpload: { type: 'boolean' },
                  },
                },
              },
            },
          },
        },
      },
    },
  }, systemInfoHandler);
}