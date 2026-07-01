import ActionButton from "./ActionButton";
import actionButtonsContent from "../../content/actionbuttons.json";

type FindGameButtonProps = {
  onPress?: () => void;
  label?: string;
  className?: string;
};

export default function FindGameButton({
  onPress,
  label = actionButtonsContent.en.findGame,
  className = "mt-6 bg-greenaccent",
}: FindGameButtonProps) {
  return (
    <ActionButton
      label={label}
      onPress={onPress}
      className={className}
      textClassName="text-lg font-semibold text-defaulttext"
    />
  );
}
