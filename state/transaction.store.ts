import { create } from 'zustand';
import type { Transaction, TransactionFilter } from '@/modules/transaction';

interface TransactionState {
  transactions: Transaction[];
  selectedTransaction: Transaction | null;
  filter: TransactionFilter;
  totalCount: number;
  isLoading: boolean;
  error: string | null;
}

interface TransactionActions {
  setTransactions: (transactions: Transaction[]) => void;
  appendTransactions: (transactions: Transaction[]) => void;
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (transaction: Transaction) => void;
  removeTransaction: (id: string) => void;
  setSelectedTransaction: (transaction: Transaction | null) => void;
  setFilter: (filter: TransactionFilter) => void;
  setTotalCount: (count: number) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState: TransactionState = {
  transactions: [],
  selectedTransaction: null,
  filter: {},
  totalCount: 0,
  isLoading: false,
  error: null,
};

export const useTransactionStore = create<TransactionState & TransactionActions>((set) => ({
  ...initialState,

  setTransactions: (transactions) => set({ transactions }),

  appendTransactions: (transactions) =>
    set((state) => ({ transactions: [...state.transactions, ...transactions] })),

  addTransaction: (transaction) =>
    set((state) => ({ transactions: [transaction, ...state.transactions] })),

  updateTransaction: (transaction) =>
    set((state) => ({
      transactions: state.transactions.map((t) => (t.id === transaction.id ? transaction : t)),
    })),

  removeTransaction: (id) =>
    set((state) => ({
      transactions: state.transactions.filter((t) => t.id !== id),
    })),

  setSelectedTransaction: (selectedTransaction) => set({ selectedTransaction }),

  setFilter: (filter) => set({ filter }),

  setTotalCount: (totalCount) => set({ totalCount }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  reset: () => set(initialState),
}));

