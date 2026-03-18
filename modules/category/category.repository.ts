import { getDatabase } from '@/database';
import { mapRowToCategory } from './category.mapper';
import type { Category, CategoryRow, CategoryType } from './category.types';

export function createCategoryRepository() {
  return {
    async insert(category: Category): Promise<void> {
      const db = await getDatabase();
      await db.runAsync(
        `INSERT INTO categories (id, name, icon, color, type, budget_amount, is_default, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          category.id,
          category.name,
          category.icon,
          category.color,
          category.type,
          category.budgetAmount,
          category.isDefault ? 1 : 0,
          category.createdAt,
          category.updatedAt,
        ]
      );
    },

    async update(category: Category): Promise<void> {
      const db = await getDatabase();
      await db.runAsync(
        `UPDATE categories
         SET name = ?, icon = ?, color = ?, type = ?, budget_amount = ?, updated_at = ?
         WHERE id = ?`,
        [
          category.name,
          category.icon,
          category.color,
          category.type,
          category.budgetAmount,
          category.updatedAt,
          category.id,
        ]
      );
    },

    async delete(id: string): Promise<void> {
      const db = await getDatabase();
      await db.runAsync('DELETE FROM categories WHERE id = ? AND is_default = 0', [id]);
    },

    async findById(id: string): Promise<Category | null> {
      const db = await getDatabase();
      const row = await db.getFirstAsync<CategoryRow>(
        'SELECT * FROM categories WHERE id = ?',
        [id]
      );
      if (!row) return null;
      return mapRowToCategory(row);
    },

    async findAll(): Promise<Category[]> {
      const db = await getDatabase();
      const rows = await db.getAllAsync<CategoryRow>(
        'SELECT * FROM categories ORDER BY is_default DESC, name ASC'
      );
      return rows.map(mapRowToCategory);
    },

    async findByType(type: CategoryType): Promise<Category[]> {
      const db = await getDatabase();
      const rows = await db.getAllAsync<CategoryRow>(
        'SELECT * FROM categories WHERE type = ? ORDER BY is_default DESC, name ASC',
        [type]
      );
      return rows.map(mapRowToCategory);
    },

    async findDefaults(): Promise<Category[]> {
      const db = await getDatabase();
      const rows = await db.getAllAsync<CategoryRow>(
        'SELECT * FROM categories WHERE is_default = 1 ORDER BY name ASC'
      );
      return rows.map(mapRowToCategory);
    },

    async findUserCreated(): Promise<Category[]> {
      const db = await getDatabase();
      const rows = await db.getAllAsync<CategoryRow>(
        'SELECT * FROM categories WHERE is_default = 0 ORDER BY name ASC'
      );
      return rows.map(mapRowToCategory);
    },
  };
}

export type CategoryRepository = ReturnType<typeof createCategoryRepository>;

