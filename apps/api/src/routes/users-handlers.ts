import { FastifyRequest, FastifyReply } from 'fastify';
import { AuthService } from '../services/auth.service';
import { createAuditLog } from '@monorepo/database';

// 临时定义验证模式
const updateUserSchema = {
  parse: (data: any) => data
};

const changePasswordSchema = {
  parse: (data: any) => {
    if (!data.currentPassword || !data.newPassword) {
      throw new Error('缺少必要字段');
    }
    return data;
  }
};

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

const createErrorResponse = (error: any) => ({
  success: false,
  error,
  meta: {
    timestamp: new Date().toISOString(),
    requestId: 'req_' + Date.now(),
    version: 'v1',
  },
});

const ERROR_CODES = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  NOT_FOUND: 'NOT_FOUND',
};

const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
};

// 获取当前用户信息
export async function getMeHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const user = (request as any).user;
  const db = (request.server as any).db;

  const userData = await db.user.findUnique({
    where: { id: user.userId },
    include: { profile: true },
  });

  if (!userData) {
    return reply.status(HTTP_STATUS.NOT_FOUND).send(
      createErrorResponse({
        code: ERROR_CODES.NOT_FOUND,
        message: '用户不存在',
      })
    );
  }

  const response = createSuccessResponse({
    id: userData.id,
    email: userData.email,
    username: userData.username,
    profile: userData.profile,
    createdAt: userData.createdAt.toISOString(),
    updatedAt: userData.updatedAt.toISOString(),
  });

  return reply.send(response);
}

// 更新用户信息
export async function updateMeHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const user = (request as any).user;
  const body = updateUserSchema.parse(request.body);
  const db = (request.server as any).db;

  // 更新用户档案
  const updatedUser = await db.user.update({
    where: { id: user.userId },
    data: {
      profile: body.profile ? {
        upsert: {
          create: body.profile,
          update: body.profile,
        },
      } : undefined,
    },
    include: { profile: true },
  });

  // 创建审计日志
  await createAuditLog(
    user.userId,
    'USER_UPDATE',
    'User',
    { updatedFields: Object.keys(body.profile || {}) },
    request.ip,
    request.headers['user-agent']
  );

  const response = createSuccessResponse({
    id: updatedUser.id,
    email: updatedUser.email,
    username: updatedUser.username,
    profile: updatedUser.profile,
    createdAt: updatedUser.createdAt.toISOString(),
    updatedAt: updatedUser.updatedAt.toISOString(),
  });

  return reply.send(response);
}

// 修改密码
export async function changePasswordHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const user = (request as any).user;
  const body = changePasswordSchema.parse(request.body);
  const db = (request.server as any).db;

  // 获取用户当前密码
  const userData = await db.user.findUnique({
    where: { id: user.userId },
    select: { password: true },
  });

  if (!userData) {
    return reply.status(HTTP_STATUS.NOT_FOUND).send(
      createErrorResponse({
        code: ERROR_CODES.NOT_FOUND,
        message: '用户不存在',
      })
    );
  }

  // 验证当前密码
  const isValidPassword = await AuthService.verifyPassword(
    body.currentPassword,
    userData.password
  );

  if (!isValidPassword) {
    return reply.status(HTTP_STATUS.UNAUTHORIZED).send(
      createErrorResponse({
        code: ERROR_CODES.INVALID_CREDENTIALS,
        message: '当前密码错误',
      })
    );
  }

  // 更新密码
  const hashedPassword = await AuthService.hashPassword(body.newPassword);
  await db.user.update({
    where: { id: user.userId },
    data: { password: hashedPassword },
  });

  // 创建审计日志
  await createAuditLog(
    user.userId,
    'PASSWORD_CHANGE',
    'User',
    {},
    request.ip,
    request.headers['user-agent']
  );

  const response = createSuccessResponse({
    message: '密码修改成功',
  });

  return reply.send(response);
}