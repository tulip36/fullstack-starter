# 菜单管理API设计

## 目的
为菜单管理功能提供RESTful API端点，支持菜品、分类和修饰符的CRUD操作。

## 影响范围
- 后端：新增menu路由和处理器
- 前端：API客户端集成
- 数据库：使用已设计的Menu相关模型

## API端点设计

### 菜单分类管理
```
GET /api/v1/menu/categories
- 获取所有分类
- 支持排序

POST /api/v1/menu/categories
- 创建新分类（管理员权限）

PUT /api/v1/menu/categories/:id
- 更新分类（管理员权限）

DELETE /api/v1/menu/categories/:id
- 删除分类（管理员权限）
```

### 菜单项管理
```
GET /api/v1/menu/items
- 获取所有菜单项
- 支持过滤：category, active, spicy
- 支持搜索：name

GET /api/v1/menu/items/:id
- 获取单个菜单项详情（包含修饰符）

POST /api/v1/menu/items
- 创建新菜单项（管理员权限）

PUT /api/v1/menu/items/:id
- 更新菜单项（管理员权限）

DELETE /api/v1/menu/items/:id
- 删除菜单项（管理员权限）
```

### 修饰符管理
```
GET /api/v1/menu/modifiers/groups
- 获取所有修饰符组

POST /api/v1/menu/modifiers/groups
- 创建修饰符组（管理员权限）

POST /api/v1/menu/modifiers
- 创建修饰符（管理员权限）

PUT /api/v1/menu/modifiers/:id
- 更新修饰符（管理员权限）
```

## 请求/响应格式

### 菜单项对象
```json
{
  "id": "string",
  "name": "Kung Pao Chicken",
  "nameZh": "宫保鸡丁",
  "description": "Spicy diced chicken with peanuts",
  "price": 15.99,
  "categoryId": "string",
  "isActive": true,
  "isSpicy": true,
  "allergens": ["peanuts", "soy"],
  "prepTime": 15,
  "modifierGroups": [
    {
      "id": "string",
      "name": "Spice Level",
      "nameZh": "辣度",
      "isRequired": true,
      "modifiers": [
        {
          "id": "string",
          "name": "Mild",
          "nameZh": "微辣",
          "price": 0
        }
      ]
    }
  ]
}
```

## 权限要求
- 管理员：完全CRUD权限
- 服务员：只读权限
- 厨房：只读权限

## 缓存策略
- 菜单数据缓存1小时
- 分类数据缓存24小时
- 缓存失效时自动刷新

## 测试要求
- CRUD操作测试
- 关联数据测试
- 缓存机制测试
- 权限控制测试

## 验收标准
- [ ] 所有API端点正常工作
- [ ] 菜单数据正确关联
- [ ] 缓存机制有效
- [ ] API文档完整