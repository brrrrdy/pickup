import ActionButton from "../common/ActionButton";
import actionButtonsContent from "../../content/actionbuttons.json";

type StartGameButtonProps = {
  onPress?: () => void;
  label?: string;
  disabled?: boolean;
  className?: string;
};

export default function StartGameButton({
  onPress,
  label = actionButtonsContent.en.startGame,
  disabled = false,
  className = "mt-6 bg-purpleaccent",
}: StartGameButtonProps) {
  return (
    <ActionButton
      label={label}
      onPress={onPress}
      disabled={disabled}
      className={className}
      textClassName="text-lg font-semibold font-sans text-primary"
    />
  );
}
