# Database

SQLite via expo-sqlite.

---

## Tables

- transactions
- categories
- accounts
- budgets
- recurring_rules

---

## Indexes

- transactions(date)
- transactions(category_id)
- transactions(account_id)
- transactions(type)
- budgets(type)
- budgets(category_id)
- recurring_rules(next_date)
- recurring_rules(is_active)

---

## database/schema.ts

- CREATE_TABLES: full SQL schema
- DEFAULT_CATEGORIES: 12 presets
- DEFAULT_ACCOUNTS: 4 presets

---

## database/index.ts

- getDatabase(): singleton connection
- initializeDatabase(): creates tables + seeds
- closeDatabase(): cleanup

