# Account Module

Manages financial accounts (wallets) with balance tracking and credit/debit operations.

---

## account.types.ts

Types:
- `AccountType`: 'cash' | 'bank' | 'credit_card' | 'e_wallet'
- `Account`: domain entity (id, name, type, balance, icon, color, isDefault, timestamps)
- `AccountRow`: DB row shape (snake_case)
- `CreateAccountInput`: name, type, balance?, icon?, color?
- `UpdateAccountInput`: all fields optional

---

## account.model.ts

- `createAccount(input)`: builds new Account with UUID + timestamps, default balance 0
- `adjustBalance(account, amount)`: returns new Account with adjusted balance

---

## account.repository.ts

Factory: `createAccountRepository()`

- `insert(account)`: writes to DB
- `update(account)`: modifies existing
- `delete(id)`: removes by id
- `findById(id)`: single lookup
- `findAll()`: all accounts sorted by default first
- `findByType(type)`: filter by account type
- `findDefault()`: get default account
- `updateBalance(id, balance)`: direct balance update

---

## account.service.ts

Factory: `createAccountService()`

- `add(input)`: create + persist
- `edit(id, input)`: update metadata (not balance)
- `remove(id)`: delete account
- `getById(id)`: single fetch
- `getAll()`: all accounts
- `getByType(type)`: filtered by type
- `getDefault()`: fetch default account
- `credit(id, amount)`: increase balance (used by income transactions)
- `debit(id, amount)`: decrease balance (used by expense transactions)
- `setBalance(id, balance)`: direct balance set
- `getTotalBalance()`: sum of all account balances

---

## account.mapper.ts

- `mapRowToAccount(row)`: DB row → domain entity

---

## DB Table: accounts

| Column | Type | Notes |
|--------|------|-------|
| id | TEXT | PK, UUID |
| name | TEXT | display name |
| type | TEXT | 'cash', 'bank', etc |
| balance | REAL | current balance |
| icon | TEXT | icon identifier |
| color | TEXT | hex color |
| is_default | INTEGER | 1 = default account |
| created_at | TEXT | ISO timestamp |
| updated_at | TEXT | ISO timestamp |

---

## Usage Pattern

```ts
const service = createAccountService();
const account = await service.getDefault();
await service.debit(account.id, 50000); // expense
await service.credit(account.id, 100000); // income
```

