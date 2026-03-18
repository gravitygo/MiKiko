import { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, FlatList, Pressable, RefreshControl, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { useTransactionStore } from '@/state/transaction.store';
import { useCategoryStore } from '@/state/category.store';
import { useAccountStore } from '@/state/account.store';
import { useTransactions } from '@/hooks/use-transactions';
import { useCategories } from '@/hooks/use-categories';
import { useAccounts } from '@/hooks/use-accounts';
import type { Transaction } from '@/modules/transaction/transaction.types';

interface TransactionItemProps {
  transaction: Transaction;
  categoryName: string;
  categoryIcon: string;
  accountName: string;
  onPress: (id: string) => void;
}

function TransactionItem({
  transaction,
  categoryName,
  categoryIcon,
  accountName,
  onPress,
}: TransactionItemProps) {
  const isExpense = transaction.type === 'expense';
  const amountColor = isExpense ? '#FF6B6B' : '#05DF72';
  const amountPrefix = isExpense ? '-' : '+';

  const formattedAmount = `${amountPrefix}$${transaction.amount.toFixed(2)}`;
  const formattedDate = new Date(transaction.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <Pressable
      onPress={() => onPress(transaction.id)}
      className="flex-row items-center px-4 py-3 bg-surface dark:bg-surface-dark mx-4 mb-2 rounded-bento"
    >
      <View className="w-10 h-10 rounded-full bg-surface-hover dark:bg-surface-hover-dark items-center justify-center mr-3">
        <Text className="text-lg">{categoryIcon}</Text>
      </View>

      <View className="flex-1">
        <Text className="text-text-primary dark:text-text-primary-dark font-medium text-base">
          {categoryName}
        </Text>
        <Text className="text-text-muted dark:text-text-muted-dark text-sm">
          {transaction.description || accountName}
        </Text>
      </View>

      <View className="items-end">
        <Text style={{ color: amountColor }} className="font-semibold text-base">
          {formattedAmount}
        </Text>
        <Text className="text-text-muted dark:text-text-muted-dark text-xs">
          {formattedDate}
        </Text>
      </View>
    </Pressable>
  );
}

interface DateGroup {
  title: string;
  data: Transaction[];
}

function groupByDate(transactions: Transaction[]): DateGroup[] {
  const groups: Record<string, Transaction[]> = {};
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  for (const t of transactions) {
    const key = t.date.split('T')[0];
    if (!groups[key]) groups[key] = [];
    groups[key].push(t);
  }

  return Object.entries(groups)
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([key, data]) => {
      let title: string;
      if (key === today) {
        title = 'Today';
      } else if (key === yesterday) {
        title = 'Yesterday';
      } else {
        title = new Date(key).toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'short',
          day: 'numeric',
        });
      }
      return { title, data };
    });
}

type ListItem = { type: 'header'; title: string; id: string } | { type: 'item'; data: Transaction };

export default function TransactionsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const [refreshing, setRefreshing] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const transactions = useTransactionStore((s) => s.transactions);
  const categories = useCategoryStore((s) => s.categories);
  const accounts = useAccountStore((s) => s.accounts);

  const { fetch: fetchTransactions } = useTransactions();
  const { fetch: fetchCategories } = useCategories();
  const { fetch: fetchAccounts } = useAccounts();

  const categoryMap = useMemo(() => new Map(categories.map((c) => [c.id, c])), [categories]);
  const accountMap = useMemo(() => new Map(accounts.map((a) => [a.id, a])), [accounts]);

  const listData = useMemo<ListItem[]>(() => {
    const groups = groupByDate(transactions);
    const items: ListItem[] = [];
    for (const group of groups) {
      items.push({ type: 'header', title: group.title, id: `header-${group.title}` });
      for (const t of group.data) {
        items.push({ type: 'item', data: t });
      }
    }
    return items;
  }, [transactions]);

  const loadData = useCallback(async () => {
    await Promise.all([
      fetchTransactions({ limit: 50 }),
      fetchCategories(),
      fetchAccounts(),
    ]);
  }, [fetchTransactions, fetchCategories, fetchAccounts]);

  useEffect(() => {
    loadData().finally(() => setInitialLoading(false));
  }, [loadData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  const handlePress = useCallback((id: string) => {
    useTransactionStore.getState().setSelectedTransaction(
      transactions.find((t) => t.id === id) ?? null
    );
    router.push('/modal');
  }, [transactions]);

  const handleAddPress = useCallback(() => {
    router.push('/(tabs)/add');
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: ListItem }) => {
      if (item.type === 'header') {
        return (
          <Text className="text-text-secondary dark:text-text-secondary-dark text-sm font-medium px-4 py-2 bg-background dark:bg-background-dark">
            {item.title}
          </Text>
        );
      }

      const t = item.data;
      const cat = categoryMap.get(t.categoryId);
      const acc = accountMap.get(t.accountId);

      return (
        <TransactionItem
          transaction={t}
          categoryName={cat?.name ?? 'Unknown'}
          categoryIcon={cat?.icon ?? '💰'}
          accountName={acc?.name ?? 'Unknown'}
          onPress={handlePress}
        />
      );
    },
    [categoryMap, accountMap, handlePress]
  );

  const keyExtractor = useCallback((item: ListItem) => {
    return item.type === 'header' ? item.id : item.data.id;
  }, []);

  if (initialLoading) {
    return (
      <View className="flex-1 bg-background dark:bg-background-dark items-center justify-center">
        <ActivityIndicator size="large" color={colors.tint} />
      </View>
    );
  }

  if (transactions.length === 0) {
    return (
      <View className="flex-1 bg-background dark:bg-background-dark items-center justify-center px-8">
        <View className="w-20 h-20 rounded-full bg-surface dark:bg-surface-dark items-center justify-center mb-4">
          <Ionicons name="receipt-outline" size={40} color={colors.textMuted} />
        </View>
        <Text className="text-text-primary dark:text-text-primary-dark text-xl font-semibold mb-2">
          No transactions yet
        </Text>
        <Text className="text-text-muted dark:text-text-muted-dark text-center mb-6">
          Start tracking your expenses by adding your first transaction
        </Text>
        <Pressable onPress={handleAddPress} className="bg-primary px-6 py-3 rounded-bento">
          <Text className="text-white font-semibold">Add Transaction</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      <FlatList
        data={listData}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.tint} />
        }
        contentContainerStyle={{ paddingTop: 8, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

