import { Pressable, Text } from "react-native";

type StartGameButtonProps = {
  onPress?: () => void;
  label?: string;
};

export default function StartGameButton({
  onPress,
  label = "start a game",
}: StartGameButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      className="mt-6 rounded-xl bg-purpleaccent px-6 py-3 active:opacity-80"
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Text className="text-lg font-semibold text-primary">{label}</Text>
    </Pressable>
  );
}
