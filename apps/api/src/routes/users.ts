import { FastifyInstance } from 'fastify';
import { getMeHandler, updateMeHandler, changePasswordHandler } from './users-handlers';

export default async function userRoutes(fastify: FastifyInstance) {
  // 获取当前用户信息
  fastify.get('/me', {
    preHandler: async (request: any, reply: any) => {
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
    },
    schema: {
      description: '获取当前用户信息',
      tags: ['Users'],
      headers: {
        type: 'object',
        properties: {
          Authorization: { type: 'string' },
        },
        required: ['Authorization'],
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                email: { type: 'string' },
                username: { type: 'string' },
                profile: {
                  type: 'object',
                  properties: {
                    firstName: { type: 'string' },
                    lastName: { type: 'string' },
                    bio: { type: 'string' },
                  },
                },
                createdAt: { type: 'string' },
                updatedAt: { type: 'string' },
              },
            },
          },
        },
      },
    },
  }, getMeHandler);

  // 更新当前用户信息
  fastify.put('/me', {
    preHandler: async (request: any, reply: any) => {
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
    },
    schema: {
      description: '更新当前用户信息',
      tags: ['Users'],
      headers: {
        type: 'object',
        properties: {
          Authorization: { type: 'string' },
        },
        required: ['Authorization'],
      },
      body: {
        type: 'object',
        properties: {
          profile: {
            type: 'object',
            properties: {
              firstName: { type: 'string', minLength: 1, maxLength: 50 },
              lastName: { type: 'string', minLength: 1, maxLength: 50 },
              bio: { type: 'string', maxLength: 500 },
            },
          },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                email: { type: 'string' },
                username: { type: 'string' },
                profile: {
                  type: 'object',
                  properties: {
                    firstName: { type: 'string' },
                    lastName: { type: 'string' },
                    bio: { type: 'string' },
                  },
                },
                createdAt: { type: 'string' },
                updatedAt: { type: 'string' },
              },
            },
          },
        },
      },
    },
  }, updateMeHandler);

  // 修改密码
  fastify.put('/me/password', {
    preHandler: async (request: any, reply: any) => {
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
    },
    schema: {
      description: '修改当前用户密码',
      tags: ['Users'],
      headers: {
        type: 'object',
        properties: {
          Authorization: { type: 'string' },
        },
        required: ['Authorization'],
      },
      body: {
        type: 'object',
        properties: {
          currentPassword: { type: 'string' },
          newPassword: { type: 'string', minLength: 8 },
        },
        required: ['currentPassword', 'newPassword'],
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                message: { type: 'string' },
              },
            },
          },
        },
      },
    },
  }, changePasswordHandler);
}