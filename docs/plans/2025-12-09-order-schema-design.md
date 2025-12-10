# 订单管理数据库模式设计

## 目的
为中餐馆点餐系统添加订单管理功能，支持订单创建、状态跟踪和历史记录。

## 影响范围
- 数据库：添加Order、OrderItem、OrderStatus模型
- 后端：扩展Prisma客户端
- 前端：无直接影响

## 实现细节

### 新增模型

```prisma
// 订单模型
model Order {
  id            String      @id @default(cuid())
  orderNumber   String      @unique
  tableId       String?
  table         Table?      @relation(fields: [tableId], references: [id])
  serverId      String      // 服务员ID
  server        User        @relation(fields: [serverId], references: [id])
  status        OrderStatus @default(PENDING)
  orderType     OrderType   @default(DINE_IN)
  subtotal      Float
  tax           Float
  tip           Float       @default(0)
  total         Float
  notes         String?
  items         OrderItem[]
  payments      Payment[]
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt

  @@map("orders")
}

// 订单项模型
model OrderItem {
  id          String     @id @default(cuid())
  orderId     String
  order       Order      @relation(fields: [orderId], references: [id])
  menuItemId  String
  menuItem    MenuItem   @relation(fields: [menuItemId], references: [id])
  quantity    Int
  unitPrice   Float
  totalPrice  Float
  notes       String?
  modifiers   Modifier[]
  status      ItemStatus @default(PENDING)
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  @@map("order_items")
}

// 支付模型
model Payment {
  id            String        @id @default(cuid())
  orderId       String
  order         Order         @relation(fields: [orderId], references: [id])
  amount        Float
  paymentMethod PaymentMethod
  status        PaymentStatus @default(PENDING)
  transactionId String?
  processedAt   DateTime?
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt

  @@map("payments")
}

// 枚举类型
enum OrderStatus {
  PENDING     // 待确认
  CONFIRMED   // 已确认
  PREPARING   // 制作中
  READY       // 待上菜
  SERVED      // 已上菜
  COMPLETED   // 已完成
  CANCELLED   // 已取消
}

enum OrderType {
  DINE_IN     // 堂食
  TAKEOUT     // 外卖
  DELIVERY    // 配送
}

enum ItemStatus {
  PENDING     // 待制作
  PREPARING   // 制作中
  READY       // 准备完成
  SERVED      // 已上菜
}

enum PaymentMethod {
  CASH
  CREDIT_CARD
  DEBIT_CARD
  DIGITAL_WALLET
  SPLIT
}

enum PaymentStatus {
  PENDING
  PROCESSING
  COMPLETED
  FAILED
  REFUNDED
}
```

### 数据库迁移
- 创建新迁移文件
- 更新Prisma客户端生成
- 添加订单编号生成逻辑

## 测试要求
- 订单创建和状态转换测试
- 订单项关联测试
- 支付处理测试

## 验收标准
- [ ] 数据库迁移成功执行
- [ ] 订单编号唯一生成
- [ ] 状态机正确工作
- [ ] 所有测试通过