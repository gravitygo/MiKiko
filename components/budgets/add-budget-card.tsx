import { View, Text, Pressable } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

interface AddBudgetCardProps {
  onPress: () => void;
}

export function AddBudgetCard({ onPress }: AddBudgetCardProps) {
  return (
    <Pressable
      onPress={onPress}
      className="bg-surface dark:bg-surface-dark border border-dashed border-border dark:border-white/10 rounded-3xl p-6 items-center justify-center active:opacity-80"
    >
      <View className="w-12 h-12 rounded-2xl bg-primary/10 items-center justify-center mb-3">
        <Ionicons name="add" size={24} color="#0084D1" />
      </View>
      <Text className="text-text-primary dark:text-text-primary-dark text-base font-semibold tracking-tight">
        Create Budget
      </Text>
      <Text className="text-text-muted dark:text-text-muted-dark text-sm mt-1">
        Set spending limits for categories
      </Text>
    </Pressable>
  );
}

