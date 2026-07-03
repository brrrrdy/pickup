import { type ReactNode } from "react";
import { View } from "react-native";

type PageContentProps = {
  children: ReactNode;
  className?: string;
};

export default function PageContent({
  children,
  className = "",
}: PageContentProps) {
  return (
    <View className={`w-full self-center max-w-3xl ${className}`.trim()}>
      {children}
    </View>
  );
}
