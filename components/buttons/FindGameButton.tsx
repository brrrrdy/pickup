import { Pressable, Text } from "react-native";

type FindGameButtonProps = {
  onPress?: () => void;
  label?: string;
};

export default function FindGameButton({
  onPress,
  label = "find a game",
}: FindGameButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      className="mt-6 rounded-xl bg-greenaccent px-6 py-3 active:opacity-80"
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Text className="text-lg font-semibold text-defaulttext">{label}</Text>
    </Pressable>
  );
}
