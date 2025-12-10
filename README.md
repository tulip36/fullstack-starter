# Monorepo Bootstrap

🚀 通用前后端分离Monorepo系统 - 快速启动您的全栈应用

## ✨ 特性

- 🏗️ **Monorepo架构** - 使用pnpm workspaces管理多包项目
- ⚡ **现代化技术栈** - Next.js 14 + Fastify + TypeScript + Prisma
- 🎨 **优雅的UI** - Tailwind CSS + 自定义组件库
- 🔐 **完整的认证系统** - JWT + Refresh Token + 密码加密
- 📝 **类型安全** - 端到端TypeScript支持
- 🛠️ **开发工具** - ESLint + Prettier + Husky + Jest
- 📚 **API文档** - 自动生成的OpenAPI文档
- 🚀 **一键启动** - 交互式项目初始化脚本

## 🏛️ 技术栈

### 前端
- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **状态管理**: Zustand
- **表单处理**: React Hook Form + Zod
- **UI组件**: 自定义组件库
- **HTTP客户端**: Axios

### 后端
- **框架**: Fastify
- **语言**: TypeScript
- **ORM**: Prisma
- **认证**: JWT + bcrypt
- **验证**: Zod
- **文档**: Swagger/OpenAPI

### 开发工具
- **包管理**: pnpm workspaces
- **构建工具**: Turborepo
- **代码质量**: ESLint + Prettier
- **Git钩子**: Husky + lint-staged
- **测试**: Jest + Testing Library

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- Git

### 安装和初始化

1. **克隆项目**
```bash
git clone <repository-url>
cd monorepo-bootstrap
```

2. **运行初始化脚本**
```bash
pnpm bootstrap
```

初始化脚本将引导您完成：
- 项目基本信息配置
- 数据库选择和配置
- 端口设置
- JWT密钥生成
- 依赖安装
- 数据库迁移
- 种子数据初始化

3. **启动开发服务器**
```bash
# 同时启动前后端
pnpm dev

# 或分别启动
pnpm dev:web    # 前端: http://localhost:3000
pnpm dev:api    # 后端: http://localhost:3001
pnpm db:studio  # 数据库管理界面
```

### 测试账号

初始化完成后，您可以使用以下测试账号：

- **邮箱**: test@example.com
- **密码**: Password123

## 📁 项目结构

```
monorepo-bootstrap/
├── apps/                    # 应用程序
│   ├── web/                 # Next.js前端应用
│   └── api/                 # Fastify后端应用
├── packages/                # 共享包
│   ├── shared/              # 共享类型和工具
│   ├── ui/                  # 共享UI组件
│   └── database/            # 数据库配置
├── tools/                   # 开发工具和脚本
│   └── scripts/             # 构建和部署脚本
├── docs/                    # 项目文档
├── .github/                 # GitHub配置
└── 配置文件...
```

## 🛠️ 开发命令

### 项目管理
```bash
pnpm dev              # 启动开发服务器
pnpm build            # 构建所有包
pnpm test             # 运行所有测试
pnpm lint             # 代码检查
pnpm format           # 代码格式化
pnpm clean            # 清理构建文件
```

### 数据库操作
```bash
pnpm db:migrate       # 运行数据库迁移
pnpm db:generate      # 生成Prisma客户端
pnpm db:seed          # 运行种子数据
pnpm db:studio        # 打开Prisma Studio
pnpm db:reset         # 重置数据库
```

### 单独包操作
```bash
# 前端
pnpm --filter web dev
pnpm --filter web build
pnpm --filter web test

# 后端
pnpm --filter api dev
pnpm --filter api build
pnpm --filter api test

# 共享包
pnpm --filter shared build
pnpm --filter ui build
pnpm --filter database build
```

## 📚 API文档

启动后端服务器后，访问以下地址查看API文档：

- **Swagger UI**: http://localhost:3001/docs
- **OpenAPI JSON**: http://localhost:3001/docs/json

### 主要API端点

#### 认证
- `POST /api/v1/auth/register` - 用户注册
- `POST /api/v1/auth/login` - 用户登录
- `POST /api/v1/auth/refresh` - 刷新Token
- `POST /api/v1/auth/logout` - 用户登出

#### 用户
- `GET /api/v1/users/me` - 获取当前用户信息
- `PUT /api/v1/users/me` - 更新用户信息
- `PUT /api/v1/users/me/password` - 修改密码

#### 系统
- `GET /api/v1/system/health` - 健康检查
- `GET /api/v1/system/info` - 系统信息

## 🧪 测试

### 运行测试
```bash
# 运行所有测试
pnpm test

# 运行特定包的测试
pnpm --filter web test
pnpm --filter api test
pnpm --filter shared test

# 监听模式
pnpm test:watch

# 生成覆盖率报告
pnpm test:coverage
```

### 测试结构
- **单元测试**: 测试单个函数和组件
- **集成测试**: 测试API端点和数据库交互
- **E2E测试**: 测试完整的用户流程

## 🚀 部署

### 环境变量

创建 `.env.local` 文件并配置以下变量：

```env
# Application
NODE_ENV=production
NEXT_PUBLIC_APP_NAME=Your App Name
NEXT_PUBLIC_APP_DESCRIPTION=Your App Description

# API Configuration
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
API_PORT=3001
WEB_PORT=3000

# Database
DATABASE_URL="postgresql://username:password@localhost:5432/database"

# Authentication
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=1h
REFRESH_TOKEN_EXPIRES_IN=7d

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=noreply@yourdomain.com

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,application/pdf

# Logging
LOG_LEVEL=info
LOG_FILE=./logs/app.log
```

### 部署选项

#### 1. Vercel + Railway (推荐)
- 前端部署到Vercel
- 后端和数据库部署到Railway
- 自动CI/CD流程

#### 2. Docker Compose
```bash
docker-compose up -d
```

#### 3. 云服务器
- 使用提供的部署脚本
- 支持Nginx反向代理
- 自动SSL证书配置

详细部署指南请参考 [部署文档](docs/plans/2025-01-09-deployment-guide.md)

## 📖 文档

- [设计文档](docs/plans/2025-01-09-monorepo-bootstrap-design.md) - 完整的系统架构设计
- [项目结构](docs/plans/2025-01-09-project-structure.md) - 详细的目录结构说明
- [API设计](docs/plans/2025-01-09-api-design.md) - RESTful API设计规范
- [部署指南](docs/plans/2025-01-09-deployment-guide.md) - 多环境部署方案

## 🤝 贡献

欢迎贡献代码！请遵循以下步骤：

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

### 开发规范

- 遵循ESLint和Prettier配置
- 编写测试用例
- 更新相关文档
- 确保所有测试通过

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 致谢

感谢以下开源项目：

- [Next.js](https://nextjs.org/) - React框架
- [Fastify](https://www.fastify.io/) - Node.js Web框架
- [Prisma](https://www.prisma.io/) - 数据库ORM
- [Tailwind CSS](https://tailwindcss.com/) - CSS框架
- [pnpm](https://pnpm.io/) - 包管理器
- [Turborepo](https://turbo.build/) - 构建工具

## 📞 支持

如果您遇到问题或有建议，请：

1. 查看 [文档](docs/)
2. 搜索 [Issues](../../issues)
3. 创建新的 [Issue](../../issues/new)
4. 联系维护者

---

⭐ 如果这个项目对您有帮助，请给我们一个星标！