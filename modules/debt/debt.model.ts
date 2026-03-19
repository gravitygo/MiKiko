import * as Crypto from 'expo-crypto';
import type { CreateDebtInput, Debt } from './debt.types';

export function createDebt(input: CreateDebtInput): Debt {
  const now = new Date().toISOString();

  return {
    id: Crypto.randomUUID(),
    personName: input.personName,
    direction: input.direction,
    amount: input.amount,
    description: input.description ?? null,
    dueDate: input.dueDate ?? null,
    isSettled: false,
    categoryId: input.categoryId ?? null,
    accountId: input.accountId ?? null,
    createdAt: now,
    updatedAt: now,
  };
}
