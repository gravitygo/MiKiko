import { createTransaction, duplicateTransaction } from './transaction.model';
import { createTransactionRepository } from './transaction.repository';
import { createAccountService } from '@/modules/account';
import type {
  Transaction,
  CreateTransactionInput,
  UpdateTransactionInput,
  TransactionFilter,
} from './transaction.types';

export function createTransactionService() {
  const repository = createTransactionRepository();
  const accountService = createAccountService();

  async function adjustAccountBalance(
    accountId: string,
    amount: number,
    type: 'expense' | 'income',
    reverse = false
  ): Promise<void> {
    const adjustment = type === 'expense' ? -amount : amount;
    const finalAdjustment = reverse ? -adjustment : adjustment;

    if (finalAdjustment > 0) {
      await accountService.credit(accountId, Math.abs(finalAdjustment));
    } else {
      await accountService.debit(accountId, Math.abs(finalAdjustment));
    }
  }

  return {
    async add(input: CreateTransactionInput): Promise<Transaction> {
      const transaction = createTransaction(input);
      await repository.insert(transaction);
      await adjustAccountBalance(input.accountId, input.amount, input.type);
      return transaction;
    },

    async edit(id: string, input: UpdateTransactionInput): Promise<Transaction | null> {
      const existing = await repository.findById(id);
      if (!existing) return null;

      await adjustAccountBalance(existing.accountId, existing.amount, existing.type, true);

      const updated: Transaction = {
        ...existing,
        type: input.type ?? existing.type,
        amount: input.amount ?? existing.amount,
        description: input.description ?? existing.description,
        categoryId: input.categoryId ?? existing.categoryId,
        accountId: input.accountId ?? existing.accountId,
        date: input.date ?? existing.date,
        updatedAt: new Date().toISOString(),
      };

      await repository.update(updated);
      await adjustAccountBalance(updated.accountId, updated.amount, updated.type);

      return updated;
    },

    async remove(id: string): Promise<boolean> {
      const existing = await repository.findById(id);
      if (!existing) return false;

      await adjustAccountBalance(existing.accountId, existing.amount, existing.type, true);
      await repository.delete(id);
      return true;
    },

    async duplicate(id: string): Promise<Transaction | null> {
      const existing = await repository.findById(id);
      if (!existing) return null;

      const duplicated = duplicateTransaction(existing);
      await repository.insert(duplicated);
      await adjustAccountBalance(duplicated.accountId, duplicated.amount, duplicated.type);

      return duplicated;
    },

    async getById(id: string): Promise<Transaction | null> {
      return repository.findById(id);
    },

    async getAll(filter: TransactionFilter = {}): Promise<Transaction[]> {
      return repository.findAll(filter);
    },

    async getByDateRange(startDate: string, endDate: string): Promise<Transaction[]> {
      return repository.findByDateRange(startDate, endDate);
    },

    async getByCategory(categoryId: string, limit = 50): Promise<Transaction[]> {
      return repository.findByCategory(categoryId, limit);
    },

    async getTotalExpenses(startDate: string, endDate: string): Promise<number> {
      return repository.sumByType('expense', startDate, endDate);
    },

    async getTotalIncome(startDate: string, endDate: string): Promise<number> {
      return repository.sumByType('income', startDate, endDate);
    },

    async getCategoryTotal(categoryId: string, startDate: string, endDate: string): Promise<number> {
      return repository.sumByCategory(categoryId, startDate, endDate);
    },

    async count(filter: TransactionFilter = {}): Promise<number> {
      return repository.count(filter);
    },
  };
}

export type TransactionService = ReturnType<typeof createTransactionService>;

