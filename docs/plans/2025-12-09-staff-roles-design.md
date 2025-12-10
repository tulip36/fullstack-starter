# 员工角色权限系统设计

## 目的
扩展用户认证系统，添加员工角色和权限控制，支持餐厅不同岗位的访问权限管理。

## 影响范围
- 数据库：扩展User模型，添加Role、Permission模型
- 后端：更新认证中间件和权限检查
- 前端：角色-based界面显示

## 实现细节

### 扩展现有模型

```prisma
// 扩展User模型
model User {
  // ... 现有字段
  roleId    String?
  role      Role?     @relation(fields: [roleId], references: [id])
  // ... 其他关联
}

// 新增角色模型
model Role {
  id          String   @id @default(cuid())
  name        String   @unique
  nameZh      String?  // 中文名称
  description String?
  permissions Permission[]
  users       User[]
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("roles")
}

// 权限模型
model Permission {
  id          String   @id @default(cuid())
  name        String   @unique
  resource    String   // 资源名称（如：orders, tables, menu）
  action      String   // 操作（如：create, read, update, delete）
  description String?
  roles       Role[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("permissions")
}
```

### 预定义角色
- **Manager**: 完全访问权限
- **Server**: 订单和餐桌管理权限
- **Kitchen**: 订单查看和状态更新权限
- **Host**: 餐桌分配和预订权限

### 权限中间件
```typescript
// 权限检查中间件
export const checkPermission = (resource: string, action: string) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const user = request.user as UserWithRole;
    if (!user.role?.permissions.some(p =>
      p.resource === resource && p.action === action
    )) {
      return reply.code(403).send({ error: 'Insufficient permissions' });
    }
  };
};
```

## 测试要求
- 角色分配测试
- 权限检查测试
- 中间件集成测试

## 验收标准
- [ ] 角色和权限数据正确创建
- [ ] 权限中间件正常工作
- [ ] 不同角色访问受限
- [ ] 所有测试通过