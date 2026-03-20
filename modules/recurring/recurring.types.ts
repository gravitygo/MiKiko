export type RecurringFrequency = 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly' | 'custom';
export type RecurringType = 'expense' | 'income';

// 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
export type WeekDay = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface RecurringRule {
  id: string;
  name: string;
  type: RecurringType;
  amount: number;
  description: string | null;
  categoryId: string;
  accountId: string;
  frequency: RecurringFrequency;
  customDays: WeekDay[] | null;
  nextDate: string;
  endDate: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RecurringRuleRow {
  id: string;
  name: string;
  type: string;
  amount: number;
  description: string | null;
  category_id: string;
  account_id: string;
  frequency: string;
  custom_days: string | null;
  next_date: string;
  end_date: string | null;
  is_active: number;
  created_at: string;
  updated_at: string;
}

export interface CreateRecurringRuleInput {
  name: string;
  type: RecurringType;
  amount: number;
  description?: string;
  categoryId: string;
  accountId: string;
  frequency: RecurringFrequency;
  customDays?: WeekDay[];
  nextDate: string;
  endDate?: string;
}

export interface UpdateRecurringRuleInput {
  name?: string;
  amount?: number;
  description?: string;
  categoryId?: string;
  accountId?: string;
  frequency?: RecurringFrequency;
  customDays?: WeekDay[];
  nextDate?: string;
  endDate?: string;
}

