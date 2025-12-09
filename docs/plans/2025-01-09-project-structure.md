# 项目结构详细说明

## 目录结构概览

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
├── package.json             # 根package.json
├── pnpm-workspace.yaml      # pnpm工作空间配置
├── turbo.json               # Turborepo配置
└── README.md                # 项目说明
```

## 应用程序目录 (apps/)

### 前端应用 (apps/web/)

```
apps/web/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── globals.css      # 全局样式
│   │   ├── layout.tsx       # 根布局
│   │   ├── page.tsx         # 首页
│   │   ├── (auth)/          # 认证相关页面组
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── dashboard/       # 仪表板页面
│   │   └── api/             # API路由
│   │       └── auth/
│   ├── components/          # 可复用组件
│   │   ├── ui/              # 基础UI组件
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   └── index.ts
│   │   ├── layout/          # 布局组件
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Footer.tsx
│   │   └── forms/           # 表单组件
│   │       ├── LoginForm.tsx
│   │       └── RegisterForm.tsx
│   ├── features/            # 功能模块
│   │   ├── auth/            # 认证功能
│   │   │   ├── hooks/
│   │   │   │   ├── useAuth.ts
│   │   │   │   └── useLogin.ts
│   │   │   ├── components/
│   │   │   │   ├── AuthProvider.tsx
│   │   │   │   └── ProtectedRoute.tsx
│   │   │   └── services/
│   │   │       └── authService.ts
│   │   ├── users/           # 用户管理功能
│   │   └── dashboard/       # 仪表板功能
│   ├── hooks/               # 全局hooks
│   │   ├── useApi.ts
│   │   ├── useLocalStorage.ts
│   │   └── useDebounce.ts
│   ├── lib/                 # 工具函数
│   │   ├── api.ts           # API客户端
│   │   ├── utils.ts         # 通用工具
│   │   ├── validations.ts   # 表单验证
│   │   └── constants.ts     # 常量定义
│   ├── types/               # 类型定义
│   │   ├── api.ts           # API类型
│   │   ├── auth.ts          # 认证类型
│   │   └── user.ts          # 用户类型
│   └── styles/              # 样式文件
│       ├── globals.css
│       └── components.css
├── public/                  # 静态资源
│   ├── favicon.ico
│   ├── logo.png
│   └── manifest.json
├── tests/                   # 测试文件
│   ├── __mocks__/
│   ├── setup.ts
│   └── utils/
├── .env.local.example       # 环境变量示例
├── .eslintrc.json           # ESLint配置
├── next.config.js           # Next.js配置
├── tailwind.config.js       # Tailwind配置
├── tsconfig.json            # TypeScript配置
└── package.json             # 前端依赖
```

### 后端应用 (apps/api/)

```
apps/api/
├── src/
│   ├── routes/              # API路由
│   │   ├── auth/            # 认证路由
│   │   │   ├── login.ts
│   │   │   ├── register.ts
│   │   │   └── refresh.ts
│   │   ├── users/           # 用户路由
│   │   │   ├── index.ts
│   │   │   └── profile.ts
│   │   ├── upload/          # 文件上传路由
│   │   │   └── index.ts
│   │   └── health.ts        # 健康检查
│   ├── services/            # 业务逻辑层
│   │   ├── auth.service.ts  # 认证服务
│   │   ├── user.service.ts  # 用户服务
│   │   ├── email.service.ts # 邮件服务
│   │   └── upload.service.ts# 上传服务
│   ├── repositories/        # 数据访问层
│   │   ├── user.repository.ts
│   │   ├── session.repository.ts
│   │   └── base.repository.ts
│   ├── middleware/          # 中间件
│   │   ├── auth.middleware.ts
│   │   ├── cors.middleware.ts
│   │   ├── error.middleware.ts
│   │   ├── logger.middleware.ts
│   │   └── validation.middleware.ts
│   ├── utils/               # 工具函数
│   │   ├── jwt.ts           # JWT工具
│   │   ├── password.ts      # 密码工具
│   │   ├── logger.ts        # 日志工具
│   │   └── validation.ts    # 验证工具
│   ├── types/               # 类型定义
│   │   ├── api.ts           # API类型
│   │   ├── auth.ts          # 认证类型
│   │   └── database.ts      # 数据库类型
│   ├── config/              # 配置文件
│   │   ├── database.ts      # 数据库配置
│   │   ├── jwt.ts           # JWT配置
│   │   └── app.ts           # 应用配置
│   ├── plugins/             # Fastify插件
│   │   ├── database.ts      # 数据库插件
│   │   ├── auth.ts          # 认证插件
│   │   └── swagger.ts       # API文档插件
│   └── server.ts            # 服务器入口
├── tests/                   # 测试文件
│   ├── routes/              # 路由测试
│   ├── services/            # 服务测试
│   ├── repositories/        # 仓储测试
│   ├── helpers/             # 测试辅助
│   └── setup.ts             # 测试设置
├── .env.example             # 环境变量示例
├── .eslintrc.json           # ESLint配置
├── jest.config.js           # Jest配置
├── tsconfig.json            # TypeScript配置
└── package.json             # 后端依赖
```

## 共享包目录 (packages/)

### 共享类型和工具 (packages/shared/)

```
packages/shared/
├── src/
│   ├── types/               # 共享类型定义
│   │   ├── api.ts           # API请求/响应类型
│   │   ├── auth.ts          # 认证相关类型
│   │   ├── user.ts          # 用户相关类型
│   │   ├── common.ts        # 通用类型
│   │   └── index.ts
│   ├── utils/               # 共享工具函数
│   │   ├── validation.ts    # 验证工具
│   │   ├── formatting.ts    # 格式化工具
│   │   ├── constants.ts     # 常量定义
│   │   └── index.ts
│   ├── schemas/             # Zod验证模式
│   │   ├── auth.schema.ts
│   │   ├── user.schema.ts
│   │   └── index.ts
│   └── index.ts             # 主入口
├── tests/                   # 测试文件
├── tsconfig.json            # TypeScript配置
└── package.json             # 包依赖
```

### 共享UI组件 (packages/ui/)

```
packages/ui/
├── src/
│   ├── components/          # UI组件
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.test.tsx
│   │   │   ├── Button.stories.tsx
│   │   │   └── index.ts
│   │   ├── Input/
│   │   ├── Modal/
│   │   ├── Dropdown/
│   │   └── index.ts
│   ├── hooks/               # UI相关hooks
│   │   ├── useClickOutside.ts
│   │   ├── useKeyboard.ts
│   │   └── index.ts
│   ├── styles/              # 样式文件
│   │   ├── globals.css
│   │   ├── components.css
│   │   └── themes.css
│   ├── utils/               # UI工具
│   │   ├── cn.ts            # 类名合并
│   │   └── index.ts
│   └── index.ts             # 主入口
├── .storybook/              # Storybook配置
├── tests/                   # 测试文件
├── tailwind.config.js       # Tailwind配置
├── tsconfig.json            # TypeScript配置
└── package.json             # 包依赖
```

### 数据库配置 (packages/database/)

```
packages/database/
├── prisma/
│   ├── schema.prisma        # 数据库模型定义
│   ├── migrations/          # 数据库迁移文件
│   │   └── .gitkeep
│   └── seed.ts              # 初始数据
├── src/
│   ├── client.ts            # Prisma客户端
│   ├── migrations.ts        # 迁移工具
│   ├── seeds/               # 种子数据
│   │   ├── users.ts
│   │   └── index.ts
│   └── index.ts             # 主入口
├── tests/                   # 测试文件
│   ├── setup.ts             # 测试数据库设置
│   └── helpers.ts           # 测试辅助函数
├── .env.example             # 环境变量示例
├── tsconfig.json            # TypeScript配置
└── package.json             # 包依赖
```

## 开发工具目录 (tools/)

```
tools/
├── scripts/                 # 构建和部署脚本
│   ├── bootstrap.ts         # 项目初始化脚本
│   ├── build.ts             # 构建脚本
│   ├── deploy.ts            # 部署脚本
│   ├── migrate.ts           # 数据库迁移脚本
│   └── seed.ts              # 数据种子脚本
├── config/                  # 工具配置
│   ├── eslint.config.js     # ESLint配置
│   ├── prettier.config.js   # Prettier配置
│   └── typescript.config.js # TypeScript配置
└── templates/               # 项目模板
    ├── next-app/
    ├── fastify-api/
    └── shared-package/
```

## 配置文件说明

### 根目录配置文件

#### package.json
```json
{
  "name": "monorepo-bootstrap",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint",
    "format": "prettier --write .",
    "bootstrap": "tsx tools/scripts/bootstrap.ts",
    "db:migrate": "pnpm --filter database db:migrate",
    "db:studio": "pnpm --filter database db:studio"
  },
  "devDependencies": {
    "turbo": "latest",
    "tsx": "latest",
    "prettier": "latest",
    "@types/node": "latest"
  }
}
```

#### pnpm-workspace.yaml
```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

#### turbo.json
```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": ["coverage/**"]
    },
    "lint": {
      "outputs": []
    }
  }
}
```

## 文件命名约定

### TypeScript文件
- 组件文件：PascalCase (Button.tsx, UserProfile.tsx)
- 工具文件：camelCase (authService.ts, apiClient.ts)
- 类型文件：camelCase (user.types.ts, api.types.ts)
- 配置文件：kebab-case (database.config.ts, jwt.config.ts)

### 目录命名
- 功能目录：kebab-case (user-management/, file-upload/)
- 组件目录：PascalCase (Button/, Modal/)
- 工具目录：camelCase (utils/, helpers/)

### 测试文件
- 单元测试：`.test.ts` 或 `.spec.ts`
- 集成测试：`.integration.test.ts`
- E2E测试：`.e2e.test.ts`

## 依赖管理策略

### 共享依赖
- TypeScript、ESLint、Prettier等开发工具放在根目录
- UI相关依赖放在packages/ui
- 数据库相关依赖放在packages/database
- 业务逻辑依赖放在packages/shared

### 应用特定依赖
- Next.js相关依赖放在apps/web
- Fastify相关依赖放在apps/api
- 测试相关依赖放在各自应用目录

### 版本管理
- 使用pnpm的workspace协议管理内部依赖
- 统一管理外部依赖版本
- 定期更新依赖并测试兼容性

这个项目结构设计确保了代码的模块化、可维护性和可扩展性，同时提供了良好的开发体验。