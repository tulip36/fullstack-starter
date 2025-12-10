// API响应工具函数
import type { ApiResponse, ApiError, PaginationMeta, ResponseMeta } from '../types/api';

export const createSuccessResponse = <T>(
  data: T,
  meta?: Partial<ResponseMeta>
): ApiResponse<T> => ({
  success: true,
  data,
  meta: {
    timestamp: new Date().toISOString(),
    requestId: generateRequestId(),
    version: 'v1',
    ...meta,
  },
});

export const createErrorResponse = (
  error: ApiError,
  meta?: Partial<ResponseMeta>
): ApiResponse => ({
  success: false,
  error,
  meta: {
    timestamp: new Date().toISOString(),
    requestId: generateRequestId(),
    version: 'v1',
    ...meta,
  },
});

export const createPaginatedResponse = <T>(
  data: T[],
  pagination: PaginationMeta,
  meta?: Partial<ResponseMeta>
) => {
  return createSuccessResponse(data, {
    pagination,
    ...meta,
  });
};

// 生成请求ID
export const generateRequestId = (): string => {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// 格式化分页信息
export const formatPagination = (
  page: number,
  limit: number,
  total: number
): PaginationMeta => {
  const totalPages = Math.ceil(total / limit);
  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
};