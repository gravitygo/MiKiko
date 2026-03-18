import type { Transaction, TransactionRow, TransactionType } from './transaction.types';

export function mapRowToTransaction(row: TransactionRow): Transaction {
  return {
    id: row.id,
    type: row.type as TransactionType,
    amount: row.amount,
    description: row.description,
    categoryId: row.category_id,
    accountId: row.account_id,
    date: row.date,
    recurringRuleId: row.recurring_rule_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapTransactionToRow(transaction: Transaction): TransactionRow {
  return {
    id: transaction.id,
    type: transaction.type,
    amount: transaction.amount,
    description: transaction.description,
    category_id: transaction.categoryId,
    account_id: transaction.accountId,
    date: transaction.date,
    recurring_rule_id: transaction.recurringRuleId,
    created_at: transaction.createdAt,
    updated_at: transaction.updatedAt,
  };
}

