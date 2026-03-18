import { useCallback } from 'react';
import { useAccountStore } from '@/state/account.store';
import { createAccountService } from '@/modules/account/account.service';
import type { CreateAccountInput, UpdateAccountInput } from '@/modules/account/account.types';

export function useAccounts() {
  const fetch = useCallback(async () => {
    const { setLoading, setError, setAccounts } = useAccountStore.getState();
    setLoading(true);
    setError(null);

    try {
      const service = createAccountService();
      const accounts = await service.getAll();
      setAccounts(accounts);
      return accounts;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch accounts';
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const add = useCallback(async (input: CreateAccountInput) => {
    const { setLoading, setError, addAccount } = useAccountStore.getState();
    setLoading(true);
    setError(null);

    try {
      const service = createAccountService();
      const account = await service.add(input);
      addAccount(account);
      return account;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add account';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const edit = useCallback(async (id: string, input: UpdateAccountInput) => {
    const { setLoading, setError, updateAccount } = useAccountStore.getState();
    setLoading(true);
    setError(null);

    try {
      const service = createAccountService();
      const account = await service.edit(id, input);

      if (!account) {
        setError('Account not found');
        return null;
      }

      updateAccount(account);
      return account;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update account';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const remove = useCallback(async (id: string) => {
    const { setLoading, setError, removeAccount } = useAccountStore.getState();
    setLoading(true);
    setError(null);

    try {
      const service = createAccountService();
      const success = await service.remove(id);

      if (!success) {
        setError('Cannot delete default account');
        return false;
      }

      removeAccount(id);
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete account';
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { fetch, add, edit, remove };
}

