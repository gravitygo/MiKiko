import { v4 as uuid } from 'uuid';
import type { Account, CreateAccountInput } from './account.types';

export function createAccount(input: CreateAccountInput): Account {
  const now = new Date().toISOString();

  return {
    id: uuid(),
    name: input.name,
    type: input.type,
    balance: input.balance ?? 0,
    icon: input.icon,
    color: input.color,
    isDefault: false,
    createdAt: now,
    updatedAt: now,
  };
}

export function adjustBalance(account: Account, amount: number): Account {
  return {
    ...account,
    balance: account.balance + amount,
    updatedAt: new Date().toISOString(),
  };
}

