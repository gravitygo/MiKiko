import { View, Text } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

export default function BudgetsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View className="flex-1 bg-background dark:bg-background-dark items-center justify-center px-8">
      <View className="w-20 h-20 rounded-full bg-surface dark:bg-surface-dark items-center justify-center mb-4">
        <Ionicons name="pie-chart-outline" size={40} color={colors.textMuted} />
      </View>
      <Text className="text-text-primary dark:text-text-primary-dark text-xl font-semibold mb-2">
        Budgets
      </Text>
      <Text className="text-text-muted dark:text-text-muted-dark text-center">
        Budget tracking coming soon
      </Text>
    </View>
  );
}

