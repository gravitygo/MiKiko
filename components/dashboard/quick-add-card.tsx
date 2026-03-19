import { View, Text } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';

import { BentoCard } from './bento-card';

export function QuickAddCard() {
  const router = useRouter();

  const handlePress = () => {
    router.push('/add');
  };

  return (
    <BentoCard size="2x1" onPress={handlePress} className="flex-row items-center justify-between">
      <View className="flex-1">
        <Text className="text-text-primary dark:text-text-primary-dark text-lg font-bold tracking-tight">
          Add Transaction
        </Text>
        <Text className="text-text-muted dark:text-text-muted-dark text-sm mt-1">
          Tap to record expense or income
        </Text>
      </View>

      <View className="w-14 h-14 rounded-2xl bg-primary items-center justify-center shadow-lg shadow-primary/30">
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </View>
    </BentoCard>
  );
}

