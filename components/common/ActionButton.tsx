import { Pressable, Text } from "react-native";

type ActionButtonProps = {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  className?: string;
  textClassName?: string;
};

export default function ActionButton({
  label,
  onPress,
  disabled = false,
  className = "",
  textClassName = "text-lg font-semibold text-defaulttext",
}: ActionButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`rounded-xl px-6 py-3 ${disabled ? "opacity-60" : "active:opacity-80"} ${className}`.trim()}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      accessibilityLabel={label}
    >
      <Text className={`text-center ${textClassName}`.trim()}>{label}</Text>
    </Pressable>
  );
}
