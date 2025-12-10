import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config/app';

// 临时定义类型
interface JwtPayload {
  userId: string;
  email: string;
  username: string;
  iat: number;
  exp: number;
}

interface Tokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export class AuthService {
  // 密码哈希
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  // 验证密码
  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  // 生成JWT token
  static generateTokens(payload: Omit<JwtPayload, 'iat' | 'exp'>): Tokens {
    const accessToken = jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    });

    const refreshToken = jwt.sign(
      { userId: payload.userId },
      config.jwt.secret,
      { expiresIn: config.jwt.refreshTokenExpiresIn }
    );

    // 计算过期时间（秒）
    const expiresIn = jwt.decode(accessToken) as any;
    const expirationTime = expiresIn.exp - expiresIn.iat;

    return {
      accessToken,
      refreshToken,
      expiresIn: expirationTime,
    };
  }

  // 验证JWT token
  static verifyAccessToken(token: string): JwtPayload {
    return jwt.verify(token, config.jwt.secret) as JwtPayload;
  }

  // 验证refresh token
  static verifyRefreshToken(token: string): { userId: string } {
    return jwt.verify(token, config.jwt.secret) as { userId: string };
  }

  // 从请求头中提取token
  static extractTokenFromHeader(authHeader?: string): string | null {
    if (!authHeader) return null;
    
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') return null;
    
    return parts[1];
  }
}