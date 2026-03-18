import { getDatabase } from '@/database';
import { mapRowToBudget } from './budget.mapper';
import type { Budget, BudgetRow, BudgetType } from './budget.types';

export function createBudgetRepository() {
  return {
    async insert(budget: Budget): Promise<void> {
      const db = await getDatabase();
      await db.runAsync(
        `INSERT INTO budgets (id, name, type, amount, category_id, start_date, end_date, alert_threshold, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          budget.id,
          budget.name,
          budget.type,
          budget.amount,
          budget.categoryId,
          budget.startDate,
          budget.endDate,
          budget.alertThreshold,
          budget.createdAt,
          budget.updatedAt,
        ]
      );
    },

    async update(budget: Budget): Promise<void> {
      const db = await getDatabase();
      await db.runAsync(
        `UPDATE budgets SET name = ?, amount = ?, alert_threshold = ?, start_date = ?, end_date = ?, updated_at = ? WHERE id = ?`,
        [budget.name, budget.amount, budget.alertThreshold, budget.startDate, budget.endDate, budget.updatedAt, budget.id]
      );
    },

    async delete(id: string): Promise<void> {
      const db = await getDatabase();
      await db.runAsync('DELETE FROM budgets WHERE id = ?', [id]);
    },

    async findById(id: string): Promise<Budget | null> {
      const db = await getDatabase();
      const row = await db.getFirstAsync<BudgetRow>('SELECT * FROM budgets WHERE id = ?', [id]);
      if (!row) return null;
      return mapRowToBudget(row);
    },

    async findAll(): Promise<Budget[]> {
      const db = await getDatabase();
      const rows = await db.getAllAsync<BudgetRow>('SELECT * FROM budgets ORDER BY created_at DESC');
      return rows.map(mapRowToBudget);
    },

    async findByType(type: BudgetType): Promise<Budget[]> {
      const db = await getDatabase();
      const rows = await db.getAllAsync<BudgetRow>(
        'SELECT * FROM budgets WHERE type = ? ORDER BY created_at DESC',
        [type]
      );
      return rows.map(mapRowToBudget);
    },

    async findByCategory(categoryId: string): Promise<Budget | null> {
      const db = await getDatabase();
      const row = await db.getFirstAsync<BudgetRow>(
        'SELECT * FROM budgets WHERE category_id = ? ORDER BY created_at DESC LIMIT 1',
        [categoryId]
      );
      if (!row) return null;
      return mapRowToBudget(row);
    },

    async findActive(date: string): Promise<Budget[]> {
      const db = await getDatabase();
      const rows = await db.getAllAsync<BudgetRow>(
        'SELECT * FROM budgets WHERE start_date <= ? AND end_date >= ? ORDER BY type, name',
        [date, date]
      );
      return rows.map(mapRowToBudget);
    },

    async findMonthlyBudget(startDate: string, endDate: string): Promise<Budget | null> {
      const db = await getDatabase();
      const row = await db.getFirstAsync<BudgetRow>(
        `SELECT * FROM budgets WHERE type = 'monthly' AND start_date = ? AND end_date = ? LIMIT 1`,
        [startDate, endDate]
      );
      if (!row) return null;
      return mapRowToBudget(row);
    },
  };
}

export type BudgetRepository = ReturnType<typeof createBudgetRepository>;

