# 餐桌管理API设计

## 目的
为餐桌管理功能提供RESTful API端点，支持餐桌状态查询、分配和更新操作。

## 影响范围
- 后端：新增tables路由和处理器
- 前端：API客户端集成
- 数据库：使用已设计的Table模型

## API端点设计

### 餐桌查询
```
GET /api/v1/tables
- 查询所有餐桌
- 支持过滤：status, section
- 支持分页

GET /api/v1/tables/:id
- 获取单个餐桌详情

GET /api/v1/tables/layout
- 获取当前活跃的餐桌布局
```

### 餐桌管理
```
POST /api/v1/tables
- 创建新餐桌（管理员权限）

PUT /api/v1/tables/:id
- 更新餐桌信息（管理员权限）

PUT /api/v1/tables/:id/status
- 更新餐桌状态（服务员权限）
- 状态：AVAILABLE, OCCUPIED, RESERVED, CLEANING, OUT_OF_ORDER

DELETE /api/v1/tables/:id
- 删除餐桌（管理员权限）
```

### 餐桌布局管理
```
GET /api/v1/table-layouts
- 获取所有布局

POST /api/v1/table-layouts
- 创建新布局

PUT /api/v1/table-layouts/:id/activate
- 激活指定布局
```

## 请求/响应格式

### 餐桌对象
```json
{
  "id": "string",
  "tableNumber": "T001",
  "capacity": 4,
  "section": "main",
  "status": "AVAILABLE",
  "layoutId": "string",
  "currentOrder": null,
  "createdAt": "2025-12-09T10:00:00Z",
  "updatedAt": "2025-12-09T10:00:00Z"
}
```

## 权限要求
- 管理员：完全CRUD权限
- 服务员：状态更新权限
- 厨房：只读权限

## 错误处理
- 400: 无效请求数据
- 403: 权限不足
- 404: 餐桌不存在
- 409: 状态冲突（尝试占用已占用的餐桌）

## 测试要求
- 所有端点功能测试
- 权限控制测试
- 错误场景测试
- 并发操作测试

## 验收标准
- [ ] 所有API端点正常响应
- [ ] 权限控制正确实施
- [ ] 错误处理完善
- [ ] API文档自动生成