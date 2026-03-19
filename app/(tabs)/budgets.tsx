import { View, Text, ScrollView, RefreshControl, Modal, TextInput, Pressable } from 'react-native';
import { useState, useCallback, useEffect, useMemo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

import {
  BudgetCard,
  AddBudgetCard,
  BudgetOverviewHeader,
  EmptyBudgets,
} from '@/components/budgets';
import { useBudgetStore } from '@/state/budget.store';
import { useCategoryStore } from '@/state/category.store';
import { useBudgets } from '@/hooks/use-budgets';
import type { BudgetAlertLevel, BudgetType } from '@/modules/budget';

// Mock data for demonstration
const MOCK_BUDGETS: Array<{
  id: string;
  name: string;
  type: BudgetType;
  spent: number;
  total: number;
  percentage: number;
  alertLevel: BudgetAlertLevel;
  categoryName?: string;
  categoryColor?: string;
}> = [
  { id: '1', name: 'Monthly Budget', type: 'monthly', spent: 2340, total: 4000, percentage: 58, alertLevel: 'safe' },
  { id: '2', name: 'Food & Dining', type: 'category', spent: 420, total: 500, percentage: 84, alertLevel: 'warning', categoryName: 'Food', categoryColor: '#FF6B6B' },
  { id: '3', name: 'Transportation', type: 'category', spent: 180, total: 300, percentage: 60, alertLevel: 'safe', categoryName: 'Transport', categoryColor: '#45B7D1' },
  { id: '4', name: 'Entertainment', type: 'category', spent: 250, total: 200, percentage: 125, alertLevel: 'exceeded', categoryName: 'Entertainment', categoryColor: '#DDA0DD' },
];

export default function BudgetsScreen() {
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newBudgetName, setNewBudgetName] = useState('');
  const [newBudgetAmount, setNewBudgetAmount] = useState('');
  const [newBudgetType, setNewBudgetType] = useState<BudgetType>('monthly');

  // Stores
  const budgetStatuses = useBudgetStore((state) => state.statuses);
  const categories = useCategoryStore((state) => state.categories);

  // Calculate totals
  const { totalBudget, totalSpent } = useMemo(() => {
    const data = budgetStatuses.length > 0 ? budgetStatuses : MOCK_BUDGETS;
    return data.reduce(
      (acc, status) => {
        const total = 'total' in status ? status.total : status.budget?.amount || 0;
        acc.totalBudget += total;
        acc.totalSpent += status.spent;
        return acc;
      },
      { totalBudget: 0, totalSpent: 0 }
    );
  }, [budgetStatuses]);

  // Transform budget statuses to display format
  const displayBudgets = useMemo(() => {
    if (budgetStatuses.length === 0) return MOCK_BUDGETS;

    return budgetStatuses.map((status) => {
      const category = status.budget.categoryId
        ? categories.find((c) => c.id === status.budget.categoryId)
        : null;

      return {
        id: status.budget.id,
        name: status.budget.name,
        type: status.budget.type,
        spent: status.spent,
        total: status.budget.amount,
        percentage: status.percentage,
        alertLevel: status.alertLevel,
        categoryName: category?.name,
        categoryColor: category?.color,
      };
    });
  }, [budgetStatuses, categories]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // TODO: Implement data refresh from services
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const handleAddBudget = () => {
    setShowAddModal(true);
  };

  const handleSaveBudget = () => {
    // TODO: Implement budget creation via service
    setShowAddModal(false);
    setNewBudgetName('');
    setNewBudgetAmount('');
    setNewBudgetType('monthly');
  };

  const handleBudgetPress = (budgetId: string) => {
    // TODO: Navigate to budget details or edit modal
    console.log('Budget pressed:', budgetId);
  };

  const hasData = budgetStatuses.length > 0;

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: insets.top, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View className="flex-row items-center justify-between mt-4 mb-6">
          <View>
            <Text className="text-text-muted dark:text-text-muted-dark text-sm">
              Track your limits
            </Text>
            <Text className="text-text-primary dark:text-text-primary-dark text-2xl font-bold tracking-tight">
              Budgets
            </Text>
          </View>
          <Pressable
            onPress={handleAddBudget}
            className="w-10 h-10 rounded-full bg-primary items-center justify-center"
          >
            <Ionicons name="add" size={24} color="#FFFFFF" />
          </Pressable>
        </View>

        {/* Overview Header */}
        {(hasData || MOCK_BUDGETS.length > 0) && (
          <BudgetOverviewHeader
            totalBudget={totalBudget || 5000}
            totalSpent={totalSpent || 3190}
            budgetCount={displayBudgets.length}
          />
        )}

        {/* Budget List */}
        {displayBudgets.length > 0 ? (
          <View>
            <Text className="text-text-primary dark:text-text-primary-dark text-lg font-bold tracking-tight mb-3">
              Active Budgets
            </Text>
            {displayBudgets.map((budget) => (
              <BudgetCard
                key={budget.id}
                id={budget.id}
                name={budget.name}
                type={budget.type}
                spent={budget.spent}
                total={budget.total}
                percentage={budget.percentage}
                alertLevel={budget.alertLevel}
                categoryName={budget.categoryName}
                categoryColor={budget.categoryColor}
                onPress={() => handleBudgetPress(budget.id)}
              />
            ))}
          </View>
        ) : (
          <EmptyBudgets />
        )}

        {/* Add Budget Card */}
        <View className="mt-4">
          <AddBudgetCard onPress={handleAddBudget} />
        </View>
      </ScrollView>

      {/* Add Budget Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowAddModal(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-surface dark:bg-surface-dark rounded-t-3xl p-6">
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-text-primary dark:text-text-primary-dark text-xl font-bold tracking-tight">
                Create Budget
              </Text>
              <Pressable
                onPress={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full bg-surface-hover dark:bg-surface-hover-dark items-center justify-center"
              >
                <Ionicons name="close" size={20} color="#71717A" />
              </Pressable>
            </View>

            {/* Budget Type Selector */}
            <Text className="text-text-muted dark:text-text-muted-dark text-sm mb-2">
              Budget Type
            </Text>
            <View className="flex-row mb-4">
              <Pressable
                onPress={() => setNewBudgetType('monthly')}
                className={`flex-1 py-3 rounded-2xl mr-2 items-center ${
                  newBudgetType === 'monthly'
                    ? 'bg-primary'
                    : 'bg-surface-hover dark:bg-surface-hover-dark'
                }`}
              >
                <Text className={newBudgetType === 'monthly' ? 'text-white font-semibold' : 'text-text-primary dark:text-text-primary-dark'}>
                  Monthly
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setNewBudgetType('category')}
                className={`flex-1 py-3 rounded-2xl ml-2 items-center ${
                  newBudgetType === 'category'
                    ? 'bg-primary'
                    : 'bg-surface-hover dark:bg-surface-hover-dark'
                }`}
              >
                <Text className={newBudgetType === 'category' ? 'text-white font-semibold' : 'text-text-primary dark:text-text-primary-dark'}>
                  Category
                </Text>
              </Pressable>
            </View>

            {/* Budget Name */}
            <Text className="text-text-muted dark:text-text-muted-dark text-sm mb-2">
              Name
            </Text>
            <TextInput
              value={newBudgetName}
              onChangeText={setNewBudgetName}
              placeholder="e.g., Monthly Groceries"
              placeholderTextColor="#71717A"
              className="bg-surface-hover dark:bg-surface-hover-dark text-text-primary dark:text-text-primary-dark rounded-2xl px-4 py-3 mb-4"
            />

            {/* Budget Amount */}
            <Text className="text-text-muted dark:text-text-muted-dark text-sm mb-2">
              Amount
            </Text>
            <TextInput
              value={newBudgetAmount}
              onChangeText={setNewBudgetAmount}
              placeholder="$0.00"
              placeholderTextColor="#71717A"
              keyboardType="numeric"
              className="bg-surface-hover dark:bg-surface-hover-dark text-text-primary dark:text-text-primary-dark rounded-2xl px-4 py-3 mb-6"
            />

            {/* Save Button */}
            <Pressable
              onPress={handleSaveBudget}
              className="bg-primary py-4 rounded-2xl items-center active:opacity-80"
            >
              <Text className="text-white text-base font-semibold">
                Create Budget
              </Text>
            </Pressable>

            {/* Safe Area Padding */}
            <View className="h-6" />
          </View>
        </View>
      </Modal>
    </View>
  );
}

