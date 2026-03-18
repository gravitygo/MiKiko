import { v4 as uuid } from 'uuid';
import type { Budget, BudgetAlertLevel, BudgetStatus, CreateBudgetInput } from './budget.types';

export function createBudget(input: CreateBudgetInput): Budget {
  const now = new Date().toISOString();

  return {
    id: uuid(),
    name: input.name,
    type: input.type,
    amount: input.amount,
    categoryId: input.categoryId ?? null,
    startDate: input.startDate,
    endDate: input.endDate,
    alertThreshold: input.alertThreshold ?? 0.8,
    createdAt: now,
    updatedAt: now,
  };
}

export function calculateAlertLevel(percentage: number, threshold: number): BudgetAlertLevel {
  if (percentage >= 1) return 'exceeded';
  if (percentage >= threshold) return 'warning';
  return 'safe';
}

export function createBudgetStatus(budget: Budget, spent: number): BudgetStatus {
  const remaining = Math.max(0, budget.amount - spent);
  const percentage = budget.amount > 0 ? spent / budget.amount : 0;
  const alertLevel = calculateAlertLevel(percentage, budget.alertThreshold);

  return {
    budget,
    spent,
    remaining,
    percentage,
    alertLevel,
  };
}

export function getMonthDateRange(date: Date = new Date()): { startDate: string; endDate: string } {
  const year = date.getFullYear();
  const month = date.getMonth();

  const startDate = new Date(year, month, 1).toISOString().split('T')[0];
  const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0];

  return { startDate, endDate };
}

