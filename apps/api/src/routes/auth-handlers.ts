import { FastifyRequest, FastifyReply } from 'fastify';
import { AuthService } from '../services/auth.service';
import { createAuditLog } from '@monorepo/database';

// 临时定义验证模式
const registerSchema = {
  parse: (data: any) => {
    if (!data.email || !data.username || !data.password || !data.firstName || !data.lastName) {
      throw new Error('缺少必要字段');
    }
    return data;
  }
};

const loginSchema = {
  parse: (data: any) => {
    if (!data.email || !data.password) {
      throw new Error('缺少必要字段');
    }
    return data;
  }
};

const refreshTokenSchema = {
  parse: (data: any) => {
    if (!data.refreshToken) {
      throw new Error('缺少refreshToken');
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
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  NOT_FOUND: 'NOT_FOUND',
};

const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  CONFLICT: 409,
};

// 用户注册
export async function registerHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const body = registerSchema.parse(request.body);
  const db = (request.server as any).db;

  // 检查用户是否已存在
  const existingUser = await db.user.findFirst({
    where: {
      OR: [
        { email: body.email },
        { username: body.username },
      ],
    },
  });

  if (existingUser) {
    const field = existingUser.email === body.email ? 'email' : 'username';
    return reply.status(HTTP_STATUS.CONFLICT).send(
      createErrorResponse({
        code: ERROR_CODES.ALREADY_EXISTS,
        message: field === 'email' ? '邮箱已被注册' : '用户名已被使用',
      })
    );
  }

  // 创建用户
  const hashedPassword = await AuthService.hashPassword(body.password);

  const user = await db.user.create({
    data: {
      email: body.email,
      username: body.username,
      password: hashedPassword,
      profile: {
        create: {
          firstName: body.firstName,
          lastName: body.lastName,
        },
      },
    },
    include: {
      profile: true,
    },
  });

  // 生成tokens
  const tokens = AuthService.generateTokens({
    userId: user.id,
    email: user.email,
    username: user.username,
  });

  // 创建审计日志
  await createAuditLog(
    user.id,
    'USER_REGISTER',
    'User',
    { email: user.email, username: user.username },
    request.ip,
    request.headers['user-agent']
  );

  const response = createSuccessResponse({
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      profile: user.profile,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    },
    tokens,
  });

  return reply.status(HTTP_STATUS.CREATED).send(response);
}

// 用户登录
export async function loginHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const body = loginSchema.parse(request.body);
  const db = (request.server as any).db;

  // 查找用户
  const user = await db.user.findUnique({
    where: { email: body.email },
    include: { profile: true },
  });

  if (!user) {
    return reply.status(HTTP_STATUS.UNAUTHORIZED).send(
      createErrorResponse({
        code: ERROR_CODES.INVALID_CREDENTIALS,
        message: '邮箱或密码错误',
      })
    );
  }

  // 验证密码
  const isValidPassword = await AuthService.verifyPassword(body.password, user.password);
  if (!isValidPassword) {
    return reply.status(HTTP_STATUS.UNAUTHORIZED).send(
      createErrorResponse({
        code: ERROR_CODES.INVALID_CREDENTIALS,
        message: '邮箱或密码错误',
      })
    );
  }

  // 生成tokens
  const tokens = AuthService.generateTokens({
    userId: user.id,
    email: user.email,
    username: user.username,
  });

  // 创建审计日志
  await createAuditLog(
    user.id,
    'USER_LOGIN',
    'User',
    { email: user.email },
    request.ip,
    request.headers['user-agent']
  );

  const response = createSuccessResponse({
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      profile: user.profile,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    },
    tokens,
  });

  return reply.send(response);
}

// 刷新token
export async function refreshTokenHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const body = refreshTokenSchema.parse(request.body);
  const db = (request.server as any).db;

  try {
    // 验证refresh token
    const decoded = AuthService.verifyRefreshToken(body.refreshToken);

    // 查找用户
    const user = await db.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return reply.status(HTTP_STATUS.UNAUTHORIZED).send(
        createErrorResponse({
          code: ERROR_CODES.INVALID_CREDENTIALS,
          message: '无效的刷新令牌',
        })
      );
    }

    // 生成新的access token
    const newTokens = AuthService.generateTokens({
      userId: user.id,
      email: user.email,
      username: user.username,
    });

    const response = createSuccessResponse({
      accessToken: newTokens.accessToken,
      expiresIn: newTokens.expiresIn,
    });

    return reply.send(response);
  } catch (error) {
    return reply.status(HTTP_STATUS.UNAUTHORIZED).send(
      createErrorResponse({
        code: ERROR_CODES.TOKEN_EXPIRED,
        message: '刷新令牌已过期',
      })
    );
  }
}

// 用户登出
export async function logoutHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const user = (request as any).user;
  const db = (request.server as any).db;

  // 删除用户的refresh tokens
  await db.session.deleteMany({
    where: { userId: user.userId },
  });

  // 创建审计日志
  await createAuditLog(
    user.userId,
    'USER_LOGOUT',
    'User',
    { email: user.email },
    request.ip,
    request.headers['user-agent']
  );

  const response = createSuccessResponse({
    message: '登出成功',
  });

  return reply.send(response);
}