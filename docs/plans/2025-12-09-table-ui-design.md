# 餐桌管理界面组件设计

## 目的
为服务员和迎宾提供餐桌状态可视化管理界面，支持餐桌分配、状态更新和预订管理。

## 影响范围
- 前端：新增table-management页面和组件
- UI：使用现有组件库
- 状态管理：集成Zustand store

## 组件结构

### 主页面组件
```
pages/tables/page.tsx
- 餐桌布局显示
- 状态筛选器
- 实时状态更新
```

### 核心组件
```
components/tables/
├── TableGrid.tsx          // 餐桌网格布局
├── TableCard.tsx          // 单个餐桌卡片
├── TableStatusBadge.tsx   // 状态徽章
├── TableActions.tsx       // 餐桌操作按钮
├── TableReservationModal.tsx // 预订模态框
└── TableLayoutSelector.tsx   // 布局选择器
```

### 状态管理
```typescript
// stores/tableStore.ts
interface TableStore {
  tables: Table[];
  currentLayout: TableLayout;
  selectedTable: Table | null;
  filters: TableFilters;

  // Actions
  loadTables: () => Promise<void>;
  updateTableStatus: (id: string, status: TableStatus) => Promise<void>;
  selectTable: (table: Table) => void;
  setFilters: (filters: TableFilters) => void;
}
```

## 界面功能

### 餐桌网格
- 视觉化显示餐桌布局
- 颜色编码状态：
  - 绿色：可用
  - 红色：占用
  - 黄色：预订
  - 灰色：清理中
  - 黑色：故障

### 餐桌卡片
- 显示桌号、座位数、区域
- 当前订单信息
- 最后更新时间
- 快速操作按钮

### 操作功能
- 点击餐桌查看详情
- 拖拽分配顾客
- 右键菜单快速操作
- 批量状态更新

## 响应式设计
- 桌面：完整网格布局
- 平板：优化触摸操作
- 手机：列表视图

## 实时更新
- WebSocket连接状态变化
- 自动刷新餐桌状态
- 冲突解决机制

## 测试要求
- 组件渲染测试
- 用户交互测试
- 状态管理测试
- 响应式布局测试

## 验收标准
- [ ] 餐桌布局正确显示
- [ ] 状态更新实时同步
- [ ] 触摸操作流畅
- [ ] 所有交互正常工作