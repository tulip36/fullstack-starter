# 部署指南

## 部署概述

本指南详细说明了如何在不同环境中部署Monorepo Bootstrap系统，包括本地开发、测试环境和生产环境的部署方案。

## 环境要求

### 基础要求
- **Node.js**: >= 18.0.0
- **pnpm**: >= 8.0.0
- **Git**: >= 2.30.0

### 数据库要求
- **开发环境**: SQLite 3.x（内置）
- **生产环境**: PostgreSQL 13+ 或 MySQL 8.0+

### 可选服务
- **Redis**: >= 6.0（缓存和会话存储）
- **Nginx**: >= 1.18（反向代理）
- **Docker**: >= 20.10（容器化部署）

## 本地开发部署

### 1. 项目初始化

```bash
# 克隆项目
git clone <repository-url>
cd monorepo-bootstrap

# 安装pnpm（如果未安装）
npm install -g pnpm

# 运行初始化脚本
pnpm bootstrap
```

### 2. 环境配置

初始化脚本会引导你完成以下配置：

```bash
# 项目基本信息
? 项目名称: my-awesome-app
? 项目描述: 我的全栈应用
? 作者名称: Your Name

# 数据库配置
? 选择数据库类型: SQLite (开发环境)
? 数据库文件路径: ./data/app.db

# 认证配置
? JWT密钥: [自动生成]
? Token过期时间: 1小时
? 启用邮箱验证: false

# 开发服务器配置
? 前端端口: 3000
? 后端端口: 3001
? 启用热重载: true
```

### 3. 启动开发服务器

```bash
# 启动所有服务
pnpm dev

# 或分别启动
pnpm dev:web    # 前端开发服务器
pnpm dev:api    # 后端开发服务器
pnpm db:studio  # 数据库管理界面
```

### 4. 开发工具

```bash
# 代码检查和格式化
pnpm lint
pnpm format

# 运行测试
pnpm test
pnpm test:watch
pnpm test:coverage

# 数据库操作
pnpm db:migrate
pnpm db:seed
pnpm db:reset
```

## 测试环境部署

### 1. 使用Railway部署

#### 前端部署（Vercel推荐）

```bash
# 安装Vercel CLI
npm install -g vercel

# 部署前端
cd apps/web
vercel --prod

# 配置环境变量
vercel env add NEXT_PUBLIC_API_URL production
vercel env add NEXT_PUBLIC_APP_NAME production
```

#### 后端和数据库部署（Railway）

```bash
# 安装Railway CLI
npm install -g @railway/cli

# 登录Railway
railway login

# 创建新项目
railway new

# 配置环境变量
railway variables set NODE_ENV=production
railway variables set DATABASE_URL=postgresql://...
railway variables set JWT_SECRET=your-secret-key
railway variables set REDIS_URL=redis://...

# 部署应用
railway up
```

### 2. 使用Docker Compose

#### docker-compose.yml

```yaml
version: '3.8'

services:
  # 前端服务
  web:
    build:
      context: .
      dockerfile: apps/web/Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://api:3001
    depends_on:
      - api

  # 后端服务
  api:
    build:
      context: .
      dockerfile: apps/api/Dockerfile
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:password@db:5432/app
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=your-secret-key
    depends_on:
      - db
      - redis

  # 数据库服务
  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=app
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  # Redis服务
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  # Nginx反向代理
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - web
      - api

volumes:
  postgres_data:
  redis_data:
```

#### 部署命令

```bash
# 构建并启动所有服务
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

## 生产环境部署

### 方案1: Vercel + Railway（推荐）

#### 优势
- **零配置部署**: 自动CI/CD
- **全球CDN**: 前端性能优化
- **自动扩展**: 按需扩容
- **SSL证书**: 自动配置
- **监控告警**: 内置监控

#### 部署步骤

1. **前端部署到Vercel**
```bash
# 连接GitHub仓库
# 在Vercel控制台导入项目
# 配置构建命令: pnpm build
# 配置输出目录: apps/web/.next
# 配置环境变量
```

2. **后端部署到Railway**
```bash
# 连接GitHub仓库
# 配置构建命令: pnpm build
# 配置启动命令: pnpm start
# 配置数据库: PostgreSQL插件
# 配置环境变量
```

3. **域名配置**
```bash
# 配置自定义域名
# 设置DNS记录
# 配置SSL证书
```

### 方案2: 云服务器部署

#### 服务器配置要求
- **CPU**: 2核心以上
- **内存**: 4GB以上
- **存储**: 50GB以上SSD
- **网络**: 10Mbps以上带宽

#### 部署步骤

1. **服务器初始化**
```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装pnpm
npm install -g pnpm

# 安装Nginx
sudo apt install nginx -y

# 安装PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# 安装Redis
sudo apt install redis-server -y
```

2. **应用部署**
```bash
# 克隆代码
git clone <repository-url> /var/www/app
cd /var/www/app

# 安装依赖
pnpm install

# 构建应用
pnpm build

# 配置环境变量
cp .env.example .env.production
# 编辑.env.production文件

# 运行数据库迁移
pnpm db:migrate

# 安装PM2进程管理器
npm install -g pm2

# 启动应用
pm2 start ecosystem.config.js
```

3. **Nginx配置**

```nginx
# /etc/nginx/sites-available/app
server {
    listen 80;
    server_name yourdomain.com;

    # 前端静态文件
    location / {
        root /var/www/app/apps/web/.next;
        try_files $uri $uri/ @nextjs;
    }

    location @nextjs {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # API代理
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

4. **SSL证书配置**
```bash
# 安装Certbot
sudo apt install certbot python3-certbot-nginx -y

# 获取SSL证书
sudo certbot --nginx -d yourdomain.com

# 自动续期
sudo crontab -e
# 添加: 0 12 * * * /usr/bin/certbot renew --quiet
```

### 方案3: Kubernetes部署

#### Kubernetes配置文件

```yaml
# namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: monorepo-app

---
# configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
  namespace: monorepo-app
data:
  NODE_ENV: "production"
  API_URL: "http://api-service:3001"

---
# secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
  namespace: monorepo-app
type: Opaque
data:
  DATABASE_URL: <base64-encoded-database-url>
  JWT_SECRET: <base64-encoded-jwt-secret>
  REDIS_URL: <base64-encoded-redis-url>

---
# web-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-deployment
  namespace: monorepo-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web
  template:
    metadata:
      labels:
        app: web
    spec:
      containers:
      - name: web
        image: your-registry/web:latest
        ports:
        - containerPort: 3000
        envFrom:
        - configMapRef:
            name: app-config

---
# api-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-deployment
  namespace: monorepo-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api
  template:
    metadata:
      labels:
        app: api
    spec:
      containers:
      - name: api
        image: your-registry/api:latest
        ports:
        - containerPort: 3001
        envFrom:
        - configMapRef:
            name: app-config
        - secretRef:
            name: app-secrets

---
# service.yaml
apiVersion: v1
kind: Service
metadata:
  name: web-service
  namespace: monorepo-app
spec:
  selector:
    app: web
  ports:
  - port: 80
    targetPort: 3000
  type: ClusterIP

---
apiVersion: v1
kind: Service
metadata:
  name: api-service
  namespace: monorepo-app
spec:
  selector:
    app: api
  ports:
  - port: 3001
    targetPort: 3001
  type: ClusterIP

---
# ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: app-ingress
  namespace: monorepo-app
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
spec:
  tls:
  - hosts:
    - yourdomain.com
    secretName: app-tls
  rules:
  - host: yourdomain.com
    http:
      paths:
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: api-service
            port:
              number: 3001
      - path: /
        pathType: Prefix
        backend:
          service:
            name: web-service
            port:
              number: 80
```

#### 部署命令

```bash
# 应用所有配置
kubectl apply -f k8s/

# 查看部署状态
kubectl get pods -n monorepo-app

# 查看服务状态
kubectl get services -n monorepo-app

# 查看Ingress状态
kubectl get ingress -n monorepo-app

# 查看日志
kubectl logs -f deployment/web-deployment -n monorepo-app
kubectl logs -f deployment/api-deployment -n monorepo-app
```

## CI/CD配置

### GitHub Actions工作流

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Run linting
        run: pnpm lint
      
      - name: Run tests
        run: pnpm test
      
      - name: Build applications
        run: pnpm build

  deploy-web:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          working-directory: apps/web

  deploy-api:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Railway
        uses: railway-app/railway-action@v1
        with:
          api-token: ${{ secrets.RAILWAY_TOKEN }}
          service: api
```

## 监控和日志

### 应用监控

#### PM2监控（云服务器）
```bash
# 查看应用状态
pm2 status

# 查看实时日志
pm2 logs

# 查看监控面板
pm2 monit

# 重启应用
pm2 restart all

# 重载应用（零停机）
pm2 reload all
```

#### 日志管理
```bash
# 配置日志轮转
sudo nano /etc/logrotate.d/monorepo-app

# 内容:
/var/www/app/logs/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
    postrotate
        pm2 reload all
    endscript
}
```

### 性能监控

#### 推荐监控工具
- **前端**: Vercel Analytics, Google Analytics
- **后端**: New Relic, DataDog, Sentry
- **服务器**: Prometheus + Grafana
- **数据库**: pgAdmin, Redis Insight

#### 健康检查端点
```bash
# 应用健康检查
curl https://yourdomain.com/api/v1/system/health

# 数据库连接检查
curl https://yourdomain.com/api/v1/system/health/database

# Redis连接检查
curl https://yourdomain.com/api/v1/system/health/redis
```

## 故障排除

### 常见问题

#### 1. 前端构建失败
```bash
# 清理缓存
rm -rf .next node_modules
pnpm install
pnpm build

# 检查环境变量
printenv | grep NEXT_PUBLIC
```

#### 2. 后端启动失败
```bash
# 检查端口占用
sudo netstat -tlnp | grep :3001

# 检查数据库连接
pnpm db:migrate

# 查看详细错误日志
pm2 logs api --err
```

#### 3. 数据库连接问题
```bash
# 检查数据库状态
sudo systemctl status postgresql

# 测试连接
psql -h localhost -U postgres -d app

# 重置数据库
pnpm db:reset
```

#### 4. SSL证书问题
```bash
# 检查证书状态
sudo certbot certificates

# 手动续期
sudo certbot renew

# 测试Nginx配置
sudo nginx -t

# 重载Nginx
sudo systemctl reload nginx
```

### 性能优化

#### 前端优化
```bash
# 分析Bundle大小
pnpm build:analyze

# 启用压缩
# next.config.js
module.exports = {
  compress: true,
  poweredByHeader: false,
}
```

#### 后端优化
```bash
# 启用Gzip压缩
# fastify配置
server: {
  bodyLimit: 10 * 1024 * 1024,
}

# 数据库连接池
# prisma配置
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  relationMode = "prisma"
}
```

## 安全配置

### 环境变量安全
```bash
# 使用加密存储
# 安装dotenv-vault
pnpm add dotenv-vault

# 加密环境变量
dotenv-vault encrypt

# 在生产环境解密
dotenv-vault decrypt
```

### 网络安全
```bash
# 配置防火墙
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw deny 3001  # 禁止直接访问API端口

# 配置fail2ban
sudo apt install fail2ban -y
sudo systemctl enable fail2ban
```

### 数据库安全
```sql
-- 创建只读用户
CREATE USER readonly_user WITH PASSWORD 'secure_password';
GRANT CONNECT ON DATABASE app TO readonly_user;
GRANT USAGE ON SCHEMA public TO readonly_user;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly_user;

-- 备份数据库
pg_dump -h localhost -U postgres app > backup.sql
```

这个部署指南涵盖了从本地开发到生产环境的完整部署流程，包括多种部署方案、监控配置、故障排除和安全设置，确保系统能够稳定可靠地运行在各种环境中。