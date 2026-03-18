export type BudgetType = 'monthly' | 'category';

export interface Budget {
  id: string;
  name: string;
  type: BudgetType;
  amount: number;
  categoryId: string | null;
  startDate: string;
  endDate: string;
  alertThreshold: number;
  createdAt: string;
  updatedAt: string;
}

export interface BudgetRow {
  id: string;
  name: string;
  type: string;
  amount: number;
  category_id: string | null;
  start_date: string;
  end_date: string;
  alert_threshold: number;
  created_at: string;
  updated_at: string;
}

export interface CreateBudgetInput {
  name: string;
  type: BudgetType;
  amount: number;
  categoryId?: string;
  startDate: string;
  endDate: string;
  alertThreshold?: number;
}

export interface UpdateBudgetInput {
  name?: string;
  amount?: number;
  alertThreshold?: number;
  startDate?: string;
  endDate?: string;
}

export type BudgetAlertLevel = 'safe' | 'warning' | 'exceeded';

export interface BudgetStatus {
  budget: Budget;
  spent: number;
  remaining: number;
  percentage: number;
  alertLevel: BudgetAlertLevel;
}

