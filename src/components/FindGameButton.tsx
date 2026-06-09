import { Pressable, Text } from "react-native";

type FindGameButtonProps = {
  onPress?: () => void;
  disabled?: boolean;
};

export function FindGameButton({ onPress, disabled }: FindGameButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      className={`min-h-[56px] items-center justify-center rounded-[14px] border border-accentpurple bg-accentpurple ${
        disabled ? "opacity-60" : ""
      }`}
      disabled={disabled}
      onPress={onPress}
    >
      <Text className="text-[17px] font-bold text-primary-foreground">
        find a Game
      </Text>
    </Pressable>
  );
}
