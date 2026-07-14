import ActionButton from "../common/ActionButton";
import actionButtonsContent from "../../content/actionbuttons.json";

type ResetButtonProps = {
  onPress?: () => void;
  label?: string;
  disabled?: boolean;
};

export default function ResetButton({
  onPress,
  label = actionButtonsContent.en.reset,
  disabled = false,
}: ResetButtonProps) {
  return (
    <ActionButton
      label={label}
      onPress={onPress}
      disabled={disabled}
      className="mt-3 border border-redaccent/50 bg-redaccent"
      textClassName="text-base font-semibold font-sans text-secondary"
    />
  );
}
