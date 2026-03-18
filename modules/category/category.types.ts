export type CategoryType = 'expense' | 'income';

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: CategoryType;
  budgetAmount: number;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryRow {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: string;
  budget_amount: number;
  is_default: number;
  created_at: string;
  updated_at: string;
}

export interface CreateCategoryInput {
  name: string;
  icon: string;
  color: string;
  type: CategoryType;
  budgetAmount?: number;
}

export interface UpdateCategoryInput {
  name?: string;
  icon?: string;
  color?: string;
  type?: CategoryType;
  budgetAmount?: number;
}

