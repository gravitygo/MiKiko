# Transaction Module

Core module for expense/income tracking with account balance management.

---

## transaction.types.ts

Types:
- `TransactionType`: 'expense' | 'income'
- `Transaction`: domain entity (id, type, amount, description, categoryId, accountId, date, timestamps)
- `TransactionRow`: DB row shape (snake_case)
- `TransactionFilter`: query params (type?, categoryId?, accountId?, startDate?, endDate?, limit?, offset?)
- `CreateTransactionInput`: required fields for creation
- `UpdateTransactionInput`: all fields optional for partial update

---

## transaction.model.ts

- `createTransaction(input)`: builds new Transaction with UUID + timestamps
- `duplicateTransaction(tx)`: clones with new id + today's date

---

## transaction.repository.ts

Factory: `createTransactionRepository()`

- `insert(tx)`: writes to DB
- `update(tx)`: modifies existing
- `delete(id)`: removes by id
- `findById(id)`: single lookup
- `findAll(filter)`: paginated fetch with optional filters
- `findByDateRange(start, end)`: date-bounded query
- `findByCategory(categoryId, limit)`: category-filtered
- `sumByType(type, start, end)`: total expense or income
- `sumByCategory(categoryId, start, end)`: category spending
- `count(filter)`: total matching records

---

## transaction.service.ts

Factory: `createTransactionService()`

- `add(input)`: create + persist + adjust account balance
- `edit(id, input)`: update + rebalance account (reverses old, applies new)
- `remove(id)`: delete + reverse balance
- `duplicate(id)`: clone transaction with new id/date + adjust balance
- `getById(id)`: single fetch
- `getAll(filter)`: filtered list
- `getByDateRange(start, end)`: date range query
- `getByCategory(categoryId, limit)`: category transactions
- `getTotalExpenses(start, end)`: sum of expense type
- `getTotalIncome(start, end)`: sum of income type
- `getCategoryTotal(categoryId, start, end)`: category spending
- `count(filter)`: filtered count

**Key Logic:**
- `adjustAccountBalance()`: internal helper, credits/debits account based on transaction type

---

## transaction.mapper.ts

- `mapRowToTransaction(row)`: DB row → domain entity

---

## DB Table: transactions

| Column | Type | Notes |
|--------|------|-------|
| id | TEXT | PK, UUID |
| type | TEXT | 'expense' or 'income' |
| amount | REAL | transaction amount |
| description | TEXT | optional note |
| category_id | TEXT | FK to categories |
| account_id | TEXT | FK to accounts |
| date | TEXT | ISO timestamp |
| created_at | TEXT | ISO timestamp |
| updated_at | TEXT | ISO timestamp |

---

## Usage Pattern

```ts
const service = createTransactionService();
const tx = await service.add({
  type: 'expense',
  amount: 50000,
  categoryId: 'cat-id',
  accountId: 'acc-id',
  date: new Date().toISOString(),
});
```

