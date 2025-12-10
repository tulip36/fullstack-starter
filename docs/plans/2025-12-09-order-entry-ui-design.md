# 订单录入界面组件设计

## 目的
为服务员提供直观的订单录入界面，支持快速点餐、修饰符选择和订单管理。

## 影响范围
- 前端：新增order-entry页面和组件
- UI：扩展现有组件库
- 状态管理：订单临时状态管理

## 组件结构

### 主页面组件
```
pages/orders/new/page.tsx
- 订单录入主界面
- 餐桌选择
- 菜单浏览
- 订单摘要
```

### 核心组件
```
components/orders/
├── OrderHeader.tsx        // 订单头部（桌号、服务员、时间）
├── MenuBrowser.tsx        // 菜单浏览和搜索
├── MenuItemCard.tsx       // 菜单项卡片
├── ModifierSelector.tsx   // 修饰符选择器
├── OrderSummary.tsx       // 订单摘要
├── OrderItemList.tsx      // 已选菜品列表
├── OrderActions.tsx       // 订单操作按钮
└── QuickOrderPad.tsx      // 快速点餐键盘
```

### 状态管理
```typescript
// stores/orderStore.ts
interface OrderStore {
  currentOrder: Partial<Order>;
  selectedItems: OrderItem[];
  menuItems: MenuItem[];
  categories: MenuCategory[];

  // Actions
  startNewOrder: (tableId: string) => void;
  addItem: (menuItem: MenuItem, modifiers: Modifier[]) => void;
  updateItem: (itemId: string, updates: Partial<OrderItem>) => void;
  removeItem: (itemId: string) => void;
  submitOrder: () => Promise<Order>;
  loadMenu: () => Promise<void>;
}
```

## 界面功能

### 菜单浏览
- 分类标签页导航
- 搜索功能（中英文）
- 菜品图片和描述
- 价格和辣度标识

### 修饰符选择
- 模态框选择界面
- 必选/可选修饰符区分
- 数量限制控制
- 价格动态计算

### 订单管理
- 实时小计更新
- 菜品数量调整
- 特殊要求输入
- 订单确认前预览

## 快捷操作
- 常用菜品快捷键
- 批量添加功能
- 复制上次订单
- 模板订单

## 移动优化
- 大按钮设计
- 手势操作支持
- 语音输入（未来扩展）

## 测试要求
- 订单创建流程测试
- 修饰符选择测试
- 状态同步测试
- 错误处理测试

## 验收标准
- [ ] 订单录入流程完整
- [ ] 修饰符选择直观
- [ ] 实时计算准确
- [ ] 移动端操作便捷