# API设计文档

## API架构概述

本系统采用RESTful API设计，基于Fastify框架构建，提供类型安全、高性能的API服务。

### 核心设计原则
- **RESTful设计**：遵循REST架构风格
- **类型安全**：使用TypeScript和Zod进行类型验证
- **统一响应格式**：标准化的API响应结构
- **错误处理**：统一的错误处理和日志记录
- **版本控制**：API版本化管理
- **文档自动生成**：基于OpenAPI规范的自动文档

## API基础信息

### 基础URL
```
开发环境: http://localhost:3001/api/v1
生产环境: https://api.yourdomain.com/api/v1
```

### 认证方式
- **Bearer Token**: JWT Access Token
- **Cookie认证**: httpOnly cookies存储refresh token
- **API Key**: 第三方服务集成（可选）

### 请求头
```http
Content-Type: application/json
Authorization: Bearer <access_token>
Accept: application/json
User-Agent: <client_info>
```

## 统一响应格式

### 成功响应
```json
{
  "success": true,
  "data": {
    // 响应数据
  },
  "meta": {
    "timestamp": "2025-01-09T10:00:00Z",
    "requestId": "req_123456789",
    "version": "v1"
  }
}
```

### 分页响应
```json
{
  "success": true,
  "data": [
    // 数据列表
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5,
      "hasNext": true,
      "hasPrev": false
    },
    "timestamp": "2025-01-09T10:00:00Z",
    "requestId": "req_123456789",
    "version": "v1"
  }
}
```

### 错误响应
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "请求参数验证失败",
    "details": [
      {
        "field": "email",
        "message": "邮箱格式不正确"
      }
    ]
  },
  "meta": {
    "timestamp": "2025-01-09T10:00:00Z",
    "requestId": "req_123456789",
    "version": "v1"
  }
}
```

## API端点设计

### 1. 认证模块 (/auth)

#### 用户注册
```http
POST /api/v1/auth/register
```

**请求体**:
```json
{
  "email": "user@example.com",
  "username": "username",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "username": "username",
      "profile": {
        "firstName": "John",
        "lastName": "Doe"
      }
    },
    "tokens": {
      "accessToken": "access_token_here",
      "refreshToken": "refresh_token_here",
      "expiresIn": 3600
    }
  }
}
```

#### 用户登录
```http
POST /api/v1/auth/login
```

**请求体**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**响应**: 同注册响应

#### 刷新Token
```http
POST /api/v1/auth/refresh
```

**请求体**:
```json
{
  "refreshToken": "refresh_token_here"
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "accessToken": "new_access_token",
    "expiresIn": 3600
  }
}
```

#### 用户登出
```http
POST /api/v1/auth/logout
```

**响应**:
```json
{
  "success": true,
  "data": {
    "message": "登出成功"
  }
}
```

### 2. 用户模块 (/users)

#### 获取当前用户信息
```http
GET /api/v1/users/me
```

**响应**:
```json
{
  "success": true,
  "data": {
    "id": "user_123",
    "email": "user@example.com",
    "username": "username",
    "profile": {
      "firstName": "John",
      "lastName": "Doe",
      "avatar": "https://example.com/avatar.jpg",
      "bio": "用户简介"
    },
    "createdAt": "2025-01-09T10:00:00Z",
    "updatedAt": "2025-01-09T10:00:00Z"
  }
}
```

#### 更新用户信息
```http
PUT /api/v1/users/me
```

**请求体**:
```json
{
  "profile": {
    "firstName": "John",
    "lastName": "Smith",
    "bio": "更新后的简介"
  }
}
```

#### 更改密码
```http
PUT /api/v1/users/me/password
```

**请求体**:
```json
{
  "currentPassword": "old_password",
  "newPassword": "new_password"
}
```

#### 上传头像
```http
POST /api/v1/users/me/avatar
Content-Type: multipart/form-data
```

**请求体**:
```
avatar: <file>
```

**响应**:
```json
{
  "success": true,
  "data": {
    "avatar": "https://example.com/avatars/user_123.jpg"
  }
}
```

### 3. 文件上传模块 (/upload)

#### 上传文件
```http
POST /api/v1/upload
Content-Type: multipart/form-data
```

**请求体**:
```
file: <file>
type: "image" | "document" | "video"
```

**响应**:
```json
{
  "success": true,
  "data": {
    "id": "file_123",
    "filename": "document.pdf",
    "originalName": "my-document.pdf",
    "mimeType": "application/pdf",
    "size": 1024000,
    "url": "https://example.com/files/document.pdf",
    "createdAt": "2025-01-09T10:00:00Z"
  }
}
```

#### 获取文件信息
```http
GET /api/v1/upload/:fileId
```

#### 删除文件
```http
DELETE /api/v1/upload/:fileId
```

### 4. 系统模块 (/system)

#### 健康检查
```http
GET /api/v1/system/health
```

**响应**:
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2025-01-09T10:00:00Z",
    "version": "1.0.0",
    "uptime": 3600,
    "services": {
      "database": "healthy",
      "redis": "healthy",
      "storage": "healthy"
    }
  }
}
```

#### 系统信息
```http
GET /api/v1/system/info
```

**响应**:
```json
{
  "success": true,
  "data": {
    "version": "1.0.0",
    "environment": "production",
    "features": {
      "registration": true,
      "emailVerification": false,
      "fileUpload": true
    }
  }
}
```

## 数据验证

### Zod Schema定义

#### 用户注册Schema
```typescript
import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('邮箱格式不正确'),
  username: z.string()
    .min(3, '用户名至少3个字符')
    .max(20, '用户名最多20个字符')
    .regex(/^[a-zA-Z0-9_]+$/, '用户名只能包含字母、数字和下划线'),
  password: z.string()
    .min(8, '密码至少8个字符')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, '密码必须包含大小写字母和数字'),
  firstName: z.string().min(1, '名字不能为空').max(50, '名字最多50个字符'),
  lastName: z.string().min(1, '姓氏不能为空').max(50, '姓氏最多50个字符'),
});
```

#### 登录Schema
```typescript
export const loginSchema = z.object({
  email: z.string().email('邮箱格式不正确'),
  password: z.string().min(1, '密码不能为空'),
});
```

#### 文件上传Schema
```typescript
export const uploadSchema = z.object({
  file: z.instanceof(File).refine(
    (file) => file.size <= 10 * 1024 * 1024,
    '文件大小不能超过10MB'
  ),
  type: z.enum(['image', 'document', 'video']),
});
```

## 错误处理

### 错误代码定义

```typescript
export const ERROR_CODES = {
  // 认证错误
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  
  // 验证错误
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',
  
  // 资源错误
  NOT_FOUND: 'NOT_FOUND',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  
  // 系统错误
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  
  // 文件错误
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',
  UPLOAD_FAILED: 'UPLOAD_FAILED',
} as const;
```

### HTTP状态码映射

```typescript
export const HTTP_STATUS = {
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
} as const;
```

## 中间件设计

### 认证中间件
```typescript
export const authMiddleware = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const token = request.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return reply.status(401).send({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: '缺少认证令牌',
        },
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    request.user = decoded;
  } catch (error) {
    return reply.status(401).send({
      success: false,
      error: {
        code: 'TOKEN_EXPIRED',
        message: '认证令牌已过期',
      },
    });
  }
};
```

### 验证中间件
```typescript
export const validationMiddleware = (schema: z.ZodSchema) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      request.body = schema.parse(request.body);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: '请求参数验证失败',
            details: error.errors.map(err => ({
              field: err.path.join('.'),
              message: err.message,
            })),
          },
        });
      }
      throw error;
    }
  };
};
```

### 限流中间件
```typescript
export const rateLimitMiddleware = rateLimit({
  max: 100, // 最大请求数
  timeWindow: '15 minutes', // 时间窗口
  skipSuccessfulRequests: false,
  keyGenerator: (request) => request.ip,
  onExceeded: (request, reply) => {
    reply.status(429).send({
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: '请求过于频繁，请稍后再试',
      },
    });
  },
});
```

## API文档生成

### OpenAPI配置
```typescript
export const swaggerConfig = {
  swagger: {
    info: {
      title: 'Monorepo Bootstrap API',
      description: '通用前后端分离Monorepo系统API文档',
      version: '1.0.0',
    },
    host: 'localhost:3001',
    schemes: ['http', 'https'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
      { name: 'Auth', description: '认证相关' },
      { name: 'Users', description: '用户管理' },
      { name: 'Upload', description: '文件上传' },
      { name: 'System', description: '系统管理' },
    ],
  },
};
```

### 路由文档装饰器
```typescript
export const authRoutes = async (fastify: FastifyInstance) => {
  fastify.post('/register', {
    schema: {
      description: '用户注册',
      tags: ['Auth'],
      body: {
        type: 'object',
        properties: {
          email: { type: 'string', format: 'email' },
          username: { type: 'string', minLength: 3, maxLength: 20 },
          password: { type: 'string', minLength: 8 },
          firstName: { type: 'string', minLength: 1, maxLength: 50 },
          lastName: { type: 'string', minLength: 1, maxLength: 50 },
        },
        required: ['email', 'username', 'password', 'firstName', 'lastName'],
      },
      response: {
        201: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                user: { $ref: 'User' },
                tokens: { $ref: 'Tokens' },
              },
            },
          },
        },
      },
    },
  }, registerHandler);
};
```

## 测试策略

### 单元测试示例
```typescript
describe('Auth Routes', () => {
  test('POST /auth/register - 成功注册', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/register',
      payload: {
        email: 'test@example.com',
        username: 'testuser',
        password: 'Password123',
        firstName: 'Test',
        lastName: 'User',
      },
    });
    
    expect(response.statusCode).toBe(201);
    const payload = JSON.parse(response.payload);
    expect(payload.success).toBe(true);
    expect(payload.data.user.email).toBe('test@example.com');
    expect(payload.data.tokens.accessToken).toBeDefined();
  });
});
```

### 集成测试示例
```typescript
describe('Auth Integration', () => {
  test('完整的认证流程', async () => {
    // 注册
    const registerResponse = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/register',
      payload: validUserData,
    });
    
    // 登录
    const loginResponse = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/login',
      payload: {
        email: validUserData.email,
        password: validUserData.password,
      },
    });
    
    // 访问受保护路由
    const meResponse = await app.inject({
      method: 'GET',
      url: '/api/v1/users/me',
      headers: {
        Authorization: `Bearer ${JSON.parse(loginResponse.payload).data.tokens.accessToken}`,
      },
    });
    
    expect(meResponse.statusCode).toBe(200);
  });
});
```

这个API设计文档提供了完整的API架构、端点定义、数据验证、错误处理和测试策略，确保API的一致性、可维护性和可扩展性。