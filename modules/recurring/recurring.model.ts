import * as Crypto from 'expo-crypto';
import type { CreateRecurringRuleInput, RecurringFrequency, RecurringRule, WeekDay } from './recurring.types';

export function createRecurringRule(input: CreateRecurringRuleInput): RecurringRule {
  const now = new Date().toISOString();

  return {
    id: Crypto.randomUUID(),
    name: input.name,
    type: input.type,
    amount: input.amount,
    description: input.description ?? null,
    categoryId: input.categoryId,
    accountId: input.accountId,
    frequency: input.frequency,
    customDays: input.customDays ?? null,
    nextDate: input.nextDate,
    endDate: input.endDate ?? null,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  };
}

function findNextCustomDay(currentDate: string, customDays: WeekDay[]): string {
  if (customDays.length === 0) return currentDate;
  const sorted = [...customDays].sort((a, b) => a - b);
  const date = new Date(currentDate);
  // Start from next day, search up to 7 days
  for (let i = 1; i <= 7; i++) {
    const next = new Date(date);
    next.setDate(date.getDate() + i);
    if (sorted.includes(next.getDay() as WeekDay)) {
      return next.toISOString().split('T')[0];
    }
  }
  return currentDate;
}

function findPrevCustomDay(currentDate: string, customDays: WeekDay[]): string {
  if (customDays.length === 0) return currentDate;
  const sorted = [...customDays].sort((a, b) => a - b);
  const date = new Date(currentDate);
  for (let i = 1; i <= 7; i++) {
    const prev = new Date(date);
    prev.setDate(date.getDate() - i);
    if (sorted.includes(prev.getDay() as WeekDay)) {
      return prev.toISOString().split('T')[0];
    }
  }
  return currentDate;
}

export function calculateNextDate(currentDate: string, frequency: RecurringFrequency, customDays?: WeekDay[] | null): string {
  const date = new Date(currentDate);

  switch (frequency) {
    case 'daily':
      date.setDate(date.getDate() + 1);
      break;
    case 'weekly':
      date.setDate(date.getDate() + 7);
      break;
    case 'biweekly':
      date.setDate(date.getDate() + 14);
      break;
    case 'monthly':
      date.setMonth(date.getMonth() + 1);
      break;
    case 'quarterly':
      date.setMonth(date.getMonth() + 3);
      break;
    case 'yearly':
      date.setFullYear(date.getFullYear() + 1);
      break;
    case 'custom':
      return findNextCustomDay(currentDate, customDays ?? []);
  }

  return date.toISOString().split('T')[0];
}

export function calculatePreviousDate(currentDate: string, frequency: RecurringFrequency, customDays?: WeekDay[] | null): string {
  const date = new Date(currentDate);

  switch (frequency) {
    case 'daily':
      date.setDate(date.getDate() - 1);
      break;
    case 'weekly':
      date.setDate(date.getDate() - 7);
      break;
    case 'biweekly':
      date.setDate(date.getDate() - 14);
      break;
    case 'monthly':
      date.setMonth(date.getMonth() - 1);
      break;
    case 'quarterly':
      date.setMonth(date.getMonth() - 3);
      break;
    case 'yearly':
      date.setFullYear(date.getFullYear() - 1);
      break;
    case 'custom':
      return findPrevCustomDay(currentDate, customDays ?? []);
  }

  return date.toISOString().split('T')[0];
}

