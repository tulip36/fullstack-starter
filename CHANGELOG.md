# 更新日志

本文档记录了项目的所有重要更改。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
并且本项目遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [未发布]

### 新增
- 初始版本发布
- 完整的Monorepo架构
- 交互式项目初始化脚本
- 前后端分离架构
- 完整的认证系统
- API文档自动生成
- 类型安全的API通信
- 现代化开发工具链

## [1.0.0] - 2025-01-09

### 新增
- 🏗️ **项目架构**
  - pnpm workspaces monorepo结构
  - Turborepo构建优化
  - 统一的包管理

- 🚀 **前端应用 (Next.js 14)**
  - App Router支持
  - TypeScript严格模式
  - Tailwind CSS样式
  - Zustand状态管理
  - React Hook Form表单处理
  - 自定义UI组件库

- ⚡ **后端API (Fastify)**
  - RESTful API设计
  - JWT认证系统
  - Zod数据验证
  - Swagger API文档
  - 错误处理中间件
  - 请求日志记录

- 🗄️ **数据库 (Prisma)**
  - 类型安全的数据库访问
  - 自动迁移管理
  - 种子数据初始化
  - 多数据库支持 (SQLite/PostgreSQL/MySQL)

- 🔐 **认证系统**
  - JWT + Refresh Token
  - 密码加密存储
  - 会话管理
  - 审计日志记录

- 🛠️ **开发工具**
  - ESLint + Prettier代码规范
  - Husky Git钩子
  - Jest测试框架
  - 自动化CI/CD
  - 热重载开发

- 📚 **文档和工具**
  - 交互式初始化脚本
  - 完整的API文档
  - 部署指南
  - 开发者文档

### 技术栈详情

**前端技术栈:**
- Next.js 14 (App Router)
- TypeScript 5.3
- Tailwind CSS 3.4
- React 18
- Zustand 4.5
- React Hook Form 7.50
- Zod 3.22

**后端技术栈:**
- Fastify 4.26
- TypeScript 5.3
- Prisma 5.9
- JWT认证
- bcryptjs密码加密
- Swagger文档

**开发工具:**
- pnpm 8.15
- Turborepo 1.12
- ESLint 8.56
- Prettier 3.2
- Jest 29.7
- Husky 8.0

### 默认功能

- ✅ 用户注册和登录
- ✅ JWT认证和授权
- ✅ 用户信息管理
- ✅ 密码修改
- ✅ API文档生成
- ✅ 健康检查端点
- ✅ 错误处理
- ✅ 请求验证
- ✅ 审计日志
- ✅ 类型安全

### 测试账号
- 邮箱: test@example.com
- 密码: Password123

---

## 版本说明

- **主版本号**: 不兼容的API修改
- **次版本号**: 向下兼容的功能性新增
- **修订号**: 向下兼容的问题修正