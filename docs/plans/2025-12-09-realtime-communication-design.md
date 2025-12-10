# WebSocket实时通信系统设计

## 目的
为系统提供实时通信能力，支持订单状态更新、餐桌状态同步和厨房通知。

## 影响范围
- 后端：WebSocket服务器集成
- 前端：WebSocket客户端集成
- 基础设施：连接管理和消息路由

## 技术方案

### 后端WebSocket服务器
使用fastify-websocket集成：

```typescript
// plugins/websocket.ts
export const websocketPlugin = (fastify: FastifyInstance) => {
  fastify.register(fastifyWebsocket);

  fastify.get('/ws', { websocket: true }, (connection, req) => {
    // 连接处理逻辑
  });
};
```

### 消息协议
```typescript
interface WSMessage {
  type: 'order_update' | 'table_update' | 'notification';
  payload: any;
  timestamp: string;
  userId?: string;
}

// 具体消息类型
interface OrderUpdateMessage {
  type: 'order_update';
  payload: {
    orderId: string;
    status: OrderStatus;
    updatedBy: string;
  };
}

interface TableUpdateMessage {
  type: 'table_update';
  payload: {
    tableId: string;
    status: TableStatus;
    orderId?: string;
  };
}
```

### 前端WebSocket客户端
```typescript
// hooks/useWebSocket.ts
export const useWebSocket = (url: string) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<WSMessage[]>([]);

  // 连接管理
  // 消息处理
  // 重连逻辑
};
```

## 消息类型

### 订单相关
- `order_created`: 新订单创建
- `order_status_changed`: 订单状态变更
- `order_item_ready`: 菜品准备完成
- `order_completed`: 订单完成

### 餐桌相关
- `table_status_changed`: 餐桌状态变更
- `table_assigned`: 餐桌分配
- `reservation_confirmed`: 预订确认

### 系统通知
- `kitchen_alert`: 厨房提醒
- `server_notification`: 服务员通知
- `system_broadcast`: 系统广播

## 连接管理

### 认证
- JWT token验证
- 角色-based订阅权限
- 连接限制和清理

### 订阅机制
- 基于角色的频道订阅
- 动态订阅/取消订阅
- 消息过滤

### 错误处理
- 连接断开自动重连
- 消息发送失败重试
- 网络异常处理

## 性能优化
- 消息压缩
- 批量发送
- 连接池管理
- 负载均衡

## 测试要求
- 连接建立测试
- 消息收发测试
- 重连机制测试
- 并发连接测试

## 验收标准
- [ ] 实时消息正常传递
- [ ] 连接稳定可靠
- [ ] 权限控制正确
- [ ] 高并发下性能良好