import { createCategory } from './category.model';
import { createCategoryRepository } from './category.repository';
import type { Category, CategoryType, CreateCategoryInput, UpdateCategoryInput } from './category.types';

export function createCategoryService() {
  const repository = createCategoryRepository();

  return {
    async add(input: CreateCategoryInput): Promise<Category> {
      const category = createCategory(input);
      await repository.insert(category);
      return category;
    },

    async edit(id: string, input: UpdateCategoryInput): Promise<Category | null> {
      const existing = await repository.findById(id);
      if (!existing) return null;

      const updated: Category = {
        ...existing,
        name: input.name ?? existing.name,
        icon: input.icon ?? existing.icon,
        color: input.color ?? existing.color,
        type: input.type ?? existing.type,
        budgetAmount: input.budgetAmount ?? existing.budgetAmount,
        updatedAt: new Date().toISOString(),
      };

      await repository.update(updated);
      return updated;
    },

    async remove(id: string): Promise<boolean> {
      const existing = await repository.findById(id);
      if (!existing) return false;
      if (existing.isDefault) return false;

      await repository.delete(id);
      return true;
    },

    async getById(id: string): Promise<Category | null> {
      return repository.findById(id);
    },

    async getAll(): Promise<Category[]> {
      return repository.findAll();
    },

    async getByType(type: CategoryType): Promise<Category[]> {
      return repository.findByType(type);
    },

    async getExpenseCategories(): Promise<Category[]> {
      return repository.findByType('expense');
    },

    async getIncomeCategories(): Promise<Category[]> {
      return repository.findByType('income');
    },

    async getDefaults(): Promise<Category[]> {
      return repository.findDefaults();
    },

    async getUserCreated(): Promise<Category[]> {
      return repository.findUserCreated();
    },

    async setBudget(id: string, amount: number): Promise<Category | null> {
      const existing = await repository.findById(id);
      if (!existing) return null;

      const updated: Category = {
        ...existing,
        budgetAmount: amount,
        updatedAt: new Date().toISOString(),
      };

      await repository.update(updated);
      return updated;
    },
  };
}

export type CategoryService = ReturnType<typeof createCategoryService>;

