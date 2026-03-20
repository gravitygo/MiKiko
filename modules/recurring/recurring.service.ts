import { createTransactionService } from '@/modules/transaction/transaction.service';
import { calculateNextDate, createRecurringRule } from './recurring.model';
import { createRecurringRepository } from './recurring.repository';
import type {
    CreateRecurringRuleInput,
    RecurringRule,
    UpdateRecurringRuleInput,
} from './recurring.types';

export function createRecurringService() {
  const repository = createRecurringRepository();

  return {
    async add(input: CreateRecurringRuleInput): Promise<RecurringRule> {
      const rule = createRecurringRule(input);
      await repository.insert(rule);
      return rule;
    },

    async edit(id: string, input: UpdateRecurringRuleInput): Promise<RecurringRule | null> {
      const existing = await repository.findById(id);
      if (!existing) return null;

      const updated: RecurringRule = {
        ...existing,
        name: input.name ?? existing.name,
        amount: input.amount ?? existing.amount,
        description: input.description ?? existing.description,
        categoryId: input.categoryId ?? existing.categoryId,
        accountId: input.accountId ?? existing.accountId,
        frequency: input.frequency ?? existing.frequency,
        customDays: input.customDays !== undefined ? input.customDays : existing.customDays,
        nextDate: input.nextDate ?? existing.nextDate,
        updatedAt: new Date().toISOString(),
      };

      await repository.update(updated);
      return updated;
    },

    async remove(id: string): Promise<boolean> {
      const existing = await repository.findById(id);
      if (!existing) return false;

      await repository.delete(id);
      return true;
    },

    async getById(id: string): Promise<RecurringRule | null> {
      return repository.findById(id);
    },

    async getAll(): Promise<RecurringRule[]> {
      return repository.findAll();
    },

    async getActive(): Promise<RecurringRule[]> {
      return repository.findActive();
    },

    async getDue(date: string = new Date().toISOString().split('T')[0]): Promise<RecurringRule[]> {
      return repository.findDue(date);
    },

    async pause(id: string): Promise<boolean> {
      const existing = await repository.findById(id);
      if (!existing) return false;

      await repository.setActive(id, false);
      return true;
    },

    async resume(id: string): Promise<boolean> {
      const existing = await repository.findById(id);
      if (!existing) return false;

      await repository.setActive(id, true);
      return true;
    },

    async skipNext(id: string): Promise<RecurringRule | null> {
      const existing = await repository.findById(id);
      if (!existing) return null;

      const nextDate = calculateNextDate(existing.nextDate, existing.frequency, existing.customDays);
      await repository.updateNextDate(id, nextDate);

      return { ...existing, nextDate, updatedAt: new Date().toISOString() };
    },

    async processDue(): Promise<number> {
      const transactionService = createTransactionService();
      const today = new Date().toISOString().split('T')[0];
      const dueRules = await repository.findDue(today);

      let processed = 0;

      for (const rule of dueRules) {
        await transactionService.add({
          type: rule.type,
          amount: rule.amount,
          description: rule.description ?? rule.name,
          categoryId: rule.categoryId,
          accountId: rule.accountId,
          date: rule.nextDate,
          recurringRuleId: rule.id,
        });

        const nextDate = calculateNextDate(rule.nextDate, rule.frequency, rule.customDays);
        await repository.updateNextDate(rule.id, nextDate);

        processed++;
      }

      return processed;
    },
  };
}

export type RecurringService = ReturnType<typeof createRecurringService>;

