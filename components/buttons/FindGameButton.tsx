import ActionButton from "./ActionButton";
import actionButtonsContent from "../../content/actionbuttons.json";

type FindGameButtonProps = {
  onPress?: () => void;
  label?: string;
};

export default function FindGameButton({
  onPress,
  label = actionButtonsContent.en.findGame,
}: FindGameButtonProps) {
  return (
    <ActionButton
      label={label}
      onPress={onPress}
      className="mt-6 bg-greenaccent"
      textClassName="text-lg font-semibold text-defaulttext"
    />
  );
}
