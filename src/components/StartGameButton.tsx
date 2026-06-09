import { Pressable, Text } from "react-native";

type StartGameButtonProps = {
  onPress?: () => void;
  disabled?: boolean;
};

export function StartGameButton({ onPress, disabled }: StartGameButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      className={`min-h-[56px] items-center justify-center rounded-[14px] border border-primary bg-white ${
        disabled ? "opacity-60" : ""
      }`}
      disabled={disabled}
      onPress={onPress}
    >
      <Text className="text-[17px] font-bold text-primary">Start a Game</Text>
    </Pressable>
  );
}
