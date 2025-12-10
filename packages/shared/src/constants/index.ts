// 应用常量
export const APP_CONFIG = {
  NAME: 'Monorepo Bootstrap',
  DESCRIPTION: '通用前后端分离Monorepo系统',
  VERSION: '1.0.0',
  API_VERSION: 'v1',
} as const;

// 分页常量
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

// 文件上传常量
export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'text/plain', 'application/msword'],
  ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/webm', 'video/ogg'],
} as const;

// JWT常量
export const JWT = {
  DEFAULT_EXPIRES_IN: '1h',
  DEFAULT_REFRESH_EXPIRES_IN: '7d',
  ALGORITHM: 'HS256',
} as const;

// 密码常量
export const PASSWORD = {
  MIN_LENGTH: 8,
  SALT_ROUNDS: 12,
} as const;

// 用户名常量
export const USERNAME = {
  MIN_LENGTH: 3,
  MAX_LENGTH: 20,
  PATTERN: /^[a-zA-Z0-9_]+$/,
} as const;

// 邮箱常量
export const EMAIL = {
  MAX_LENGTH: 255,
  PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const;

// HTTP状态码消息
export const HTTP_MESSAGES = {
  200: 'OK',
  201: 'Created',
  204: 'No Content',
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  409: 'Conflict',
  422: 'Unprocessable Entity',
  429: 'Too Many Requests',
  500: 'Internal Server Error',
  503: 'Service Unavailable',
} as const;

// 错误消息
export const ERROR_MESSAGES = {
  // 认证错误
  UNAUTHORIZED: '未授权访问',
  FORBIDDEN: '禁止访问',
  TOKEN_EXPIRED: '令牌已过期',
  INVALID_CREDENTIALS: '用户名或密码错误',
  
  // 验证错误
  VALIDATION_ERROR: '请求参数验证失败',
  INVALID_INPUT: '输入参数无效',
  
  // 资源错误
  NOT_FOUND: '资源不存在',
  ALREADY_EXISTS: '资源已存在',
  
  // 系统错误
  INTERNAL_ERROR: '服务器内部错误',
  SERVICE_UNAVAILABLE: '服务暂时不可用',
  RATE_LIMIT_EXCEEDED: '请求过于频繁，请稍后再试',
  
  // 文件错误
  FILE_TOO_LARGE: '文件大小超出限制',
  INVALID_FILE_TYPE: '不支持的文件类型',
  UPLOAD_FAILED: '文件上传失败',
} as const;

// 日志级别
export const LOG_LEVELS = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug',
} as const;

// 缓存键前缀
export const CACHE_KEYS = {
  USER: 'user:',
  SESSION: 'session:',
  FILE: 'file:',
} as const;