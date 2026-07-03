import { type ReactNode } from "react";
import { View } from "react-native";
import TopNav from "./TopNav";

type AppShellProps = {
  children: ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  return (
    <View className="flex-1 bg-primary">
      {/* Top nav */}
      <View className="relative z-50 border-b border-transparent px-4 pb-3 pt-5">
        <TopNav />
      </View>

      {/* Main content */}
      <View className="z-0 flex-1 px-4 py-6">{children}</View>
    </View>
  );
}
