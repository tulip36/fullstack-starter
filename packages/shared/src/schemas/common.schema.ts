import { z } from 'zod';

// 文件上传验证模式
export const fileUploadSchema = z.object({
  file: z.instanceof(File).refine(
    (file) => file.size <= 10 * 1024 * 1024,
    '文件大小不能超过10MB'
  ),
  type: z.enum(['image', 'document', 'video'], {
    errorMap: () => ({ message: '文件类型必须是 image、document 或 video' }),
  }),
});

// 分页参数验证模式
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1, '页码必须是正整数').default(1),
  limit: z.coerce.number().int().min(1, '每页数量必须是正整数').max(100, '每页数量不能超过100').default(20),
});

// 排序参数验证模式
export const sortSchema = z.object({
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// 搜索参数验证模式
export const searchSchema = z.object({
  search: z.string().optional(),
});

// 通用查询参数验证模式
export const queryParamsSchema = paginationSchema.merge(sortSchema).merge(searchSchema);