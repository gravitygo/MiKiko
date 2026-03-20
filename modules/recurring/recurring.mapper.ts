import type { RecurringFrequency, RecurringRule, RecurringRuleRow, RecurringType, WeekDay } from './recurring.types';

export function mapRowToRecurringRule(row: RecurringRuleRow): RecurringRule {
  let customDays: WeekDay[] | null = null;
  if (row.custom_days) {
    try {
      customDays = JSON.parse(row.custom_days) as WeekDay[];
    } catch {
      customDays = null;
    }
  }

  return {
    id: row.id,
    name: row.name,
    type: row.type as RecurringType,
    amount: row.amount,
    description: row.description,
    categoryId: row.category_id,
    accountId: row.account_id,
    frequency: row.frequency as RecurringFrequency,
    customDays,
    nextDate: row.next_date,
    endDate: row.end_date ?? null,
    isActive: row.is_active === 1,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapRecurringRuleToRow(rule: RecurringRule): RecurringRuleRow {
  return {
    id: rule.id,
    name: rule.name,
    type: rule.type,
    amount: rule.amount,
    description: rule.description,
    category_id: rule.categoryId,
    account_id: rule.accountId,
    frequency: rule.frequency,
    custom_days: rule.customDays ? JSON.stringify(rule.customDays) : null,
    next_date: rule.nextDate,
    end_date: rule.endDate,
    is_active: rule.isActive ? 1 : 0,
    created_at: rule.createdAt,
    updated_at: rule.updatedAt,
  };
}

