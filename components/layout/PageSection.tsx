import { type ReactNode } from "react";
import { View } from "react-native";

type PageSectionProps = {
  children: ReactNode;
  className?: string;
};

export default function PageSection({
  children,
  className = "",
}: PageSectionProps) {
  return <View className={`w-full ${className}`.trim()}>{children}</View>;
}
