import ActionButton from "../common/ActionButton";
import actionButtonsContent from "../../content/actionbuttons.json";

type ViewGameButtonProps = {
  onPress?: () => void;
  label?: string;
  disabled?: boolean;
};

export default function ViewGameButton({
  onPress,
  label = actionButtonsContent.en.viewGame,
  disabled = false,
}: ViewGameButtonProps) {
  return (
    <ActionButton
      label={label}
      onPress={onPress}
      disabled={disabled}
      className="flex-1 border border-defaulttext/20 bg-purpleaccent px-4"
      textClassName="text-base font-semibold font-sans text-secondary"
    />
  );
}
