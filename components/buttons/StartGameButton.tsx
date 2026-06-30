import { Pressable, Text } from "react-native";

type StartGameButtonProps = {
  onPress?: () => void;
  label?: string;
  disabled?: boolean;
};

export default function StartGameButton({
  onPress,
  label = "start a game",
  disabled = false,
}: StartGameButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`mt-6 rounded-xl px-6 py-3 ${
        disabled ? "bg-purpleaccent/50" : "bg-purpleaccent active:opacity-80"
      }`}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      accessibilityLabel={label}
    >
      <Text className="text-lg font-semibold text-primary">{label}</Text>
    </Pressable>
  );
}
