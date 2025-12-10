# 餐桌管理数据库模式设计

## 目的
为中餐馆点餐系统添加餐桌管理功能，支持餐桌布局、状态跟踪和翻台管理。

## 影响范围
- 数据库：添加Table、TableLayout、Reservation模型
- 后端：扩展Prisma客户端
- 前端：无直接影响（后续proposal处理）

## 实现细节

### 新增模型

```prisma
// 餐桌模型
model Table {
  id          String   @id @default(cuid())
  tableNumber String   @unique
  capacity    Int      // 座位数
  section     String   // 区域（如：main, private, patio）
  status      TableStatus @default(AVAILABLE)
  layoutId    String
  layout      TableLayout @relation(fields: [layoutId], references: [id])
  orders      Order[]
  reservations Reservation[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("tables")
}

// 餐桌布局模型
model TableLayout {
  id        String   @id @default(cuid())
  name      String   @unique
  floorPlan String?  // JSON格式的布局数据
  isActive  Boolean  @default(true)
  tables    Table[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("table_layouts")
}

// 预订模型
model Reservation {
  id          String   @id @default(cuid())
  tableId     String
  customerName String
  customerPhone String?
  partySize   Int
  reservationTime DateTime
  status      ReservationStatus @default(PENDING)
  notes       String?
  table       Table    @relation(fields: [tableId], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("reservations")
}

// 枚举类型
enum TableStatus {
  AVAILABLE
  OCCUPIED
  RESERVED
  CLEANING
  OUT_OF_ORDER
}

enum ReservationStatus {
  PENDING
  CONFIRMED
  CANCELLED
  NO_SHOW
}
```

### 数据库迁移
- 创建新迁移文件
- 更新Prisma客户端生成

## 测试要求
- 餐桌CRUD操作测试
- 状态转换测试
- 关联关系测试

## 验收标准
- [ ] 数据库迁移成功执行
- [ ] Prisma客户端生成无错误
- [ ] 所有测试通过
- [ ] 现有功能不受影响