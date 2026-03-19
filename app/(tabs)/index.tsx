import { View, Text, ScrollView, RefreshControl, Pressable } from 'react-native';
import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

import {
  BalanceCard,
  QuickAddCard,
  CategoryCard,
  RecentTransactionItem,
  BudgetSummaryCard,
} from '@/components/dashboard';
import { useAccountStore } from '@/state/account.store';
import { useTransactionStore } from '@/state/transaction.store';
import { useCategoryStore } from '@/state/category.store';
import { useBudgetStore } from '@/state/budget.store';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

// Mock sparkline data for demonstration
const MOCK_SPARKLINE = [2400, 1800, 3200, 2800, 3600, 3100, 4200];

// Bottom nav bar height + padding
const BOTTOM_NAV_HEIGHT = 100;

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Stores
  const accounts = useAccountStore((state) => state.accounts);
  const transactions = useTransactionStore((state) => state.transactions);
  const categories = useCategoryStore((state) => state.categories);
  const budgetStatuses = useBudgetStore((state) => state.statuses);

  // Calculate total balance from all accounts
  const totalBalance = useMemo(() => {
    return accounts.reduce((sum, account) => sum + account.balance, 0);
  }, [accounts]);

  // Calculate income and expense for current month
  const { monthlyIncome, monthlyExpense } = useMemo(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];

    return transactions.reduce(
      (acc, t) => {
        if (t.date >= startOfMonth) {
          if (t.type === 'income') {
            acc.monthlyIncome += t.amount;
          } else {
            acc.monthlyExpense += t.amount;
          }
        }
        return acc;
      },
      { monthlyIncome: 0, monthlyExpense: 0 }
    );
  }, [transactions]);

  // Get top spending categories
  const topCategories = useMemo(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];

    const categorySpending: Record<string, number> = {};

    transactions.forEach((t) => {
      if (t.type === 'expense' && t.date >= startOfMonth) {
        categorySpending[t.categoryId] = (categorySpending[t.categoryId] || 0) + t.amount;
      }
    });

    const totalSpending = Object.values(categorySpending).reduce((sum, v) => sum + v, 0);

    return Object.entries(categorySpending)
      .map(([categoryId, amount]) => {
        const category = categories.find((c) => c.id === categoryId);
        if (!category) return null;

        return {
          id: categoryId,
          name: category.name,
          icon: category.icon as IconName,
          color: category.color,
          amount,
          percentage: totalSpending > 0 ? (amount / totalSpending) * 100 : 0,
        };
      })
      .filter(Boolean)
      .sort((a, b) => (b?.amount || 0) - (a?.amount || 0))
      .slice(0, 4);
  }, [transactions, categories]);

  // Get recent transactions
  const recentTransactions = useMemo(() => {
    return transactions
      .slice()
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5)
      .map((t) => {
        const category = categories.find((c) => c.id === t.categoryId);
        return {
          ...t,
          categoryName: category?.name || 'Unknown',
          categoryIcon: (category?.icon || 'help-circle') as IconName,
          categoryColor: category?.color || '#888888',
        };
      });
  }, [transactions, categories]);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // TODO: Implement data refresh from services
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const handleSeeAllTransactions = () => {
    router.push('/transactions');
  };

  const handleTransactionPress = (transactionId: string) => {
    // TODO: Navigate to transaction detail or show modal
    router.push(`/transactions?highlight=${transactionId}`);
  };

  // Show placeholder data when stores are empty
  const hasData = accounts.length > 0 || transactions.length > 0;

  // Placeholder data
  const placeholderCategories = [
    { id: '1', name: 'Food', icon: 'restaurant' as IconName, color: '#FF6B6B', percentage: 35, amount: 820 },
    { id: '2', name: 'Transport', icon: 'car' as IconName, color: '#45B7D1', percentage: 25, amount: 585 },
    { id: '3', name: 'Shopping', icon: 'bag' as IconName, color: '#96CEB4', percentage: 22, amount: 515 },
    { id: '4', name: 'Entertainment', icon: 'game-controller' as IconName, color: '#DDA0DD', percentage: 18, amount: 420 },
  ];

  const placeholderBudgets = [
    { budget: { id: '1', name: 'Monthly' }, spent: 2340, percentage: 58, alertLevel: 'safe' as const },
    { budget: { id: '2', name: 'Food' }, spent: 420, percentage: 84, alertLevel: 'warning' as const },
  ];

  const placeholderTransactions = [
    { id: '1', description: 'Grocery Store', amount: 85.50, type: 'expense' as const, categoryName: 'Groceries', categoryIcon: 'cart' as IconName, categoryColor: '#4ECDC4', date: new Date().toISOString() },
    { id: '2', description: 'Salary', amount: 4200, type: 'income' as const, categoryName: 'Salary', categoryIcon: 'wallet' as IconName, categoryColor: '#05DF72', date: new Date().toISOString() },
    { id: '3', description: 'Coffee Shop', amount: 12.00, type: 'expense' as const, categoryName: 'Food', categoryIcon: 'restaurant' as IconName, categoryColor: '#FF6B6B', date: new Date(Date.now() - 86400000).toISOString() },
  ];

  const displayCategories = topCategories.length > 0 ? topCategories : placeholderCategories;
  const displayBudgets = budgetStatuses.length > 0 ? budgetStatuses.slice(0, 2) : placeholderBudgets;
  const displayTransactions = recentTransactions.length > 0 ? recentTransactions : placeholderTransactions;

  return (
    <ScrollView
      className="flex-1 bg-background dark:bg-background-dark"
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingTop: insets.top + 8,
        paddingBottom: BOTTOM_NAV_HEIGHT + 16,
      }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View className="flex-row items-center justify-between mb-6">
        <View>
          <Text className="text-text-muted dark:text-text-muted-dark text-sm">
            Welcome back
          </Text>
          <Text className="text-text-primary dark:text-text-primary-dark text-2xl font-bold tracking-tight">
            Dashboard
          </Text>
        </View>
        <Pressable
          className="w-10 h-10 rounded-full bg-surface dark:bg-surface-dark border border-border/50 dark:border-white/5 items-center justify-center active:opacity-70"
          onPress={() => router.push('/settings')}
        >
          <Ionicons name="notifications-outline" size={20} color="#71717A" />
        </Pressable>
      </View>

      {/* Balance Card - Large 2x2 */}
      <BalanceCard
        totalBalance={hasData ? totalBalance : 12580}
        income={hasData ? monthlyIncome : 4200}
        expense={hasData ? monthlyExpense : 2340}
        sparklineData={MOCK_SPARKLINE}
      />

      {/* Quick Add Card - Medium 2x1 */}
      <View className="mt-4">
        <QuickAddCard />
      </View>

      {/* Category Spending - 2 Column Grid */}
      <View className="mt-6">
        <Text className="text-text-primary dark:text-text-primary-dark text-lg font-bold tracking-tight mb-3">
          Top Categories
        </Text>
        <View className="flex-row flex-wrap" style={{ marginHorizontal: -6 }}>
          {displayCategories.map((cat) => (
            <View key={cat?.id} style={{ width: '50%', paddingHorizontal: 6, marginBottom: 12 }}>
              <CategoryCard
                name={cat?.name || ''}
                icon={cat?.icon || 'help-circle'}
                color={cat?.color || '#888'}
                percentage={cat?.percentage || 0}
                amount={cat?.amount || 0}
              />
            </View>
          ))}
        </View>
      </View>

      {/* Budget Summary - 2 Column Grid */}
      {(budgetStatuses.length > 0 || !hasData) && (
        <View className="mt-6">
          <Text className="text-text-primary dark:text-text-primary-dark text-lg font-bold tracking-tight mb-3">
            Budget Overview
          </Text>
          <View className="flex-row flex-wrap" style={{ marginHorizontal: -6 }}>
            {displayBudgets.map((status) => (
              <View key={status.budget.id} style={{ width: '50%', paddingHorizontal: 6, marginBottom: 12 }}>
                <BudgetSummaryCard
                  name={status.budget.name}
                  spent={status.spent}
                  total={Math.round(status.spent / (status.percentage / 100))}
                  percentage={status.percentage}
                  alertLevel={status.alertLevel}
                />
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Recent Transactions */}
      <View className="mt-6">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-text-primary dark:text-text-primary-dark text-lg font-bold tracking-tight">
            Recent Transactions
          </Text>
          <Pressable onPress={handleSeeAllTransactions} className="active:opacity-70">
            <Text className="text-primary text-sm font-medium">See All</Text>
          </Pressable>
        </View>

        <View className="bg-surface dark:bg-surface-dark border border-border/50 dark:border-white/5 rounded-3xl px-4">
          {displayTransactions.map((transaction, index, arr) => (
            <View key={transaction.id}>
              <RecentTransactionItem
                description={transaction.description || ''}
                amount={transaction.amount}
                type={transaction.type}
                categoryName={transaction.categoryName}
                categoryIcon={transaction.categoryIcon}
                categoryColor={transaction.categoryColor}
                date={formatDate(transaction.date)}
                onPress={() => handleTransactionPress(transaction.id)}
              />
              {index < arr.length - 1 && (
                <View className="h-px bg-border/50 dark:bg-white/5" />
              )}
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

