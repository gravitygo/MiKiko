import { useCallback } from 'react';
import { useTransactionStore } from '@/state/transaction.store';
import { createTransactionService } from '@/modules/transaction/transaction.service';
import type {
  CreateTransactionInput,
  UpdateTransactionInput,
  TransactionFilter,
} from '@/modules/transaction/transaction.types';

export function useTransactions() {
  const fetch = useCallback(async (filter: TransactionFilter = { limit: 50 }) => {
    const { setLoading, setError, setTransactions, setTotalCount } = useTransactionStore.getState();
    setLoading(true);
    setError(null);

    try {
      const service = createTransactionService();
      const [transactions, count] = await Promise.all([
        service.getAll(filter),
        service.count(filter),
      ]);

      setTransactions(transactions);
      setTotalCount(count);
      return transactions;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch transactions';
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const add = useCallback(async (input: CreateTransactionInput) => {
    const { setLoading, setError, addTransaction } = useTransactionStore.getState();
    setLoading(true);
    setError(null);

    try {
      const service = createTransactionService();
      const transaction = await service.add(input);
      addTransaction(transaction);
      return transaction;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add transaction';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const edit = useCallback(async (id: string, input: UpdateTransactionInput) => {
    const { setLoading, setError, updateTransaction } = useTransactionStore.getState();
    setLoading(true);
    setError(null);

    try {
      const service = createTransactionService();
      const transaction = await service.edit(id, input);

      if (!transaction) {
        setError('Transaction not found');
        return null;
      }

      updateTransaction(transaction);
      return transaction;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update transaction';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const remove = useCallback(async (id: string) => {
    const { setLoading, setError, removeTransaction } = useTransactionStore.getState();
    setLoading(true);
    setError(null);

    try {
      const service = createTransactionService();
      const success = await service.remove(id);

      if (!success) {
        setError('Transaction not found');
        return false;
      }

      removeTransaction(id);
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete transaction';
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const duplicate = useCallback(async (id: string) => {
    const { setLoading, setError, addTransaction } = useTransactionStore.getState();
    setLoading(true);
    setError(null);

    try {
      const service = createTransactionService();
      const transaction = await service.duplicate(id);

      if (!transaction) {
        setError('Transaction not found');
        return null;
      }

      addTransaction(transaction);
      return transaction;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to duplicate transaction';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { fetch, add, edit, remove, duplicate };
}

