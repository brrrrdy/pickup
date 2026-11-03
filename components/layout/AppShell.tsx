import { type ReactNode } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TopNav from "./TopNav";

type AppShellProps = {
  children: ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-primary">
      {/* Top nav */}
      <View
        className="relative z-50 border-b border-transparent px-4 pb-1"
        style={{ paddingTop: 20 + insets.top }}
      >
        <TopNav />
      </View>

      {/* Main content */}
      <View className="z-0 flex-1">{children}</View>
    </View>
  );
}
