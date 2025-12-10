import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify';

// 临时定义函数和常量
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
  FORBIDDEN: 'FORBIDDEN',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',
  NOT_FOUND: 'NOT_FOUND',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',
  UPLOAD_FAILED: 'UPLOAD_FAILED',
};

const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

export function errorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) {
  request.log.error(error);

  // 验证错误
  if (error.validation) {
    return reply.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).send(
      createErrorResponse({
        code: ERROR_CODES.VALIDATION_ERROR,
        message: '请求参数验证失败',
        details: error.validation.map((err: any) => ({
          field: err.instancePath || err.path,
          message: err.message,
        })),
      })
    );
  }

  // JWT错误
  if (error.code === 'FST_JWT_NO_AUTHORIZATION_IN_HEADER') {
    return reply.status(HTTP_STATUS.UNAUTHORIZED).send(
      createErrorResponse({
        code: ERROR_CODES.UNAUTHORIZED,
        message: '缺少认证令牌',
      })
    );
  }

  if (error.code === 'FST_JWT_AUTHORIZATION_TOKEN_EXPIRED') {
    return reply.status(HTTP_STATUS.UNAUTHORIZED).send(
      createErrorResponse({
        code: ERROR_CODES.TOKEN_EXPIRED,
        message: '认证令牌已过期',
      })
    );
  }

  // 默认错误
  const statusCode = error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  const errorCode = statusCode >= 500 ? ERROR_CODES.INTERNAL_ERROR : ERROR_CODES.INVALID_INPUT;

  return reply.status(statusCode).send(
    createErrorResponse({
      code: errorCode,
      message: error.message || '服务器内部错误',
    })
  );
}