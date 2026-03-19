import { useCallback } from 'react';
import { useRecurringStore } from '@/state/recurring.store';
import { createRecurringService } from '@/modules/recurring/recurring.service';
import type { CreateRecurringRuleInput, UpdateRecurringRuleInput } from '@/modules/recurring/recurring.types';

export function useRecurring() {
  const fetch = useCallback(async () => {
    const { setLoading, setError, setRules } = useRecurringStore.getState();
    setLoading(true);
    setError(null);

    try {
      const service = createRecurringService();
      const rules = await service.getAll();
      setRules(rules);
      return rules;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch recurring rules';
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const add = useCallback(async (input: CreateRecurringRuleInput) => {
    const { setLoading, setError, addRule } = useRecurringStore.getState();
    setLoading(true);
    setError(null);

    try {
      const service = createRecurringService();
      const rule = await service.add(input);
      addRule(rule);
      return rule;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add recurring rule';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const edit = useCallback(async (id: string, input: UpdateRecurringRuleInput) => {
    const { setLoading, setError, updateRule } = useRecurringStore.getState();
    setLoading(true);
    setError(null);

    try {
      const service = createRecurringService();
      const rule = await service.edit(id, input);

      if (!rule) {
        setError('Recurring rule not found');
        return null;
      }

      updateRule(rule);
      return rule;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update recurring rule';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const remove = useCallback(async (id: string) => {
    const { setLoading, setError, removeRule } = useRecurringStore.getState();
    setLoading(true);
    setError(null);

    try {
      const service = createRecurringService();
      const success = await service.remove(id);

      if (!success) {
        setError('Cannot delete this recurring rule');
        return false;
      }

      removeRule(id);
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete recurring rule';
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { fetch, add, edit, remove };
}

