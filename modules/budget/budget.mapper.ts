import type { Budget, BudgetRow, BudgetType } from './budget.types';

export function mapRowToBudget(row: BudgetRow): Budget {
  return {
    id: row.id,
    name: row.name,
    type: row.type as BudgetType,
    amount: row.amount,
    categoryId: row.category_id,
    startDate: row.start_date,
    endDate: row.end_date,
    alertThreshold: row.alert_threshold,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapBudgetToRow(budget: Budget): BudgetRow {
  return {
    id: budget.id,
    name: budget.name,
    type: budget.type,
    amount: budget.amount,
    category_id: budget.categoryId,
    start_date: budget.startDate,
    end_date: budget.endDate,
    alert_threshold: budget.alertThreshold,
    created_at: budget.createdAt,
    updated_at: budget.updatedAt,
  };
}

