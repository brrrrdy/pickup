import ActionButton from "./ActionButton";
import actionButtonsContent from "../../content/actionbuttons.json";

type JoinGameButtonProps = {
  onPress?: () => void;
  label?: string;
  disabled?: boolean;
};

export default function JoinGameButton({
  onPress,
  label = actionButtonsContent.en.joinGame,
  disabled = false,
}: JoinGameButtonProps) {
  return (
    <ActionButton
      label={label}
      onPress={onPress}
      disabled={disabled}
      className="flex-1 bg-greenaccent px-4"
      textClassName="text-base font-semibold text-defaulttext"
    />
  );
}
