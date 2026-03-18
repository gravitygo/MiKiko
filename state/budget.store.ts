import { create } from 'zustand';
import type { Budget, BudgetStatus } from '@/modules/budget';

interface BudgetState {
  budgets: Budget[];
  statuses: BudgetStatus[];
  selectedBudget: Budget | null;
  isLoading: boolean;
  error: string | null;
}

interface BudgetActions {
  setBudgets: (budgets: Budget[]) => void;
  addBudget: (budget: Budget) => void;
  updateBudget: (budget: Budget) => void;
  removeBudget: (id: string) => void;
  setStatuses: (statuses: BudgetStatus[]) => void;
  setSelectedBudget: (budget: Budget | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState: BudgetState = {
  budgets: [],
  statuses: [],
  selectedBudget: null,
  isLoading: false,
  error: null,
};

export const useBudgetStore = create<BudgetState & BudgetActions>((set) => ({
  ...initialState,

  setBudgets: (budgets) => set({ budgets }),

  addBudget: (budget) =>
    set((state) => ({ budgets: [...state.budgets, budget] })),

  updateBudget: (budget) =>
    set((state) => ({
      budgets: state.budgets.map((b) => (b.id === budget.id ? budget : b)),
    })),

  removeBudget: (id) =>
    set((state) => ({
      budgets: state.budgets.filter((b) => b.id !== id),
    })),

  setStatuses: (statuses) => set({ statuses }),

  setSelectedBudget: (selectedBudget) => set({ selectedBudget }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  reset: () => set(initialState),
}));

