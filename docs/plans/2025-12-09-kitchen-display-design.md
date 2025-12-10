# 厨房显示系统界面设计

## 目的
为厨房工作人员提供订单队列显示界面，支持订单状态跟踪和制作进度管理。

## 影响范围
- 前端：新增kitchen-display页面
- 实时：WebSocket集成
- 打印：订单票据打印支持

## 组件结构

### 主页面组件
```
pages/kitchen/page.tsx
- 订单队列显示
- 状态筛选和排序
- 实时更新
```

### 核心组件
```
components/kitchen/
├── OrderQueue.tsx         // 订单队列列表
├── OrderTicket.tsx        // 订单票据卡片
├── OrderTimer.tsx         // 准备时间计时器
├── StatusUpdater.tsx      // 状态更新按钮
├── PriorityIndicator.tsx  // 优先级指示器
├── RushOrderAlert.tsx     // 加急订单提醒
└── PrintControls.tsx      // 打印控制
```

### 状态管理
```typescript
// stores/kitchenStore.ts
interface KitchenStore {
  activeOrders: Order[];
  completedOrders: Order[];
  filters: KitchenFilters;
  soundEnabled: boolean;

  // Actions
  loadActiveOrders: () => Promise<void>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  markItemReady: (orderId: string, itemId: string) => Promise<void>;
  printOrder: (orderId: string) => void;
  setFilters: (filters: KitchenFilters) => void;
}
```

## 界面功能

### 订单队列
- 按状态分组显示：
  - 待确认：红色高亮
  - 制作中：黄色
  - 准备完成：绿色
- 时间排序（最早优先）
- 优先级排序（加急订单置顶）

### 订单票据
- 桌号和服务员信息
- 菜品列表和修饰符
- 特殊要求高亮显示
- 准备时间显示

### 状态更新
- 一键状态转换
- 批量操作支持
- 撤销操作
- 异常处理

## 实时功能
- 新订单声音提醒
- 状态变更自动更新
- 超时警告
- 厨房通信

## 打印集成
- 自动打印新订单
- 重新打印功能
- 票据格式自定义

## 测试要求
- 实时更新测试
- 状态转换测试
- 打印功能测试
- 性能测试（大量订单）

## 验收标准
- [ ] 订单实时显示
- [ ] 状态更新流畅
- [ ] 打印功能正常
- [ ] 高负载下稳定