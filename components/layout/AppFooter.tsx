import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function AppFooter() {
  const year = new Date().getFullYear();

  return (
    <View className="w-full gap-2">
      <View className="flex-row flex-wrap gap-4">
        <Link href="/">
          <Text className="text-sm text-defaulttext/70">Home</Text>
        </Link>
        <Link href="/about">
          <Text className="text-sm text-defaulttext/70">About</Text>
        </Link>
        <Link href="/contact">
          <Text className="text-sm text-defaulttext/70">Contact</Text>
        </Link>
      </View>
      <Text className="text-xs text-defaulttext/50">
        © {year} Pickup. All rights reserved.
      </Text>
    </View>
  );
}
