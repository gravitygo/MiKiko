import type { Category, CategoryRow, CategoryType } from './category.types';

export function mapRowToCategory(row: CategoryRow): Category {
  return {
    id: row.id,
    name: row.name,
    icon: row.icon,
    color: row.color,
    type: row.type as CategoryType,
    budgetAmount: row.budget_amount,
    isDefault: row.is_default === 1,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapCategoryToRow(category: Category): CategoryRow {
  return {
    id: category.id,
    name: category.name,
    icon: category.icon,
    color: category.color,
    type: category.type,
    budget_amount: category.budgetAmount,
    is_default: category.isDefault ? 1 : 0,
    created_at: category.createdAt,
    updated_at: category.updatedAt,
  };
}

