import { create } from 'zustand';
import type { Account } from '@/modules/account';

interface AccountState {
  accounts: Account[];
  selectedAccount: Account | null;
  isLoading: boolean;
  error: string | null;
}

interface AccountActions {
  setAccounts: (accounts: Account[]) => void;
  addAccount: (account: Account) => void;
  updateAccount: (account: Account) => void;
  removeAccount: (id: string) => void;
  setSelectedAccount: (account: Account | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState: AccountState = {
  accounts: [],
  selectedAccount: null,
  isLoading: false,
  error: null,
};

export const useAccountStore = create<AccountState & AccountActions>((set) => ({
  ...initialState,

  setAccounts: (accounts) => set({ accounts }),

  addAccount: (account) =>
    set((state) => ({ accounts: [...state.accounts, account] })),

  updateAccount: (account) =>
    set((state) => ({
      accounts: state.accounts.map((a) => (a.id === account.id ? account : a)),
    })),

  removeAccount: (id) =>
    set((state) => ({
      accounts: state.accounts.filter((a) => a.id !== id),
    })),

  setSelectedAccount: (selectedAccount) => set({ selectedAccount }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  reset: () => set(initialState),
}));

