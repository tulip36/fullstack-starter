import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import multipart from '@fastify/multipart';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';

import { config } from './config/app';
import { databasePlugin } from './plugins/database';
import { authPlugin } from './plugins/auth';
import { errorHandler } from './middleware/error';
import { logger } from './utils/logger';

const server: FastifyInstance = Fastify({
  logger: {
    level: config.log.level,
    file: config.log.file,
  },
});

// 注册插件
async function registerPlugins() {
  console.log('注册安全插件...');
  // 安全插件
  await server.register(helmet);
  await server.register(cors, {
    origin: true,
    credentials: true,
  });
  await server.register(rateLimit, {
    max: 100,
    timeWindow: '15 minutes',
  });

  // 文件上传
  await server.register(multipart, {
    limits: {
      fileSize: config.upload.maxFileSize,
    },
  });

  console.log('注册API文档...');
  // API文档
  await server.register(swagger, {
    swagger: {
      info: {
        title: 'Monorepo Bootstrap API',
        description: '通用前后端分离Monorepo系统API文档',
        version: '1.0.0',
      },
      host: 'localhost:3002',
      schemes: ['http'],
      consumes: ['application/json'],
      produces: ['application/json'],
    },
  });

  await server.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false,
    },
  });

  console.log('注册数据库和认证插件...');
  // 数据库和认证
  await server.register(databasePlugin);
  await server.register(authPlugin);

  console.log('注册路由...');
  // 手动注册路由而不是使用autoload
  const { default: authRoutes } = await import('./routes/auth.js');
  const { default: userRoutes } = await import('./routes/users.js');
  const { default: systemRoutes } = await import('./routes/system.js');

  console.log('注册auth路由...');
  await server.register(authRoutes, { prefix: '/api/v1/auth' });
  console.log('注册user路由...');
  await server.register(userRoutes, { prefix: '/api/v1/users' });
  console.log('注册system路由...');
  await server.register(systemRoutes, { prefix: '/api/v1/system' });
  console.log('路由注册完成');
}

// 错误处理
server.setErrorHandler(errorHandler);

// 启动服务器
async function start() {
  try {
    console.log('开始注册插件...');
    await registerPlugins();
    console.log('插件注册完成');

    console.log(`尝试启动服务器在端口 ${config.port}...`);
    await server.listen({
      port: config.port,
      host: '0.0.0.0',
    });

    logger.info(`🚀 服务器启动成功！`);
    logger.info(`📍 地址: http://localhost:${config.port}`);
    logger.info(`📚 API文档: http://localhost:${config.port}/docs`);
  } catch (err) {
    console.error('服务器启动失败:', err);
    logger.error('服务器启动失败:', err);
    process.exit(1);
  }
}

// 优雅关闭
process.on('SIGINT', async () => {
  logger.info('收到SIGINT信号，正在关闭服务器...');
  await server.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logger.info('收到SIGTERM信号，正在关闭服务器...');
  await server.close();
  process.exit(0);
});

// 启动应用
start();