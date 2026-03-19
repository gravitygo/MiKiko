import { useCallback } from 'react';
import { useBudgetStore } from '@/state/budget.store';
import { createBudgetService } from '@/modules/budget/budget.service';
import type { CreateBudgetInput, UpdateBudgetInput } from '@/modules/budget/budget.types';

export function useBudgets() {
  const fetch = useCallback(async () => {
    const { setLoading, setError, setBudgets } = useBudgetStore.getState();
    setLoading(true);
    setError(null);

    try {
      const service = createBudgetService();
      const budgets = await service.getAll();
      setBudgets(budgets);
      return budgets;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch budgets';
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStatuses = useCallback(async () => {
    const { setLoading, setError, setStatuses } = useBudgetStore.getState();
    setLoading(true);
    setError(null);

    try {
      const service = createBudgetService();
      const statuses = await service.getAllStatuses();
      setStatuses(statuses);
      return statuses;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch budget statuses';
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const add = useCallback(async (input: CreateBudgetInput) => {
    const { setLoading, setError, addBudget } = useBudgetStore.getState();
    setLoading(true);
    setError(null);

    try {
      const service = createBudgetService();
      const budget = await service.add(input);
      addBudget(budget);
      return budget;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add budget';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const edit = useCallback(async (id: string, input: UpdateBudgetInput) => {
    const { setLoading, setError, updateBudget } = useBudgetStore.getState();
    setLoading(true);
    setError(null);

    try {
      const service = createBudgetService();
      const budget = await service.edit(id, input);

      if (!budget) {
        setError('Budget not found');
        return null;
      }

      updateBudget(budget);
      return budget;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update budget';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const remove = useCallback(async (id: string) => {
    const { setLoading, setError, removeBudget } = useBudgetStore.getState();
    setLoading(true);
    setError(null);

    try {
      const service = createBudgetService();
      const success = await service.remove(id);

      if (!success) {
        setError('Cannot delete this budget');
        return false;
      }

      removeBudget(id);
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete budget';
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { fetch, fetchStatuses, add, edit, remove };
}

