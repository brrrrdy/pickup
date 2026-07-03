import ActionButton from "../common/ActionButton";
import actionButtonsContent from "../../content/actionbuttons.json";

type SaveTemplateButtonProps = {
  onPress?: () => void;
  label?: string;
  disabled?: boolean;
};

export default function SaveTemplateButton({
  onPress,
  label = actionButtonsContent.en.saveTemplateToProfile,
  disabled = false,
}: SaveTemplateButtonProps) {
  return (
    <ActionButton
      label={label}
      onPress={onPress}
      disabled={disabled}
      className="mt-3 border border-defaulttext/20 bg-orangeaccent"
      textClassName="text-base font-semibold text-defaulttext"
    />
  );
}
