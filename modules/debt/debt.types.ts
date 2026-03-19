export type DebtDirection = 'payable' | 'receivable';

export interface Debt {
  id: string;
  personName: string;
  direction: DebtDirection;
  amount: number;
  description: string | null;
  dueDate: string | null;
  isSettled: boolean;
  categoryId: string | null;
  accountId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DebtRow {
  id: string;
  person_name: string;
  direction: string;
  amount: number;
  description: string | null;
  due_date: string | null;
  is_settled: number;
  category_id: string | null;
  account_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateDebtInput {
  personName: string;
  direction: DebtDirection;
  amount: number;
  description?: string;
  dueDate?: string;
  categoryId?: string;
  accountId?: string;
}

export interface UpdateDebtInput {
  personName?: string;
  amount?: number;
  description?: string;
  dueDate?: string | null;
}
