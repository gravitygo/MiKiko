import type { Account, AccountRow, AccountType } from './account.types';

export function mapRowToAccount(row: AccountRow): Account {
  return {
    id: row.id,
    name: row.name,
    type: row.type as AccountType,
    balance: row.balance,
    icon: row.icon,
    color: row.color,
    isDefault: row.is_default === 1,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapAccountToRow(account: Account): AccountRow {
  return {
    id: account.id,
    name: account.name,
    type: account.type,
    balance: account.balance,
    icon: account.icon,
    color: account.color,
    is_default: account.isDefault ? 1 : 0,
    created_at: account.createdAt,
    updated_at: account.updatedAt,
  };
}

