import { z } from 'zod';

// 用户相关验证模式
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

export const loginSchema = z.object({
  email: z.string().email('邮箱格式不正确'),
  password: z.string().min(1, '密码不能为空'),
});

export const updateUserSchema = z.object({
  profile: z.object({
    firstName: z.string().min(1, '名字不能为空').max(50, '名字最多50个字符').optional(),
    lastName: z.string().min(1, '姓氏不能为空').max(50, '姓氏最多50个字符').optional(),
    bio: z.string().max(500, '简介最多500个字符').optional(),
  }).optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, '当前密码不能为空'),
  newPassword: z.string()
    .min(8, '新密码至少8个字符')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, '新密码必须包含大小写字母和数字'),
});