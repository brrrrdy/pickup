import { LayoutAnimation, Pressable, Text, View } from "react-native";
import type { ReactNode } from "react";

type ProfileAccordionSectionProps = {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  expandLabel: string;
  collapseLabel: string;
  children: ReactNode;
};

export default function ProfileAccordionSection({
  title,
  isOpen,
  onToggle,
  expandLabel,
  collapseLabel,
  children,
}: ProfileAccordionSectionProps) {
  return (
    <View className="w-full max-w-xl rounded-2xl border border-border bg-secondary p-5">
      <Pressable
        onPress={() => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          onToggle();
        }}
        className="flex-row items-center justify-between"
        accessibilityRole="button"
        accessibilityLabel={isOpen ? collapseLabel : expandLabel}
      >
        <Text className="text-base font-semibold text-defaulttext">
          {title}
        </Text>
        <Text className="text-xl text-defaulttext/70">
          {isOpen ? "▴" : "▾"}
        </Text>
      </Pressable>

      {isOpen ? <View className="mt-4 gap-4">{children}</View> : null}
    </View>
  );
}
