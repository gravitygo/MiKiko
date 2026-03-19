import { View, Text } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

export function EmptyBudgets() {
  return (
    <View className="items-center justify-center py-12">
      <View className="w-20 h-20 rounded-full bg-surface dark:bg-surface-dark border border-border/50 dark:border-white/5 items-center justify-center mb-4">
        <Ionicons name="pie-chart-outline" size={36} color="#71717A" />
      </View>
      <Text className="text-text-primary dark:text-text-primary-dark text-lg font-semibold tracking-tight mb-1">
        No Budgets Yet
      </Text>
      <Text className="text-text-muted dark:text-text-muted-dark text-sm text-center px-8">
        Create your first budget to start tracking your spending limits
      </Text>
    </View>
  );
}

