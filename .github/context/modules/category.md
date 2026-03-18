# Category Module

Manages expense/income categories with budget tracking support.

---

## category.types.ts

Types:
- `CategoryType`: 'expense' | 'income'
- `Category`: domain entity (id, name, icon, color, type, budgetAmount, isDefault, timestamps)
- `CategoryRow`: DB row shape (snake_case fields)
- `CreateCategoryInput`: name, icon, color, type, budgetAmount?
- `UpdateCategoryInput`: all fields optional

---

## category.model.ts

- `createCategory(input)`: builds new Category with UUID + timestamps
- `isExpenseCategory(cat)`: type guard for expense
- `isIncomeCategory(cat)`: type guard for income

---

## category.repository.ts

Factory: `createCategoryRepository()`

- `insert(category)`: writes to DB
- `update(category)`: modifies existing
- `delete(id)`: removes (non-default only, enforced in SQL)
- `findById(id)`: single lookup
- `findAll()`: all categories, defaults first, alpha sorted
- `findByType(type)`: filter by expense/income
- `findDefaults()`: system defaults only
- `findUserCreated()`: user-created only

---

## category.service.ts

Factory: `createCategoryService()`

- `add(input)`: create + persist
- `edit(id, input)`: partial update + persist
- `remove(id)`: delete (blocks defaults, returns false)
- `getById(id)`: single fetch
- `getAll()`: all categories
- `getByType(type)`: filtered by type
- `getExpenseCategories()`: shortcut for expense type
- `getIncomeCategories()`: shortcut for income type
- `getDefaults()`: system defaults
- `getUserCreated()`: user-created categories
- `setBudget(id, amount)`: update budget amount

---

## category.mapper.ts

- `mapRowToCategory(row)`: DB row → domain entity
- `mapCategoryToRow(category)`: domain → DB row (for inserts)

---

## DB Table: categories

| Column | Type | Notes |
|--------|------|-------|
| id | TEXT | PK, UUID |
| name | TEXT | display name |
| icon | TEXT | icon identifier |
| color | TEXT | hex color |
| type | TEXT | 'expense' or 'income' |
| budget_amount | REAL | monthly budget |
| is_default | INTEGER | 1 = system default |
| created_at | TEXT | ISO timestamp |
| updated_at | TEXT | ISO timestamp |

---

## Usage Pattern

```ts
const service = createCategoryService();
const categories = await service.getByType('expense');
await service.setBudget(categoryId, 500);
```

