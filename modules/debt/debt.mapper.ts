import type { Debt, DebtDirection, DebtRow } from './debt.types';

export function toDebt(row: DebtRow): Debt {
  return {
    id: row.id,
    personName: row.person_name,
    direction: row.direction as DebtDirection,
    amount: row.amount,
    description: row.description,
    dueDate: row.due_date,
    isSettled: row.is_settled === 1,
    categoryId: row.category_id,
    accountId: row.account_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function toDebtRow(debt: Debt): DebtRow {
  return {
    id: debt.id,
    person_name: debt.personName,
    direction: debt.direction,
    amount: debt.amount,
    description: debt.description,
    due_date: debt.dueDate,
    is_settled: debt.isSettled ? 1 : 0,
    category_id: debt.categoryId,
    account_id: debt.accountId,
    created_at: debt.createdAt,
    updated_at: debt.updatedAt,
  };
}
