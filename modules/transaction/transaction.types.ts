export type TransactionType = 'expense' | 'income';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  description: string | null;
  categoryId: string;
  accountId: string;
  date: string;
  recurringRuleId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionRow {
  id: string;
  type: string;
  amount: number;
  description: string | null;
  category_id: string;
  account_id: string;
  date: string;
  recurring_rule_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateTransactionInput {
  type: TransactionType;
  amount: number;
  description?: string;
  categoryId: string;
  accountId: string;
  date: string;
  recurringRuleId?: string;
}

export interface UpdateTransactionInput {
  type?: TransactionType;
  amount?: number;
  description?: string;
  categoryId?: string;
  accountId?: string;
  date?: string;
}

export interface TransactionFilter {
  type?: TransactionType;
  categoryId?: string;
  accountId?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}

