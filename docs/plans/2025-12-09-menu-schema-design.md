# 菜单管理数据库模式设计

## 目的
为中餐馆点餐系统添加菜单管理功能，支持菜品分类、定价、修饰符和库存管理。

## 影响范围
- 数据库：添加MenuItem、MenuCategory、Modifier、ModifierGroup模型
- 后端：扩展Prisma客户端
- 前端：无直接影响

## 实现细节

### 新增模型

```prisma
// 菜单分类模型
model MenuCategory {
  id          String     @id @default(cuid())
  name        String     @unique
  nameZh      String?    // 中文名称
  description String?
  sortOrder   Int        @default(0)
  isActive    Boolean    @default(true)
  items       MenuItem[]
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  @@map("menu_categories")
}

// 菜单项模型
model MenuItem {
  id          String        @id @default(cuid())
  name        String
  nameZh      String?       // 中文名称
  description String?
  price       Float
  image       String?
  categoryId  String
  category    MenuCategory  @relation(fields: [categoryId], references: [id])
  modifiers   ModifierGroup[]
  isActive    Boolean       @default(true)
  isSpicy     Boolean       @default(false)
  allergens   String[]      // 过敏原数组
  prepTime    Int?          // 准备时间（分钟）
  sortOrder   Int           @default(0)
  orderItems  OrderItem[]
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt

  @@map("menu_items")
}

// 修饰符组模型
model ModifierGroup {
  id          String     @id @default(cuid())
  name        String
  nameZh      String?
  isRequired  Boolean    @default(false)
  maxSelect   Int?       // 最多选择数量
  minSelect   Int        @default(0)
  menuItemId  String
  menuItem    MenuItem   @relation(fields: [menuItemId], references: [id])
  modifiers   Modifier[]
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  @@map("modifier_groups")
}

// 修饰符模型
model Modifier {
  id        String         @id @default(cuid())
  name      String
  nameZh    String?
  price     Float          @default(0)
  groupId   String
  group     ModifierGroup  @relation(fields: [groupId], references: [id])
  orderItems OrderItem[]
  createdAt DateTime       @default(now())
  updatedAt DateTime       @updatedAt

  @@map("modifiers")
}
```

### 数据库迁移
- 创建新迁移文件
- 更新Prisma客户端生成
- 添加种子数据用于测试

## 测试要求
- 菜单项CRUD操作测试
- 修饰符关联测试
- 分类层级测试

## 验收标准
- [ ] 数据库迁移成功执行
- [ ] Prisma客户端生成无错误
- [ ] 菜单数据正确关联
- [ ] 所有测试通过