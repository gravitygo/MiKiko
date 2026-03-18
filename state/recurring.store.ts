import { create } from 'zustand';
import type { RecurringRule } from '@/modules/recurring';

interface RecurringState {
  rules: RecurringRule[];
  selectedRule: RecurringRule | null;
  isLoading: boolean;
  error: string | null;
}

interface RecurringActions {
  setRules: (rules: RecurringRule[]) => void;
  addRule: (rule: RecurringRule) => void;
  updateRule: (rule: RecurringRule) => void;
  removeRule: (id: string) => void;
  setSelectedRule: (rule: RecurringRule | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState: RecurringState = {
  rules: [],
  selectedRule: null,
  isLoading: false,
  error: null,
};

export const useRecurringStore = create<RecurringState & RecurringActions>((set) => ({
  ...initialState,

  setRules: (rules) => set({ rules }),

  addRule: (rule) =>
    set((state) => ({ rules: [...state.rules, rule] })),

  updateRule: (rule) =>
    set((state) => ({
      rules: state.rules.map((r) => (r.id === rule.id ? rule : r)),
    })),

  removeRule: (id) =>
    set((state) => ({
      rules: state.rules.filter((r) => r.id !== id),
    })),

  setSelectedRule: (selectedRule) => set({ selectedRule }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  reset: () => set(initialState),
}));

