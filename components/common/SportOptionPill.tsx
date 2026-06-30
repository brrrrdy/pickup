import { Pressable, Text } from "react-native";

type SportOptionPillProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
  accessibilityLabel?: string;
};

export default function SportOptionPill({
  label,
  selected,
  onPress,
  accessibilityLabel,
}: SportOptionPillProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`rounded-full border px-3 py-2 ${
        selected
          ? "border-greenaccent bg-greenaccent"
          : "border-border bg-secondary"
      }`}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={accessibilityLabel ?? label}
    >
      <Text className="text-sm font-medium text-defaulttext">{label}</Text>
    </Pressable>
  );
}
