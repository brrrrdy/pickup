import { type ReactNode } from "react";
import { View } from "react-native";
import { twMerge } from "tailwind-merge";

type PageSectionProps = {
  children: ReactNode;
  className?: string;
};

export default function PageSection({
  children,
  className = "",
}: PageSectionProps) {
  return (
    <View className={twMerge("w-full gap-2.5", className)}>{children}</View>
  );
}
