import { View, Text } from 'react-native';

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-background dark:bg-background-dark items-center justify-center">
      <Text className="text-text-primary dark:text-text-primary-dark text-xl font-semibold">
        Dashboard
      </Text>
    </View>
  );
}

