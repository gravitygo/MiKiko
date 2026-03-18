import { v4 as uuid } from 'uuid';
import type { Category, CategoryType, CreateCategoryInput } from './category.types';

export function createCategory(input: CreateCategoryInput): Category {
  const now = new Date().toISOString();

  return {
    id: uuid(),
    name: input.name,
    icon: input.icon,
    color: input.color,
    type: input.type,
    budgetAmount: input.budgetAmount ?? 0,
    isDefault: false,
    createdAt: now,
    updatedAt: now,
  };
}

export function isExpenseCategory(category: Category): boolean {
  return category.type === 'expense';
}

export function isIncomeCategory(category: Category): boolean {
  return category.type === 'income';
}

