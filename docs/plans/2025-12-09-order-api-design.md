# 订单管理API设计

## 目的
为订单管理功能提供RESTful API端点，支持订单创建、状态更新和查询操作。

## 影响范围
- 后端：新增orders路由和处理器
- 前端：API客户端集成
- 实时：WebSocket集成用于状态更新

## API端点设计

### 订单查询
```
GET /api/v1/orders
- 获取订单列表
- 支持过滤：status, tableId, serverId, date
- 支持分页和排序

GET /api/v1/orders/:id
- 获取单个订单详情（包含订单项）

GET /api/v1/orders/active
- 获取所有活跃订单（非完成状态）
```

### 订单管理
```
POST /api/v1/orders
- 创建新订单（服务员权限）
- 自动生成订单编号

PUT /api/v1/orders/:id
- 更新订单信息（服务员权限）

PUT /api/v1/orders/:id/status
- 更新订单状态（服务员/厨房权限）
- 触发状态机验证

DELETE /api/v1/orders/:id
- 取消订单（管理员权限）
```

### 订单项管理
```
POST /api/v1/orders/:id/items
- 添加订单项（服务员权限）

PUT /api/v1/orders/:id/items/:itemId
- 更新订单项（服务员权限）

PUT /api/v1/orders/:id/items/:itemId/status
- 更新订单项状态（厨房权限）

DELETE /api/v1/orders/:id/items/:itemId
- 删除订单项（服务员权限）
```

## 请求/响应格式

### 订单对象
```json
{
  "id": "string",
  "orderNumber": "ORD-20251209-001",
  "tableId": "string",
  "serverId": "string",
  "status": "CONFIRMED",
  "orderType": "DINE_IN",
  "subtotal": 45.50,
  "tax": 3.64,
  "tip": 9.10,
  "total": 58.24,
  "items": [
    {
      "id": "string",
      "menuItemId": "string",
      "menuItem": {
        "name": "Kung Pao Chicken",
        "price": 15.99
      },
      "quantity": 2,
      "modifiers": [
        {
          "name": "Extra Spicy",
          "price": 1.00
        }
      ],
      "status": "PREPARING"
    }
  ],
  "createdAt": "2025-12-09T12:00:00Z",
  "updatedAt": "2025-12-09T12:05:00Z"
}
```

## 状态机规则
- PENDING → CONFIRMED → PREPARING → READY → SERVED → COMPLETED
- 只能前进状态，不能后退
- CANCELLED可以从任何状态转换

## 实时通知
- 订单状态变更时推送WebSocket消息
- 厨房界面自动更新
- 服务员收到完成通知

## 测试要求
- 订单生命周期测试
- 状态机验证测试
- 并发操作测试
- WebSocket集成测试

## 验收标准
- [ ] 订单创建和状态更新正常
- [ ] 状态机规则正确实施
- [ ] 实时通知工作正常
- [ ] 所有测试通过