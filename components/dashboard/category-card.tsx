import { View, Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import { BentoCard } from "./bento-card";

type IconName = React.ComponentProps<typeof Ionicons>["name"];

interface CategoryCardProps {
  name: string;
  icon: IconName;
  color: string;
  percentage: number;
  amount: number;
  onPress?: () => void;
}

export function CategoryCard({
  name,
  icon,
  color,
  percentage,
  amount,
  onPress,
}: CategoryCardProps) {
  const clampedPercentage = Math.min(percentage, 100);

  return (
    <BentoCard
      size="2x1"
      onPress={onPress}
      className="justify-between items-center flex-row gap-3"
    >
      <View
        className="w-10 h-10 rounded-2xl items-center justify-center"
        style={{ backgroundColor: `${color}20` }}
      >
        <Ionicons name={icon} size={20} color={color} />
      </View>

     <View className="flex-1 min-w-0">
        <Text
          className="text-text-primary dark:text-text-primary-dark text-sm font-semibold tracking-tight"
          numberOfLines={1}
        >
          {name}
        </Text>

        <View className="flex-row items-center mt-1">
          <View className="flex-1 h-1.5 bg-border dark:bg-border-dark rounded-full mr-2 overflow-hidden">
            <View
              className="h-full rounded-full"
              style={{
                width: `${clampedPercentage}%`,
                backgroundColor: color,
              }}
            />
          </View>
          <Text className="text-text-muted dark:text-text-muted-dark text-xs font-medium">
            {clampedPercentage.toFixed(0)}%
          </Text>
        </View>

        <Text className="text-text-muted dark:text-text-muted-dark text-xs mt-1">
          ${amount.toLocaleString()}
        </Text>
      </View>
    </BentoCard>
  );
}
