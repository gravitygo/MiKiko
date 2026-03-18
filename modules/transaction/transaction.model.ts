import { v4 as uuid } from 'uuid';
import type { Transaction, TransactionType, CreateTransactionInput } from './transaction.types';

export function createTransaction(input: CreateTransactionInput): Transaction {
  const now = new Date().toISOString();

  return {
    id: uuid(),
    type: input.type,
    amount: input.amount,
    description: input.description ?? null,
    categoryId: input.categoryId,
    accountId: input.accountId,
    date: input.date,
    recurringRuleId: input.recurringRuleId ?? null,
    createdAt: now,
    updatedAt: now,
  };
}

export function isExpense(transaction: Transaction): boolean {
  return transaction.type === 'expense';
}

export function isIncome(transaction: Transaction): boolean {
  return transaction.type === 'income';
}

export function duplicateTransaction(transaction: Transaction): Transaction {
  const now = new Date().toISOString();

  return {
    ...transaction,
    id: uuid(),
    recurringRuleId: null,
    createdAt: now,
    updatedAt: now,
  };
}

