import { useCallback } from 'react';
import { useCategoryStore } from '@/state/category.store';
import { createCategoryService } from '@/modules/category/category.service';
import type { CreateCategoryInput, UpdateCategoryInput } from '@/modules/category/category.types';

export function useCategories() {
  const fetch = useCallback(async () => {
    const { setLoading, setError, setCategories } = useCategoryStore.getState();
    setLoading(true);
    setError(null);

    try {
      const service = createCategoryService();
      const categories = await service.getAll();
      setCategories(categories);
      return categories;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch categories';
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const add = useCallback(async (input: CreateCategoryInput) => {
    const { setLoading, setError, addCategory } = useCategoryStore.getState();
    setLoading(true);
    setError(null);

    try {
      const service = createCategoryService();
      const category = await service.add(input);
      addCategory(category);
      return category;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add category';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const edit = useCallback(async (id: string, input: UpdateCategoryInput) => {
    const { setLoading, setError, updateCategory } = useCategoryStore.getState();
    setLoading(true);
    setError(null);

    try {
      const service = createCategoryService();
      const category = await service.edit(id, input);

      if (!category) {
        setError('Category not found');
        return null;
      }

      updateCategory(category);
      return category;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update category';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const remove = useCallback(async (id: string) => {
    const { setLoading, setError, removeCategory } = useCategoryStore.getState();
    setLoading(true);
    setError(null);

    try {
      const service = createCategoryService();
      const success = await service.remove(id);

      if (!success) {
        setError('Cannot delete default category');
        return false;
      }

      removeCategory(id);
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete category';
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { fetch, add, edit, remove };
}

